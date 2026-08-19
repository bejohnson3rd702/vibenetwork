-- Increase video storage file size limit to 5 GB (5,368,709,120 bytes)
-- Run this script in your Supabase SQL Editor:

-- 1. Ensure videos storage bucket exists with 5GB limit & video mime types allowed
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'videos',
  'videos',
  true,
  5368709120, -- 5 GB limit
  ARRAY['video/mp4', 'video/quicktime', 'video/mov', 'video/x-m4v', 'video/webm', 'video/avi', 'video/x-matroska', 'video/*']
)
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5368709120,
  allowed_mime_types = ARRAY['video/mp4', 'video/quicktime', 'video/mov', 'video/x-m4v', 'video/webm', 'video/avi', 'video/x-matroska', 'video/*'];

-- 2. Storage security RLS policy for videos bucket
CREATE POLICY "Public Access Videos" ON storage.objects
  FOR SELECT USING (bucket_id = 'videos');

CREATE POLICY "Authenticated Upload Videos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'videos');

CREATE POLICY "Authenticated Update Videos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'videos');

CREATE POLICY "Authenticated Delete Videos" ON storage.objects
  FOR DELETE USING (bucket_id = 'videos');
