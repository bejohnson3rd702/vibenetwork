-- Migration: Add genre and rating columns to episodes table
-- Run this script in your Supabase SQL Editor.

ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS genre TEXT;
ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS rating TEXT;
