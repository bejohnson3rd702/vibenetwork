-- ============================================
-- CREATE PROFILES FOR EACH N2N CHILD NETWORK
-- One profile per child, named after the college
-- (Fixed: no owner_id update - FK constraint)
-- ============================================

DO $$
DECLARE
  child RECORD;
BEGIN
  FOR child IN
    SELECT id, name, theme->>'accent' as accent
    FROM public.whitelabel_configs
    WHERE parent_network_id = '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
  LOOP
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE whitelabel_id = child.id AND username = child.name) THEN
      INSERT INTO public.profiles (id, username, role, whitelabel_id, avatar_url, bio, created_at)
      VALUES (
        gen_random_uuid(),
        child.name,
        'influencer',
        child.id,
        'https://ui-avatars.com/api/?name=' || replace(child.name, ' ', '+') || '&background=' || replace(coalesce(child.accent, '333333'), '#', '') || '&color=fff&size=256&bold=true',
        'Official ' || child.name || ' Network Profile',
        now()
      );
      RAISE NOTICE 'Created profile for %', child.name;
    ELSE
      RAISE NOTICE 'Profile already exists for %', child.name;
    END IF;
  END LOOP;
END $$;

-- Verify
SELECT p.username, p.role, p.whitelabel_id, p.bio
FROM public.profiles p
JOIN public.whitelabel_configs wl ON p.whitelabel_id = wl.id
WHERE wl.parent_network_id = '3915f1e5-4c79-4b2a-ad41-7029ce8052d7'
ORDER BY p.username;
