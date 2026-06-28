-- 1. Update the parent network "Muscle & Fitness"
UPDATE public.whitelabel_configs
SET 
  domain = 'muscleandfitness.com',
  logo = '/n2n/muscle_fitness_logo.png',
  theme = '{
    "accent": "#E31B23",
    "heroCopy": "Muscle & Fitness — Your Ultimate Guide to Workouts, Nutrition, Gear, and Athlete Interviews.",
    "heroImage": "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=1600",
    "logoImage": "/n2n/muscle_fitness_logo.png",
    "shopifyUrl": "https://www.muscleandfitness.com/",
    "sliderCount": 4,
    "enableBooking": false,
    "heroLayoutMode": "verbiage",
    "enableWatchLive": true
  }'::jsonb
WHERE id = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';

-- 2. Create the child network "Mr. Olympia" under "Muscle & Fitness"
INSERT INTO public.whitelabel_configs (
  id,
  name,
  domain,
  logo,
  owner_id,
  platform_fee_percentage,
  theme,
  n2n_enabled,
  parent_network_id,
  is_active
) VALUES (
  '7a017c4d-c08f-4260-8540-a0cc8bed4e12',
  'Mr. Olympia',
  'mrolympia.com',
  '/n2n/mr_olympia_logo.png',
  '5d54709a-969e-4fca-a745-118af5cc501d',
  30,
  '{
    "accent": "#D4AF37",
    "heroCopy": "Mr. Olympia — The World\'s Ultimate Bodybuilding Stage and Showcase",
    "heroImage": "/n2n/mr_olympia_hero.png",
    "logoImage": "/n2n/mr_olympia_logo.png",
    "shopifyUrl": "https://mrolympia.com/weekend-schedule",
    "sliderCount": 4,
    "enableBooking": false,
    "heroLayoutMode": "verbiage",
    "enableWatchLive": true
  }'::jsonb,
  false,
  '7a017c4d-c08f-4260-8540-a0cc8bed4e11',
  true
) ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  domain = EXCLUDED.domain,
  logo = EXCLUDED.logo,
  parent_network_id = EXCLUDED.parent_network_id,
  theme = EXCLUDED.theme;
