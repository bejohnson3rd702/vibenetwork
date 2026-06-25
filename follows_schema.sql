-- ===================================================
-- VIBE FOLLOWS & SUBSCRIPTIONS MIGRATION
-- Run this in your Supabase SQL Editor
-- ===================================================

CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    whitelabel_id UUID REFERENCES public.whitelabel_configs(id) ON DELETE CASCADE,
    target_profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'follow', -- 'follow' or 'subscribe'
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Ensure exactly one target is specified
    CONSTRAINT check_target_specified CHECK (
        (whitelabel_id IS NOT NULL AND target_profile_id IS NULL) OR
        (whitelabel_id IS NULL AND target_profile_id IS NOT NULL)
    ),
    
    -- Unique constraint: user can follow/subscribe to a specific target once
    CONSTRAINT unique_user_follow_whitelabel UNIQUE (user_id, whitelabel_id, type),
    CONSTRAINT unique_user_follow_profile UNIQUE (user_id, target_profile_id, type)
);

-- Enable RLS
ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Policies
DROP POLICY IF EXISTS user_follows_policy ON public.user_follows;
CREATE POLICY user_follows_policy ON public.user_follows
    FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS user_follows_read_policy ON public.user_follows;
CREATE POLICY user_follows_read_policy ON public.user_follows
    FOR SELECT USING (true);
