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
('NCS Release - Electronic Mix', 'https://www.youtube.com/watch?v=B-m7X1-T1hQ', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['House', 'Live']),
('NCS Release - Deep House', 'https://www.youtube.com/watch?v=zyXmsVwZqX4', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Hip Hop', 'Festival']),
('NCS Release - Main Stage EDM', 'https://www.youtube.com/watch?v=pytdWKT-NV4', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Deep House', 'Sunset']);

-- Insert DJ Sets for 'Underground Mixes'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags)
VALUES 
('NCS Release - Studio Session', 'https://www.youtube.com/watch?v=eBaGlo1b3ZY', 'https://images.unsplash.com/photo-1558369178-6656d78216fc?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Techno', 'Classic']),
('NCS Release - Club Afterhours', 'https://www.youtube.com/watch?v=U9pGr6KMdyg', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Afro House']);
