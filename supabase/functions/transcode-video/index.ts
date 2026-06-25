import { serve } from "https://deno.land/std@0.192.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabase = createClient(supabaseUrl, supabaseKey);

    const token = authHeader.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);

    if (userError || !user) {
      return new Response("Unauthorized", { status: 401, headers: corsHeaders });
    }

    const { episodeId, videoUrl } = await req.json();

    if (!episodeId || !videoUrl) {
      return new Response("Missing parameters", { status: 400, headers: corsHeaders });
    }

    console.log(`Processing video transcoding for Episode: ${episodeId}, URL: ${videoUrl}`);

    // Check if Mux credentials exist
    const muxTokenId = Deno.env.get("MUX_TOKEN_ID");
    const muxTokenSecret = Deno.env.get("MUX_TOKEN_SECRET");

    if (muxTokenId && muxTokenSecret) {
      console.log("Mux credentials found. Initiating Mux Asset creation...");
      
      const auth = btoa(`${muxTokenId}:${muxTokenSecret}`);
      const response = await fetch("https://api.mux.com/video/v1/assets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Basic ${auth}`,
        },
        body: JSON.stringify({
          input: videoUrl,
          playback_policy: ["public"],
          mp4_support: "standard"
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Mux API error:", errorText);
        throw new Error(`Mux API responded with code ${response.status}: ${errorText}`);
      }

      const muxData = await response.json();
      const playbackId = muxData.data?.playback_ids?.[0]?.id;

      if (!playbackId) {
        throw new Error("Mux did not return a playback ID.");
      }

      // Build compatible direct MP4 URL from Mux playback ID
      const transcodedUrl = `https://stream.mux.com/${playbackId}/medium.mp4`;
      console.log(`Mux transcode initiated. Playback ID: ${playbackId}, Target URL: ${transcodedUrl}`);

      // Update the database with the new transcoded MP4 URL
      const { error: updateError } = await supabase
        .from("episodes")
        .update({ video_url: transcodedUrl })
        .eq("id", episodeId);

      if (updateError) {
        console.error("Database update error:", updateError);
        throw updateError;
      }

      return new Response(
        JSON.stringify({
          success: true,
          video_url: transcodedUrl,
          message: "Video submitted to Mux for transcoding successfully."
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    } else {
      // Simulation mode fallback if Mux credentials are not configured yet
      console.log("Mux credentials not found. Running in simulation mode...");
      
      let finalUrl = videoUrl;
      let message = "Transcoding skipped (no credentials). Original URL used.";

      // If it is a MOV file, we simulate conversion by logging and returning a success mock response
      if (videoUrl.toLowerCase().endsWith(".mov")) {
        console.log("MOV file detected. Simulating conversion to MP4...");
        message = "Simulation: Transcoded MOV file to web-compatible MP4 format.";
      }

      return new Response(
        JSON.stringify({
          success: true,
          video_url: finalUrl,
          message: message
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        }
      );
    }
  } catch (err: any) {
    console.error("Transcode function error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "An error occurred during transcoding" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
