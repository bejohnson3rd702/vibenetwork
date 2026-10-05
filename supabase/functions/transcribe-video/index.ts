// Supabase Edge Function: transcribe-video
//
// Receives one ~30s chunk of 16 kHz mono WAV audio (extracted in the browser at
// upload time), sends it to WWTC Speech-to-Text using the server-side API key,
// and merges the recognized segment into `video_transcripts` with the service
// role (bypassing the admin-only RLS write policy).
//
// Transcripts are keyed by storage path: "videos/<user_id>/<file>".
//
// Required secrets:  supabase secrets set WWTC_API_KEY=...
// Deploy:            npx supabase functions deploy transcribe-video

import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const WWTC_API_BASE = "https://api.worldwidetechconnections.com";
const MAX_CHUNK_BYTES = 4 * 1024 * 1024; // ~2 min of 16 kHz mono PCM; we send 30s chunks
const LANG_RE = /^[a-z-]{2,60}$/;

interface Segment {
  time: string;
  seconds: number;
  speaker: string;
  text: string;
  translatedText?: string;
  isRecorded: true;
}

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function formatSecs(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  try {
    const wwtcKey = Deno.env.get("WWTC_API_KEY");
    if (!wwtcKey) return json({ error: "WWTC_API_KEY secret not configured" }, 500);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    // ── Auth ────────────────────────────────────────────────────────────────
    const token = (req.headers.get("Authorization") ?? "").replace(/^Bearer\s+/i, "");
    if (!token) return json({ error: "Unauthorized" }, 401);
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) return json({ error: "Unauthorized" }, 401);

    // ── Input ───────────────────────────────────────────────────────────────
    const form = await req.formData();
    const videoKey = String(form.get("videoKey") ?? "");
    const startSec = Math.max(0, Math.floor(Number(form.get("startSec") ?? 0)));
    const speaker = String(form.get("speaker") ?? "Channel Speaker").slice(0, 100);
    const sourceLang = String(form.get("sourceLang") ?? "english-united-states");
    const targetLang = String(form.get("targetLang") ?? "spanish-international");
    const reset = form.get("reset") === "true";
    const audio = form.get("audio");

    if (!/^videos\/[^/]+\/[^/]+$/.test(videoKey)) {
      return json({ error: "videoKey must look like videos/<user_id>/<file>" }, 400);
    }
    if (!LANG_RE.test(sourceLang) || !LANG_RE.test(targetLang)) {
      return json({ error: "Invalid language code" }, 400);
    }
    if (!(audio instanceof File) || audio.size === 0 || audio.size > MAX_CHUNK_BYTES) {
      return json({ error: "Missing or oversized audio chunk" }, 400);
    }

    // ── Ownership: caller must own the file (path prefix) or be an admin ────
    const ownerId = videoKey.split("/")[1];
    if (ownerId !== user.id) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();
      if (profile?.is_admin !== true) return json({ error: "Forbidden" }, 403);
    }

    // ── WWTC Speech-to-Text ─────────────────────────────────────────────────
    // WWTC expects the raw WAV bytes as the request body (multipart returns "STT not available").
    const wwtcRes = await fetch(
      `${WWTC_API_BASE}/services/stt/${sourceLang}/${targetLang}`,
      {
        method: "POST",
        headers: {
          accept: "application/json",
          "api-authorization": wwtcKey,
          "Content-Type": "audio/wav",
        },
        body: await audio.arrayBuffer(),
      },
    );
    if (!wwtcRes.ok) {
      const detail = await wwtcRes.text().catch(() => "");
      console.warn(`[transcribe-video] WWTC ${wwtcRes.status}: ${detail.slice(0, 300)}`);
      return json({ error: `WWTC STT failed (${wwtcRes.status})` }, 502);
    }
    const stt = await wwtcRes.json();
    const text = String(stt?.source_text ?? "").trim();

    // Load existing transcript (unless this is the first chunk of a fresh run)
    let segments: Segment[] = [];
    if (!reset) {
      const { data: existing } = await supabase
        .from("video_transcripts")
        .select("transcript")
        .eq("video_id", videoKey)
        .maybeSingle();
      if (Array.isArray(existing?.transcript)) segments = existing!.transcript as Segment[];
    }

    let segment: Segment | null = null;
    if (text) {
      segment = {
        time: formatSecs(startSec),
        seconds: startSec,
        speaker,
        text,
        translatedText: stt?.translated_text ? String(stt.translated_text) : undefined,
        isRecorded: true,
      };
      segments = segments.filter((s) => s.seconds !== startSec);
      segments.push(segment);
      segments.sort((a, b) => a.seconds - b.seconds);
    }

    if (segments.length > 0 || reset) {
      const { error: upsertError } = await supabase
        .from("video_transcripts")
        .upsert(
          { video_id: videoKey, transcript: segments, created_at: new Date().toISOString() },
          { onConflict: "video_id" },
        );
      if (upsertError) {
        console.warn("[transcribe-video] upsert error:", upsertError.message);
        return json({ error: "Failed to save transcript" }, 500);
      }
    }

    return json({ success: true, segment, totalSegments: segments.length });
  } catch (err) {
    console.error("[transcribe-video] error:", err);
    return json({ error: "Internal error" }, 500);
  }
});
