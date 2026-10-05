-- Tighten storage policies for the `videos` bucket.
-- REVIEW BEFORE RUNNING in the Supabase SQL Editor.
--
-- Today any client can INSERT/UPDATE/DELETE any object in `videos`
-- (policies only check bucket_id), so any visitor can overwrite or delete
-- another creator's video (uploads use upsert).
--
-- After this script:
--   * Anyone can still READ (bucket is public).
--   * Signed-in users can write only inside their own folder: videos/<auth.uid()>/...
--   * Admins (profiles.is_admin = true) can write anywhere, which covers the
--     shared folders used by admin tools: broadcasts/, hero/, kple_videos/, kple_commercials/.
--
-- ⚠️ If non-admin users upload to the shared kple_* folders, those uploads
--    will start failing. Move them to per-user paths first, or add those
--    folders to the policy below.

DROP POLICY IF EXISTS "Authenticated Upload Videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Update Videos" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated Delete Videos" ON storage.objects;

CREATE POLICY "Videos: owner or admin insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'videos' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
    )
  );

-- Needed for upsert (x-upsert: true) and TUS resumable uploads
CREATE POLICY "Videos: owner or admin update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (
    bucket_id = 'videos' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
    )
  );

CREATE POLICY "Videos: owner or admin delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'videos' AND (
      (storage.foldername(name))[1] = auth.uid()::text
      OR EXISTS (SELECT 1 FROM public.profiles p WHERE p.id = auth.uid() AND p.is_admin = true)
    )
  );
