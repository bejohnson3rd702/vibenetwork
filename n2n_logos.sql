-- ============================================
-- SET SCHOOL LOGOS AS PROFILE AVATARS
-- Uses official school logo URLs for each child network profile
-- ============================================

-- Baylor University (green bear)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Baylor_Bears_logo.svg/1200px-Baylor_Bears_logo.svg.png'
WHERE username = 'Baylor University';

-- University of Colorado (CU Buffaloes)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Colorado_Buffaloes_logo.svg/1200px-Colorado_Buffaloes_logo.svg.png'
WHERE username = 'University of Colorado';

-- University of Georgia (Bulldogs G)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Georgia_Bulldogs_logo.svg/1200px-Georgia_Bulldogs_logo.svg.png'
WHERE username = 'University of Georgia';

-- Mississippi State (maroon M with dog)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mississippi_State_Bulldogs_logo.svg/1200px-Mississippi_State_Bulldogs_logo.svg.png'
WHERE username = 'Mississippi State University';

-- University of Alabama (crimson A)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/1200px-Alabama_Crimson_Tide_logo.svg.png'
WHERE username = 'University of Alabama';

-- Ole Miss (red/blue)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ole_Miss_Rebels_logo.svg/1200px-Ole_Miss_Rebels_logo.svg.png'
WHERE username = 'Ole Miss University';

-- Vanderbilt (gold V)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vanderbilt_Commodores_logo.svg/1200px-Vanderbilt_Commodores_logo.svg.png'
WHERE username = 'Vanderbilt University';

-- Penn State (Nittany Lion)
UPDATE public.profiles
SET avatar_url = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Penn_State_Nittany_Lions_logo.svg/1200px-Penn_State_Nittany_Lions_logo.svg.png'
WHERE username = 'Penn State University';

-- Also update the whitelabel_configs logo field to match
UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Baylor_Bears_logo.svg/1200px-Baylor_Bears_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Baylor_Bears_logo.svg/1200px-Baylor_Bears_logo.svg.png"') WHERE name = 'Baylor University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Colorado_Buffaloes_logo.svg/1200px-Colorado_Buffaloes_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Colorado_Buffaloes_logo.svg/1200px-Colorado_Buffaloes_logo.svg.png"') WHERE name = 'University of Colorado' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Georgia_Bulldogs_logo.svg/1200px-Georgia_Bulldogs_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Georgia_Bulldogs_logo.svg/1200px-Georgia_Bulldogs_logo.svg.png"') WHERE name = 'University of Georgia' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mississippi_State_Bulldogs_logo.svg/1200px-Mississippi_State_Bulldogs_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/3/3a/Mississippi_State_Bulldogs_logo.svg/1200px-Mississippi_State_Bulldogs_logo.svg.png"') WHERE name = 'Mississippi State University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/1200px-Alabama_Crimson_Tide_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Alabama_Crimson_Tide_logo.svg/1200px-Alabama_Crimson_Tide_logo.svg.png"') WHERE name = 'University of Alabama' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ole_Miss_Rebels_logo.svg/1200px-Ole_Miss_Rebels_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Ole_Miss_Rebels_logo.svg/1200px-Ole_Miss_Rebels_logo.svg.png"') WHERE name = 'Ole Miss University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vanderbilt_Commodores_logo.svg/1200px-Vanderbilt_Commodores_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Vanderbilt_Commodores_logo.svg/1200px-Vanderbilt_Commodores_logo.svg.png"') WHERE name = 'Vanderbilt University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET logo = 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Penn_State_Nittany_Lions_logo.svg/1200px-Penn_State_Nittany_Lions_logo.svg.png', theme = jsonb_set(coalesce(theme,'{}'), '{logoImage}', '"https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Penn_State_Nittany_Lions_logo.svg/1200px-Penn_State_Nittany_Lions_logo.svg.png"') WHERE name = 'Penn State University' AND parent_network_id IS NOT NULL;

-- Verify
SELECT p.username, p.avatar_url FROM public.profiles p WHERE p.username IN ('Baylor University','University of Colorado','University of Georgia','Mississippi State University','University of Alabama','Ole Miss University','Vanderbilt University','Penn State University') ORDER BY p.username;
