-- Insert DJ Sets for 'Live Network Schedule'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags, stream_time)
VALUES 
('Lofi Hip Hop Radio - Beats to Relax/Study to', 'https://www.youtube.com/watch?v=jfKfPfyJRdk', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Live', 'Hip Hop'], 'LIVE'),
('Chillhop Radio - Jazzy & Lofi Hip Hop', 'https://www.youtube.com/watch?v=5yx6BWlEVcY', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Lofi', 'Chill'], 'UP NEXT'),
('Calm Piano Radio - Beats to Chill to', 'https://www.youtube.com/watch?v=tfBVp0Zi2iE', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Piano', 'Electronic'], '1:00 AM EST'),
('Morning Coffee - 24/7 Lofi Hip-Hop', 'https://www.youtube.com/watch?v=1fueZCTYkpA', 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Live', 'Hip Hop'], '3:00 AM EST'),
('Dark Ambient Radio - Relaxing Beats', 'https://www.youtube.com/watch?v=S_MOd40zlYU', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Ambient', 'Chill'], '5:00 AM EST');
