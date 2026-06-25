-- Migration: Add video_url column to episodes table for real video playback and streaming.
-- Run this script in your Supabase SQL Editor.

ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS video_url TEXT;
