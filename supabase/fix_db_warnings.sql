-- ==============================================================================
-- DATABASE ADVISOR / PERFORMANCE & INTEGRITY HARDENING MIGRATION
-- Resolves all Supabase Database Advisor Warnings:
--   1. Drops duplicate index on profiles(username)
--   2. Adds covering indexes for all 32 unindexed foreign keys
--   3. Consolidates duplicate / overlapping permissive RLS policies
-- ==============================================================================

-- 1. DROP DUPLICATE INDEX
DROP INDEX IF EXISTS public.idx_profiles_username;

-- 2. CREATE COVERING INDEXES FOR UNINDEXED FOREIGN KEYS
CREATE INDEX IF NOT EXISTS idx_drive_files_whitelabel_id ON public.drive_files (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_drive_files_creator_id ON public.drive_files (creator_id);
CREATE INDEX IF NOT EXISTS idx_videos_whitelabel_id ON public.videos (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_crm_integrations_whitelabel_id ON public.crm_integrations (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_crm_integrations_creator_id ON public.crm_integrations (creator_id);
CREATE INDEX IF NOT EXISTS idx_crm_contacts_creator_id ON public.crm_contacts (creator_id);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.favorites (user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_video_id ON public.favorites (video_id);
CREATE INDEX IF NOT EXISTS idx_ledger_buyer_id ON public.ledger (buyer_id);
CREATE INDEX IF NOT EXISTS idx_ledger_creator_id ON public.ledger (creator_id);
CREATE INDEX IF NOT EXISTS idx_crm_pipelines_whitelabel_id ON public.crm_pipelines (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_crm_pipelines_creator_id ON public.crm_pipelines (creator_id);
CREATE INDEX IF NOT EXISTS idx_system_logs_actor_id ON public.system_logs (actor_id);
CREATE INDEX IF NOT EXISTS idx_network_leads_whitelabel_id ON public.network_leads (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_post_likes_user_id ON public.post_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_post_id ON public.post_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_post_comments_user_id ON public.post_comments (user_id);
CREATE INDEX IF NOT EXISTS idx_crm_pipeline_stages_pipeline_id ON public.crm_pipeline_stages (pipeline_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_stage_id ON public.crm_opportunities (stage_id);
CREATE INDEX IF NOT EXISTS idx_network_channels_whitelabel_id ON public.network_channels (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_network_posts_channel_id ON public.network_posts (channel_id);
CREATE INDEX IF NOT EXISTS idx_network_posts_author_id ON public.network_posts (author_id);
CREATE INDEX IF NOT EXISTS idx_network_comments_post_id ON public.network_comments (post_id);
CREATE INDEX IF NOT EXISTS idx_network_comments_author_id ON public.network_comments (author_id);
CREATE INDEX IF NOT EXISTS idx_network_likes_user_id ON public.network_likes (user_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_contact_id ON public.crm_opportunities (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_opportunities_assigned_user_id ON public.crm_opportunities (assigned_user_id);
CREATE INDEX IF NOT EXISTS idx_crm_contact_activities_contact_id ON public.crm_contact_activities (contact_id);
CREATE INDEX IF NOT EXISTS idx_crm_contact_activities_created_by ON public.crm_contact_activities (created_by);
CREATE INDEX IF NOT EXISTS idx_crm_sync_logs_integration_id ON public.crm_sync_logs (integration_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_whitelabel_id ON public.user_follows (whitelabel_id);
CREATE INDEX IF NOT EXISTS idx_user_follows_target_profile_id ON public.user_follows (target_profile_id);

-- 3. CONSOLIDATE DUPLICATE / OVERLAPPING PERMISSIVE POLICIES

-- bookings: consolidate insert & select
DROP POLICY IF EXISTS "Users can insert bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow users to insert own bookings" ON public.bookings;
CREATE POLICY "Users can insert bookings"
  ON public.bookings FOR INSERT
  WITH CHECK (auth.uid() = creator_id OR auth.uid() = buyer_id);

DROP POLICY IF EXISTS "Users can read own bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read access for bookings" ON public.bookings;
CREATE POLICY "Allow public read access for bookings"
  ON public.bookings FOR SELECT
  USING (true);

-- courses: consolidate insert & select
DROP POLICY IF EXISTS "Public read courses" ON public.courses;
DROP POLICY IF EXISTS "Allow public read access for courses" ON public.courses;
CREATE POLICY "Allow public read access for courses"
  ON public.courses FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Creators can insert courses" ON public.courses;
DROP POLICY IF EXISTS "Allow users to insert own courses" ON public.courses;
CREATE POLICY "Creators can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

-- platform_settings
DROP POLICY IF EXISTS "Admins can insert platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can insert platform_settings" ON public.platform_settings;
CREATE POLICY "Admins can insert platform_settings"
  ON public.platform_settings FOR INSERT
  WITH CHECK ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

DROP POLICY IF EXISTS "Admins can update platform settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Admins can update platform_settings" ON public.platform_settings;
CREATE POLICY "Admins can update platform_settings"
  ON public.platform_settings FOR UPDATE
  USING ((SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true);

DROP POLICY IF EXISTS "Public read access to settings" ON public.platform_settings;
DROP POLICY IF EXISTS "Allow public read access for platform_settings" ON public.platform_settings;
CREATE POLICY "Allow public read access for platform_settings"
  ON public.platform_settings FOR SELECT
  USING (true);

-- post_comments: remove leftover Testing Insert All
DROP POLICY IF EXISTS "Testing Insert All" ON public.post_comments;

-- post_likes: remove leftover Testing Insert All
DROP POLICY IF EXISTS "Testing Insert All" ON public.post_likes;

-- posts: remove leftover Testing Insert All
DROP POLICY IF EXISTS "Testing Insert All" ON public.posts;

-- products: remove leftover Testing Insert All & duplicate policies
DROP POLICY IF EXISTS "Testing Insert All" ON public.products;
DROP POLICY IF EXISTS "Creators can insert products" ON public.products;
DROP POLICY IF EXISTS "Allow users to insert own products" ON public.products;
CREATE POLICY "Allow users to insert own products"
  ON public.products FOR INSERT
  WITH CHECK (auth.uid() = creator_id);

DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Allow public read access for products" ON public.products;
CREATE POLICY "Allow public read access for products"
  ON public.products FOR SELECT
  USING (true);

-- profiles: consolidate duplicate read
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON public.profiles;
DROP POLICY IF EXISTS "Allow public read access for profiles" ON public.profiles;
CREATE POLICY "Allow public read access for profiles"
  ON public.profiles FOR SELECT
  USING (true);

-- system_logs: consolidate duplicate insert/read
DROP POLICY IF EXISTS "Anyone can insert logs" ON public.system_logs;
DROP POLICY IF EXISTS "Allow anyone to insert system logs" ON public.system_logs;
CREATE POLICY "Allow anyone to insert system logs"
  ON public.system_logs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can read system logs" ON public.system_logs;
DROP POLICY IF EXISTS "Allow anyone to read system logs" ON public.system_logs;
CREATE POLICY "Allow anyone to read system logs"
  ON public.system_logs FOR SELECT
  USING (true);

-- video_transcripts: consolidate duplicate write policy
DROP POLICY IF EXISTS "Allow authenticated write to video_transcripts" ON public.video_transcripts;
DROP POLICY IF EXISTS "Allow admin write access to video_transcripts" ON public.video_transcripts;
CREATE POLICY "Allow authenticated write to video_transcripts"
  ON public.video_transcripts FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- videos: drop redundant admin-only policies superseded by Creators or admins
DROP POLICY IF EXISTS "Admins can insert videos" ON public.videos;
DROP POLICY IF EXISTS "Admins can update videos" ON public.videos;

-- whitelabel_configs: consolidate duplicate read/insert/update
DROP POLICY IF EXISTS "Allow public read access" ON public.whitelabel_configs;
DROP POLICY IF EXISTS "Allow public read access for whitelabel_configs" ON public.whitelabel_configs;
CREATE POLICY "Allow public read access for whitelabel_configs"
  ON public.whitelabel_configs FOR SELECT
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own whitelabel config" ON public.whitelabel_configs;
DROP POLICY IF EXISTS "Admins can insert whitelabel configs" ON public.whitelabel_configs;
DROP POLICY IF EXISTS "Anyone can insert whitelabel_configs" ON public.whitelabel_configs;
CREATE POLICY "Anyone can insert whitelabel_configs"
  ON public.whitelabel_configs FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Users can update their own whitelabel config" ON public.whitelabel_configs;
DROP POLICY IF EXISTS "Admins can update whitelabel configs" ON public.whitelabel_configs;
DROP POLICY IF EXISTS "Anyone can update whitelabel_configs" ON public.whitelabel_configs;
CREATE POLICY "Anyone can update whitelabel_configs"
  ON public.whitelabel_configs FOR UPDATE
  USING (true);

-- ledger: consolidate select
DROP POLICY IF EXISTS "Admins can view global ledger" ON public.ledger;
DROP POLICY IF EXISTS "Allow users to view own ledger" ON public.ledger;
CREATE POLICY "Allow users or admins to view ledger"
  ON public.ledger FOR SELECT
  USING (
    buyer_id = auth.uid() OR 
    creator_id = auth.uid() OR 
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

-- profiles: consolidate update
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Allow users to update own profile" ON public.profiles;
CREATE POLICY "Allow users or admins to update profiles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id OR 
    (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true
  );

