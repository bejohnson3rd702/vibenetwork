-- ==============================================================================
-- PRODUCTION SECURITY HARDENING MIGRATION
-- Run this script in the Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. HARDEN video_transcripts ROW LEVEL SECURITY
ALTER TABLE IF EXISTS public.video_transcripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow write access to video_transcripts for public users" ON public.video_transcripts;
DROP POLICY IF EXISTS "Allow write access to video_transcripts for authenticated users" ON public.video_transcripts;
DROP POLICY IF EXISTS "Allow admin write access to video_transcripts" ON public.video_transcripts;
DROP POLICY IF EXISTS "Allow public read access to video_transcripts" ON public.video_transcripts;

-- Allow public read-only access (for video captions / subtitles)
CREATE POLICY "Allow public read access to video_transcripts"
  ON public.video_transcripts FOR SELECT
  TO public
  USING (true);

-- Only allow authenticated administrators to insert/update/delete transcripts
CREATE POLICY "Allow admin write access to video_transcripts"
  ON public.video_transcripts FOR ALL
  TO authenticated
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);


-- 2. PROTECT profiles.is_admin FROM UNAUTHORIZED ELEVATION
CREATE OR REPLACE FUNCTION public.protect_profile_admin_elevation()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_admin IS DISTINCT FROM OLD.is_admin THEN
    IF auth.role() = 'service_role' THEN
      RETURN NEW;
    END IF;

    IF NOT EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    ) THEN
      RAISE EXCEPTION 'Unauthorized: Only an existing administrator can grant or revoke admin status.';
    END IF;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_admin ON public.profiles;

CREATE TRIGGER trg_protect_profile_admin
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE PROCEDURE public.protect_profile_admin_elevation();
