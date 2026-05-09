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
('DJ LEX - Coffee Link Up', 'https://www.youtube.com/watch?v=rwzOqYKKIU8', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['House', 'Live']),
('Flavor Town - Chill Rooftop House', 'https://www.youtube.com/watch?v=I4QIqm8hCvo', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Hip Hop', 'Festival']),
('Soulection - Sahar Habibi Takeover', 'https://www.youtube.com/watch?v=ODpLPXCAKDA', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Deep House', 'Sunset']);

-- Insert DJ Sets for 'Underground Mixes'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags)
VALUES 
('DJ Jazzy Jeff - Magnificent Lunch Break', 'https://www.youtube.com/watch?v=DSna6V9QOxo', 'https://images.unsplash.com/photo-1558369178-6656d78216fc?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Techno', 'Classic']),
('DJ Jazzy Jeff - Boiler Room Mix', 'https://www.youtube.com/watch?v=IvPdwoppGw4', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Afro House']);

-- Insert DJ Sets for 'Live Network Schedule'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags, stream_time)
VALUES 
('DJ Nico - Miami Bass & Ghetto Tech Mix', 'https://www.youtube.com/watch?v=treSXuhsjyc', 'https://images.unsplash.com/photo-1571266028243-3716f02d2d2e?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Live', 'Bass'], 'LIVE'),
('Nico Blitz - Sunday Cleaning Mix', 'https://www.youtube.com/watch?v=MeOs4TdH08Y', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Hip Hop', 'Hits'], 'UP NEXT'),
('DJ LEX - Hip Hop & R&B Bangers', 'https://www.youtube.com/watch?v=dEBkiLIwYFs', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['R&B', 'Live'], '1:00 AM EST'),
('Flavor Town - Morning Disco House Mix', 'https://www.youtube.com/watch?v=BKdb1xNEGoY', 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Disco', 'House'], '3:00 AM EST'),
('Soulection - Full Crate Takeover', 'https://www.youtube.com/watch?v=3gh3eLGVQX0', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000001', ARRAY['Reggae', 'Blends'], '5:00 AM EST');
