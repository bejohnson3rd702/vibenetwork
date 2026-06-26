-- Create video_transcripts table
CREATE TABLE IF NOT EXISTS public.video_transcripts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id TEXT UNIQUE NOT NULL, -- YouTube ID (e.g. 'SV7JP7y80UM') or database video UUID
  transcript JSONB NOT NULL,     -- Array of { time: string, seconds: number, speaker: string, text: string }
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.video_transcripts ENABLE ROW LEVEL SECURITY;

-- Allow public read-only access to transcripts
DROP POLICY IF EXISTS "Allow public read access to video_transcripts" ON public.video_transcripts;
CREATE POLICY "Allow public read access to video_transcripts"
  ON public.video_transcripts FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage transcripts
DROP POLICY IF EXISTS "Allow write access to video_transcripts for authenticated users" ON public.video_transcripts;
CREATE POLICY "Allow write access to video_transcripts for authenticated users"
  ON public.video_transcripts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
