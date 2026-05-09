-- Insert DJ Sets for 'Live Network Schedule'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags, stream_time)
VALUES 
('Fred Again.. - Studio Live Session', 'https://www.youtube.com/watch?v=c0-hvjV2A5Y', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Live', 'House'], 'LIVE'),
('NCS Release - Electronic Mix', 'https://www.youtube.com/watch?v=TW9d8vYrVFQ', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Electronic', 'Chill'], 'UP NEXT'),
('NCS Release - Deep House', 'https://www.youtube.com/watch?v=TFmk45vUD38', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Deep House', 'Electronic'], '1:00 AM EST'),
('NCS Release - Main Stage EDM', 'https://www.youtube.com/watch?v=K4DyBUG242c', 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['EDM', 'Festival'], '3:00 AM EST'),
('NCS Release - Studio Session', 'https://www.youtube.com/watch?v=3nQNiWdeH2Q', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Studio', 'Chill'], '5:00 AM EST');
