-- Remove Featured DJ Sets and Underground Mixes categories
DELETE FROM public.categories WHERE title IN ('Featured DJ Sets', 'Underground Mixes');
