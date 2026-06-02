-- ============================================
-- UPDATE: Real college images for N2N children
-- Images are served from /n2n/ in the public folder
-- ============================================

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/baylor.png"'::jsonb)
WHERE name = 'Baylor University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/colorado.png"'::jsonb)
WHERE name = 'University of Colorado' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/georgia.png"'::jsonb)
WHERE name = 'University of Georgia' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/mississippi-state.png"'::jsonb)
WHERE name = 'Mississippi State University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/alabama.png"'::jsonb)
WHERE name = 'University of Alabama' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/ole-miss.png"'::jsonb)
WHERE name = 'Ole Miss University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/vanderbilt.png"'::jsonb)
WHERE name = 'Vanderbilt University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs SET theme = jsonb_set(theme, '{heroImage}', '"/n2n/penn-state.png"'::jsonb)
WHERE name = 'Penn State University' AND parent_network_id IS NOT NULL;

-- Verify
SELECT name, theme->>'heroImage' as image FROM public.whitelabel_configs WHERE parent_network_id IS NOT NULL ORDER BY name;
