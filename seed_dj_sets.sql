-- Delete all existing videos and categories to clear out the boring corporate content
DELETE FROM public.videos;
DELETE FROM public.categories;

-- Re-seed the 'Live Network Schedule' category
INSERT INTO public.categories (id, title)
VALUES ('00000000-0000-0000-0000-000000000001', 'Live Network Schedule');

-- Re-seed the DJ set categories (Removed 'Live Concerts & Festivals')
INSERT INTO public.categories (id, title)
VALUES 
('00000000-0000-0000-0000-000000000002', 'Featured DJ Sets'),
('00000000-0000-0000-0000-000000000004', 'Underground Mixes');

-- Insert DJ Sets for 'Featured DJ Sets'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags)
VALUES 
('Lofi Hip Hop Radio', 'https://www.youtube.com/watch?v=jfKfPfyJRdk', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['House', 'Live']),
('Chillhop Radio', 'https://www.youtube.com/watch?v=5yx6BWlEVcY', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Hip Hop', 'Festival']),
('Synthwave Radio', 'https://www.youtube.com/watch?v=tfBVp0Zi2iE', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Deep House', 'Sunset']);

-- Insert DJ Sets for 'Underground Mixes'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags)
VALUES 
('Spinnin Records Mix', 'https://www.youtube.com/watch?v=qH3fETPsqXU', 'https://images.unsplash.com/photo-1558369178-6656d78216fc?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Techno', 'Classic']),
('Deep House Radio', 'https://www.youtube.com/watch?v=c0-hvjV2A5Y', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Afro House']);
