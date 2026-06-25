-- Migration: Add video_url and thumbnail_url columns to episodes table
-- Run this script in your Supabase SQL Editor.

ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS video_url TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS thumbnail_url TEXT;
