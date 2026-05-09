-- The heroVideoUrl and heroVideoTitle are stored inside the 'theme' JSONB column in whitelabel_configs!
UPDATE public.whitelabel_configs
SET theme = theme || jsonb_build_object(
    'heroVideoUrl', 'https://www.youtube.com/watch?v=jfKfPfyJRdk',
    'heroVideoTitle', 'Lofi Hip Hop Radio'
)
WHERE theme->>'heroVideoUrl' LIKE '%u4ZoJKF_VuA%' 
   OR theme->>'heroVideoUrl' IS NULL 
   OR theme->>'heroVideoUrl' = '';

-- Also ensure the fallback videos in the videos table are updated
UPDATE public.videos
SET video_url = 'https://www.youtube.com/watch?v=jfKfPfyJRdk'
WHERE video_url LIKE '%u4ZoJKF_VuA%';
