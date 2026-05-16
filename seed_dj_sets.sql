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
('Fred again.. - Boiler Room London', 'https://www.youtube.com/watch?v=c0-hvjV2A5Y', 'https://images.unsplash.com/photo-1598387181032-a3103a2db5b3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['House', 'Live']),
('Peggy Gou - Boiler Room London', 'https://www.youtube.com/watch?v=Fa8LQLy4C5A', 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Deep House', 'DJ Set']),
('Solomun - Boiler Room Tulum', 'https://www.youtube.com/watch?v=bk6Xst6euQk', 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Techno', 'Tulum']),
('Chris Stussy - Boiler Room Edinburgh', 'https://www.youtube.com/watch?v=42XFNGZrpaQ', 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Tech House', 'Live']),
('Charli xcx - Boiler Room PARTYGIRL', 'https://www.youtube.com/watch?v=rKPBq_j4buQ', 'https://images.unsplash.com/photo-1526478806334-5fd488fcaabc?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000002', ARRAY['Electronic', 'Club']);

-- Insert DJ Sets for 'Underground Mixes'
INSERT INTO public.videos (title, video_url, image_url, category_id, tags)
VALUES 
('Ben Böhmer - Cercle Cappadocia', 'https://www.youtube.com/watch?v=RvRhUHTV_8k', 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Melodic House', 'Live']),
('ISOxo - Boiler Room Calgary', 'https://www.youtube.com/watch?v=3fqz-7T6Y6w', 'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&w=800&q=80', '00000000-0000-0000-0000-000000000004', ARRAY['Trap', 'EDM']),
('VTSS b2b KI/KI - Boiler Room Glitch', 'https://www.youtube.com/watch?v=I1mhJjxtJx4', '/covers/shm_arena.png', '00000000-0000-0000-0000-000000000004', ARRAY['Techno', 'B2B']),
('3ballMTY - Boiler Room Mexico City', 'https://www.youtube.com/watch?v=9Nk9Of8XGtg', '/covers/calvin_festival.png', '00000000-0000-0000-0000-000000000004', ARRAY['Electronic', 'Live']),
('horsegiirL - Boiler Room CDMX', 'https://www.youtube.com/watch?v=Q9FaUe4b0wI', '/covers/carl_cox.png', '00000000-0000-0000-0000-000000000004', ARRAY['Hard Dance', 'Techno']);
