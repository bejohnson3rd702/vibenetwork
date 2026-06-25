-- Database migration script to add missing columns to the profiles table
-- Run this script in your Supabase SQL Editor:

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS cover_image TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS flipbook_images TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS stripe_account_id TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS refund_policy TEXT DEFAULT 'All sales are final. No refunds are provided for digital downloads or virtual bookings. For physical merchandise, please contact the creator directly.';
