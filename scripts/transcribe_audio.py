#!/usr/bin/env python3
import sys
import os
import json
import subprocess
import urllib.request
from datetime import datetime, timezone
import speech_recognition as sr

SUPABASE_URL = os.environ.get('VITE_SUPABASE_URL', 'https://fimzetmvrmbmdggvqzpr.supabase.co')
SUPABASE_KEY = os.environ.get('VITE_SUPABASE_ANON_KEY', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg')

def format_secs(sec):
    m, s = divmod(int(sec), 60)
    return f"{m:02d}:{s:02d}"

def transcribe_video_audio(video_url, query_ids, speaker="Host", max_duration_sec=240):
    temp_dir = f"/tmp/vibe_transcribe_{os.getpid()}"
    os.makedirs(temp_dir, exist_ok=True)
    full_wav = os.path.join(temp_dir, "full.wav")
    chunk_pattern = os.path.join(temp_dir, "chunk_%03d.wav")
    ffmpeg_bin = "/opt/homebrew/bin/ffmpeg" if os.path.exists("/opt/homebrew/bin/ffmpeg") else "ffmpeg"

    try:
        # Step 1: Download and resample audio from video URL to a single local 16kHz WAV
        cmd1 = [
            ffmpeg_bin, "-y", "-i", video_url,
            "-t", str(max_duration_sec),
            "-vn", "-ar", "16000", "-ac", "1",
            full_wav
        ]
        subprocess.run(cmd1, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Step 2: Slice the local WAV into 20-second segments
        cmd2 = [
            ffmpeg_bin, "-y", "-i", full_wav,
            "-f", "segment", "-segment_time", "20",
            chunk_pattern
        ]
        subprocess.run(cmd2, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, check=True)

        # Step 3: Transcribe each segment concurrently using Google Speech Recognition
        chunks = sorted([f for f in os.listdir(temp_dir) if f.startswith("chunk_") and f.endswith(".wav")])

        def process_chunk(item):
            i, chunk = item
            chunk_path = os.path.join(temp_dir, chunk)
            sec = i * 20
            time_str = format_secs(sec)
            try:
                r = sr.Recognizer()
                with sr.AudioFile(chunk_path) as source:
                    audio = r.record(source)
                text = r.recognize_google(audio)
                if text and text.strip():
                    return {
                        "time": time_str,
                        "seconds": sec,
                        "speaker": speaker,
                        "text": text.strip(),
                        "isRecorded": True
                    }
            except Exception:
                pass
            return None

        import concurrent.futures
        with concurrent.futures.ThreadPoolExecutor(max_workers=6) as executor:
            results = list(executor.map(process_chunk, enumerate(chunks)))
        segments = [s for s in results if s is not None]

        # Step 4: Save to Supabase video_transcripts table if segments found
        if segments:
            headers = {
                "apikey": SUPABASE_KEY,
                "Authorization": f"Bearer {SUPABASE_KEY}",
                "Content-Type": "application/json",
                "Prefer": "resolution=merge-duplicates"
            }
            for q_id in query_ids:
                if not q_id:
                    continue
                payload = json.dumps({
                    "video_id": q_id,
                    "transcript": segments,
                    "created_at": datetime.now(timezone.utc).isoformat()
                }).encode("utf-8")
                try:
                    req = urllib.request.Request(
                        f"{SUPABASE_URL}/rest/v1/video_transcripts?on_conflict=video_id",
                        data=payload,
                        headers=headers,
                        method="POST"
                    )
                    with urllib.request.urlopen(req) as resp:
                        pass
                except Exception as save_err:
                    sys.stderr.write(f"Supabase save notice: {save_err}\n")

        return segments
    finally:
        try:
            import shutil
            shutil.rmtree(temp_dir, ignore_errors=True)
        except Exception:
            pass

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "Missing video_url"}))
        sys.exit(1)

    video_url = sys.argv[1]
    query_id = sys.argv[2] if len(sys.argv) > 2 else video_url
    speaker = sys.argv[3] if len(sys.argv) > 3 else "Channel Speaker"
    
    query_ids = list(set([video_url, query_id]))
    results = transcribe_video_audio(video_url, query_ids, speaker)
    print(json.dumps({"success": True, "segments": results}))
