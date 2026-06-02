-- ============================================
-- CLEANUP: Remove duplicate N2N entries
-- Keeps the FIRST (oldest) of each, deletes the rest
-- ============================================

-- Delete duplicate children (keep oldest per name)
DELETE FROM public.whitelabel_configs
WHERE id IN (
  SELECT id FROM (
    SELECT id, name, parent_network_id,
      ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as rn
    FROM public.whitelabel_configs
    WHERE parent_network_id IS NOT NULL
  ) dupes
  WHERE rn > 1
);

-- Delete duplicate AVO NETWORK parents (keep oldest)
DELETE FROM public.whitelabel_configs
WHERE id IN (
  SELECT id FROM (
    SELECT id, name,
      ROW_NUMBER() OVER (PARTITION BY name ORDER BY created_at ASC) as rn
    FROM public.whitelabel_configs
    WHERE name = 'AVO NETWORK'
  ) dupes
  WHERE rn > 1
);

-- Verify: should show exactly 9 rows (1 parent + 8 children)
SELECT id, name, n2n_enabled, parent_network_id 
FROM public.whitelabel_configs 
WHERE name = 'AVO NETWORK' OR parent_network_id IS NOT NULL 
ORDER BY parent_network_id NULLS FIRST, name;
