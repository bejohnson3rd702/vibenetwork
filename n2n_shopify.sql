-- ============================================
-- ADD SHOPIFY COLLECTION URLS TO CHILD NETWORKS
-- ============================================

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/baylor"')
WHERE name = 'Baylor University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/colorado"')
WHERE name = 'University of Colorado' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/georgia"')
WHERE name = 'University of Georgia' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/mississippi-state"')
WHERE name = 'Mississippi State University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/pages/avo-x-bama"')
WHERE name = 'University of Alabama' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/ole-miss"')
WHERE name = 'Ole Miss University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/vanderbilt"')
WHERE name = 'Vanderbilt University' AND parent_network_id IS NOT NULL;

UPDATE public.whitelabel_configs
SET theme = jsonb_set(coalesce(theme, '{}'), '{shopifyUrl}', '"https://shopavo.la/collections/penn-state"')
WHERE name = 'Penn State University' AND parent_network_id IS NOT NULL;

-- Verify
SELECT name, theme->>'shopifyUrl' as shopify FROM public.whitelabel_configs WHERE parent_network_id IS NOT NULL ORDER BY name;
