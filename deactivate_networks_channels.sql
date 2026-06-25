-- SQL Migration to add is_active column for deactivating networks and channels
-- Run this script in your Supabase SQL Editor:

ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
