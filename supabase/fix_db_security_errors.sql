-- ==============================================================================
-- DATABASE ADVISOR / SECURITY HARDENING MIGRATION
-- Resolves all 9 Supabase Database Security Advisor errors:
--   - 5 tables with RLS disabled in public schema (series, episodes, categories, videos, temp_results)
--   - 4 functions with mutable search_path (handle_new_user, execute_sql, protect_profile_admin_elevation, query_sql)
-- ==============================================================================

-- 1. SECURE FUNCTIONS: Fix mutable search_path on SECURITY DEFINER functions
ALTER FUNCTION public.handle_new_user() SET search_path = public, auth, pg_temp;
ALTER FUNCTION public.execute_sql(text) SET search_path = public, auth, pg_temp;
ALTER FUNCTION public.protect_profile_admin_elevation() SET search_path = public, auth, pg_temp;
ALTER FUNCTION public.query_sql(text) SET search_path = public, auth, pg_temp;

-- 2. ENABLE ROW LEVEL SECURITY ON ALL UNPROTECTED TABLES
ALTER TABLE public.series ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temp_results ENABLE ROW LEVEL SECURITY;

-- 3. ENSURE CLEAN POLICIES ON CATEGORIES
DROP POLICY IF EXISTS "Categories are viewable by everyone." ON public.categories;
DROP POLICY IF EXISTS "Allow public read access for categories" ON public.categories;
CREATE POLICY "Allow public read access for categories"
  ON public.categories FOR SELECT
  USING (true);

-- 4. ENSURE CLEAN POLICIES ON EPISODES
DROP POLICY IF EXISTS "Public read episodes" ON public.episodes;
DROP POLICY IF EXISTS "Allow public read access for episodes" ON public.episodes;
CREATE POLICY "Allow public read access for episodes"
  ON public.episodes FOR SELECT
  USING (true);

-- 5. ENSURE CLEAN POLICIES ON SERIES
DROP POLICY IF EXISTS "Public read series" ON public.series;
DROP POLICY IF EXISTS "Allow public read access for series" ON public.series;
DROP POLICY IF EXISTS "Allow users to insert own series" ON public.series;
DROP POLICY IF EXISTS "Allow users to update own series" ON public.series;
CREATE POLICY "Allow public read access for series"
  ON public.series FOR SELECT
  USING (true);

-- 6. ENSURE CLEAN POLICIES ON VIDEOS
DROP POLICY IF EXISTS "Videos are viewable by everyone." ON public.videos;
DROP POLICY IF EXISTS "Allow public read access for videos" ON public.videos;
CREATE POLICY "Allow public read access for videos"
  ON public.videos FOR SELECT
  USING (true);

-- Allow creator or admin video insert/update
DROP POLICY IF EXISTS "Creators or admins can insert videos" ON public.videos;
CREATE POLICY "Creators or admins can insert videos"
  ON public.videos FOR INSERT
  WITH CHECK (
    auth.uid() = creator_id OR 
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

DROP POLICY IF EXISTS "Creators or admins can update videos" ON public.videos;
CREATE POLICY "Creators or admins can update videos"
  ON public.videos FOR UPDATE
  USING (
    auth.uid() = creator_id OR 
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- 7. ENSURE POLICIES ON TEMP_RESULTS
DROP POLICY IF EXISTS "Allow access to temp_results" ON public.temp_results;
CREATE POLICY "Allow access to temp_results"
  ON public.temp_results FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);
