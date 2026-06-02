-- ============================================
-- UPDATE SCHOOL LOGOS TO OFFICIAL SHOPAVO.LA CDN PATHS
-- Run this in the Supabase SQL Editor to bypass client RLS.
-- ============================================

-- 1. UPDATE AVATARS IN PROFILES TABLE
UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/baylor_250_450x321.png?v=1772310012'
WHERE username = 'Baylor University';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/colorado_250_079837fe-206e-4ede-9799-c2b70e4a9eef_350x250.png?v=1772047733'
WHERE username = 'University of Colorado';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/georgia_250_350x250.png?v=1771869535'
WHERE username = 'University of Georgia';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/msu-logo_224x224.png?v=1775102206'
WHERE username = 'Mississippi State University';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/bama_250_350x250.png?v=1771869474'
WHERE username = 'University of Alabama';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/ole_250_350x250.png?v=1771869482'
WHERE username = 'Ole Miss University';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/vandy_500_550x393.png?v=1773770724'
WHERE username = 'Vanderbilt University';

UPDATE public.profiles
SET avatar_url = 'https://shopavo.la/cdn/shop/files/penn-state-header_a0eed267-c288-4f3c-b4a9-493d215ab74d_350x350.png?v=1773642527'
WHERE username = 'Penn State University';


-- 2. UPDATE LOGOS AND THEMES IN WHITELABEL_CONFIGS TABLE
UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/baylor_250_450x321.png?v=1772310012', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/baylor_250_450x321.png?v=1772310012"') 
WHERE name = 'Baylor University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/colorado_250_079837fe-206e-4ede-9799-c2b70e4a9eef_350x250.png?v=1772047733', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/colorado_250_079837fe-206e-4ede-9799-c2b70e4a9eef_350x250.png?v=1772047733"') 
WHERE name = 'University of Colorado' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/georgia_250_350x250.png?v=1771869535', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/georgia_250_350x250.png?v=1771869535"') 
WHERE name = 'University of Georgia' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/msu-logo_224x224.png?v=1775102206', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/msu-logo_224x224.png?v=1775102206"') 
WHERE name = 'Mississippi State University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/bama_250_350x250.png?v=1771869474', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/bama_250_350x250.png?v=1771869474"') 
WHERE name = 'University of Alabama' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/ole_250_350x250.png?v=1771869482', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/ole_250_350x250.png?v=1771869482"') 
WHERE name = 'Ole Miss University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/vandy_500_550x393.png?v=1773770724', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/vandy_500_550x393.png?v=1773770724"') 
WHERE name = 'Vanderbilt University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs 
SET logo = 'https://shopavo.la/cdn/shop/files/penn-state-header_a0eed267-c288-4f3c-b4a9-493d215ab74d_350x350.png?v=1773642527', 
    theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://shopavo.la/cdn/shop/files/penn-state-header_a0eed267-c288-4f3c-b4a9-493d215ab74d_350x350.png?v=1773642527"') 
WHERE name = 'Penn State University' AND parent_network_id IS NOT NULL;


-- 3. VERIFY UPDATES
SELECT name, logo, theme->>'logoImage' as theme_logo FROM public.whitelabel_configs WHERE parent_network_id IS NOT NULL;
