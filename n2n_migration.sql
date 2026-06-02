-- ============================================
-- N2N MIGRATION + SEED DATA
-- Run this ONCE in the Supabase SQL Editor
-- ============================================

-- 1. Add N2N columns
ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS n2n_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS parent_network_id UUID REFERENCES public.whitelabel_configs(id);
CREATE INDEX IF NOT EXISTS idx_whitelabel_parent ON public.whitelabel_configs(parent_network_id);

-- 2. Create AVO NETWORK (parent)
INSERT INTO public.whitelabel_configs (name, domain, logo, n2n_enabled, platform_fee_percentage, theme)
VALUES (
  'AVO NETWORK',
  'shopavo.la',
  'https://shopavo.la/cdn/shop/files/fav-icon_32x32.png?v=1731445399',
  true,
  15,
  '{"accent": "#D35400", "heroCopy": "AVO NETWORK — The Future of College Apparel", "heroImage": "https://images.unsplash.com/photo-1523050854058-8df90110c476?auto=format&fit=crop&q=80&w=2000", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
)
ON CONFLICT DO NOTHING;

-- 3. Get the parent ID and create children
DO $$
DECLARE
  parent_uuid UUID;
BEGIN
  SELECT id INTO parent_uuid FROM public.whitelabel_configs WHERE name = 'AVO NETWORK' LIMIT 1;
  
  IF parent_uuid IS NULL THEN
    RAISE NOTICE 'AVO NETWORK not found!';
    RETURN;
  END IF;

  -- Enable N2N on the parent (in case it already existed)
  UPDATE public.whitelabel_configs SET n2n_enabled = true WHERE id = parent_uuid;

  -- Baylor University
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('Baylor University', 'baylor.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#154734", "heroCopy": "Sic Em Bears — Premium Gameday Apparel", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- University of Colorado
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('University of Colorado', 'colorado.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#CFB87C", "heroCopy": "Go Buffs — Official Colorado Gameday Gear", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- University of Georgia
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('University of Georgia', 'georgia.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#BA0C2F", "heroCopy": "Go Dawgs — Premium UGA Apparel", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- Mississippi State University
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('Mississippi State University', 'msstate.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#660000", "heroCopy": "Hail State — Official Bulldog Apparel", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- University of Alabama
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('University of Alabama', 'alabama.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#9E1B32", "heroCopy": "Roll Tide — Premium Crimson Tide Gear", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- Ole Miss University
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('Ole Miss University', 'olemiss.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#CE1126", "heroCopy": "Hotty Toddy — Official Rebels Apparel", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- Vanderbilt University
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('Vanderbilt University', 'vanderbilt.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#866D4B", "heroCopy": "Anchor Down — Premium Commodores Gear", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  -- Penn State University
  INSERT INTO public.whitelabel_configs (name, domain, parent_network_id, n2n_enabled, platform_fee_percentage, theme)
  VALUES ('Penn State University', 'pennstate.avoclothing.com', parent_uuid, false, 30,
    '{"accent": "#041E42", "heroCopy": "We Are — Official Nittany Lions Apparel", "heroImage": "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&q=80&w=1200", "enableWatchLive": true, "enableBooking": false, "heroLayoutMode": "verbiage", "sliderCount": 4}'::jsonb
  ) ON CONFLICT DO NOTHING;

  RAISE NOTICE 'N2N seed complete! Parent ID: %', parent_uuid;
END $$;

-- 4. Print the tenant URL to use
SELECT id, name, n2n_enabled, parent_network_id FROM public.whitelabel_configs WHERE name = 'AVO NETWORK' OR parent_network_id IS NOT NULL ORDER BY parent_network_id NULLS FIRST;
