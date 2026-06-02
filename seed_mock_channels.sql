-- ====================================================================
-- SEED MOCK FEMALE CHANNELS AND POSTS FOR N2N CHILD NETWORKS
-- Run this script in the Supabase Dashboard SQL Editor.
-- It will insert 2 mock female profiles and 2 posts per profile 
-- for each of the 8 child college networks.
-- ====================================================================

-- Ensure schema updates are applied first
ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS n2n_enabled BOOLEAN DEFAULT false;
ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS parent_network_id UUID REFERENCES public.whitelabel_configs(id);
ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;

DO $$
DECLARE
  v_parent_id UUID := '3915f1e5-4c79-4b2a-ad41-7029ce8052d7';
  v_child_id UUID;
  v_prof1_id UUID;
  v_prof2_id UUID;
BEGIN
  -- 1. Penn State University
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'Penn State University' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: emily_nittany
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'emily_nittany') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'emily_nittany', 'Track & Field athlete at PSU. Passionate about fitness, fashion, and gameday style! 👟✨', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'Styling the new blue and white AVO hoodie for the big game! This material is incredibly soft. 💙🏈 #WeAre #gamedaystyle', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600', 145, false, false),
        (v_prof1_id, 'Morning track workout done, now time to study! Wearing the activewear line from AVO. 👟☀️ #studentathlete', 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&q=80&w=600', 98, false, false);
      RAISE NOTICE 'Seeded emily_nittany for Penn State';
    END IF;

    -- Profile 2: chloe_psu
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'chloe_psu') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'chloe_psu', 'Penn State senior. Here to show off the best blue and white fits. 💙🏈', 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Gameday countdown is on! Ready for the whiteout. Check out my selection of custom fits from AVO! 🤍✨', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600', 178, false, false),
        (v_prof2_id, 'Fall vibes on campus. Loving the cozy feel of these new crewnecks. 🍂🍁', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600', 112, false, false);
      RAISE NOTICE 'Seeded chloe_psu for Penn State';
    END IF;
  ELSE
    RAISE NOTICE 'Penn State University child network not found';
  END IF;

  -- 2. University of Alabama
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'University of Alabama' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: bama_sarah
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'bama_sarah') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'bama_sarah', 'Bama girl living in a Crimson world. Roll Tide! 🐘❤️', 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'Roll Tide! Tailgating in style with my crimson AVO crop top. Let''s get this W! 🐘🏈', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600', 214, false, false),
        (v_prof1_id, 'Strolling through the Quad on a sunny afternoon. Loving this weather and this fit. ☀️❤️', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', 130, false, false);
      RAISE NOTICE 'Seeded bama_sarah for Alabama';
    END IF;

    -- Profile 2: roll_tide_jenna
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'roll_tide_jenna') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'roll_tide_jenna', 'Cheerleader at UA. Outfits, workouts, and campus vibes. 📣✨', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Pre-game practice vibes! Ready to lead the crowd today. Crimson styling rules. 📣🏈', 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&q=80&w=600', 165, false, false),
        (v_prof2_id, 'Living for the energy in Bryant-Denny Stadium! Can''t wait for kickoff! 🏟️🙌', 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=600', 248, false, false);
      RAISE NOTICE 'Seeded roll_tide_jenna for Alabama';
    END IF;
  ELSE
    RAISE NOTICE 'University of Alabama child network not found';
  END IF;

  -- 3. Ole Miss University
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'Ole Miss University' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: rebel_taylor
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'rebel_taylor') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'rebel_taylor', 'Ole Miss lifestyle, fashion, and gameday tailgates. Hotty Toddy! ❤️💙', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'The Grove is looking beautiful today! Gameday outfit checklist: red dress, boots, and AVO accessories. 👗✨ #HottyToddy', 'https://images.unsplash.com/photo-1488161628813-04466f872be2?auto=format&fit=crop&q=80&w=600', 189, false, false),
        (v_prof1_id, 'Oxford weekends are the absolute best. Exploring the square in my casual AVO sweatshirt! ☕️💙', 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=600', 104, false, false);
      RAISE NOTICE 'Seeded rebel_taylor for Ole Miss';
    END IF;

    -- Profile 2: olemiss_brooke
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'olemiss_brooke') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'olemiss_brooke', 'Marketing major & Rebels fan. Styling Ole Miss style guides! 👗✨', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Sharing my custom styling guide for this season''s tailgate line. Hit the link in bio to shop! 🛍️❤️', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600', 152, false, false),
        (v_prof2_id, 'Nothing compares to gameday Saturdays in Mississippi! Let''s go Rebels! 🏈💙', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=600', 193, false, false);
      RAISE NOTICE 'Seeded olemiss_brooke for Ole Miss';
    END IF;
  ELSE
    RAISE NOTICE 'Ole Miss University child network not found';
  END IF;

  -- 4. Vanderbilt University
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'Vanderbilt University' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: vandy_sophia
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'vandy_sophia') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'vandy_sophia', 'Vandy student sharing chic campus style & game day outfits in Nashville. ⚓️🖤💛', 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'Anchor Down! Styling black and gold for the weekend. This AVO knit top is a staple. ⚓️💛', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600', 119, false, false),
        (v_prof1_id, 'Perfect day for a walk around campus! Wearing my favorite comfy AVO shorts. 🌳📚', 'https://images.unsplash.com/photo-1502086223501-7ea6ecd79368?auto=format&fit=crop&q=80&w=600', 88, false, false);
      RAISE NOTICE 'Seeded vandy_sophia for Vanderbilt';
    END IF;

    -- Profile 2: lauren_anchored
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'lauren_anchored') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'lauren_anchored', 'Soccer player at Vanderbilt. Living the student-athlete life. ⚽️⚓️', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Big match tonight! Post-practice fits sponsored by AVO. Let''s get it! ⚽️🖤', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600', 167, false, false),
        (v_prof2_id, 'Work hard, play hard. Ready for the gameday weekend at Vanderbilt! ⚓️🏟️', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600', 134, false, false);
      RAISE NOTICE 'Seeded lauren_anchored for Vanderbilt';
    END IF;
  ELSE
    RAISE NOTICE 'Vanderbilt University child network not found';
  END IF;

  -- 5. University of Georgia
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'University of Georgia' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: uga_olivia
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'uga_olivia') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'uga_olivia', 'Athens native, Bulldog forever. Styling classic red and black fits. 🐶❤️', 'https://images.unsplash.com/photo-1541647376583-d1fca57c7754?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'How ''bout them Dawgs! Rocking this vintage style AVO sweatshirt in Athens today. ❤️🐶', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600', 211, false, false),
        (v_prof1_id, 'Athens afternoons call for coffee and cozy layers. Loving this look! ☕️🍂', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600', 124, false, false);
      RAISE NOTICE 'Seeded uga_olivia for Georgia';
    END IF;

    -- Profile 2: dawg_madison
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'dawg_madison') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'dawg_madison', 'UGA Gymnast. Championing fitness, lifestyle, and gameday looks. 🤸‍♀️❤️', 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Gym session finished! Testing the new high-performance AVO active wear line. Verdict: 10/10. 🤸‍♀️✨', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80&w=600', 188, false, false),
        (v_prof2_id, 'Nothing matches the energy of Sanford Stadium! Red and black always. 🏟️🐶', 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&q=80&w=600', 276, false, false);
      RAISE NOTICE 'Seeded dawg_madison for Georgia';
    END IF;
  ELSE
    RAISE NOTICE 'University of Georgia child network not found';
  END IF;

  -- 6. Mississippi State University
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'Mississippi State University' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: hail_state_hannah
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'hail_state_hannah') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'hail_state_hannah', 'MS State cheerleader. Bring the cowbell & the best maroon fits! 🔔🐮', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'Hail State! Cowbell ready, maroon outfit on point. Ready for cheering on our Bulldogs! 🔔🏈 #HailState', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=600', 174, false, false),
        (v_prof1_id, 'Vibe check in Starkville! Loving the new AVO collection for this gameday. 🐶❤️', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600', 119, false, false);
      RAISE NOTICE 'Seeded hail_state_hannah for Mississippi State';
    END IF;

    -- Profile 2: msstate_charlotte
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'msstate_charlotte') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'msstate_charlotte', 'Miss State student. Lover of tailgates, Southern style, and sports! 🏈🐕', 'https://images.unsplash.com/photo-1506919258185-6078bba55d2a?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Southern style meets gameday spirit. Obsessed with this maroon matching set! 👗📣', 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?auto=format&fit=crop&q=80&w=600', 144, false, false),
        (v_prof2_id, 'Best season of the year! Mississippi tailgates are unmatched. 🏟️✨', 'https://images.unsplash.com/photo-1554412933-514a83d2f3c8?auto=format&fit=crop&q=80&w=600', 165, false, false);
      RAISE NOTICE 'Seeded msstate_charlotte for Mississippi State';
    END IF;
  ELSE
    RAISE NOTICE 'Mississippi State University child network not found';
  END IF;

  -- 7. Baylor University
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'Baylor University' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: baylor_bella
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'baylor_bella') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'baylor_bella', 'Baylor Bears fan. Green & gold looks, college fashion, and Waco spots! 🐻💚', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'Sic ''Em Bears! Green and gold has never looked better. Check out my AVO custom edit! 🐻💛', 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=600', 198, false, false),
        (v_prof1_id, 'Beautiful day in Waco! Grabbing a Dr Pepper and enjoying the sun. ☀️🐻', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&q=80&w=600', 142, false, false);
      RAISE NOTICE 'Seeded baylor_bella for Baylor';
    END IF;

    -- Profile 2: bears_lily
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'bears_lily') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'bears_lily', 'Baylor tennis player. Sharing my court fits and gameday gear. 🎾💚', 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Warm-up style in green and gold! Tennis season is looking bright. 🎾🐻 #SicEm', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&q=80&w=600', 165, false, false),
        (v_prof2_id, 'Post-training cooling down. This activewear fit from AVO is super light and breathable! 👟💪', 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80&w=600', 121, false, false);
      RAISE NOTICE 'Seeded bears_lily for Baylor';
    END IF;
  ELSE
    RAISE NOTICE 'Baylor University child network not found';
  END IF;

  -- 8. University of Colorado
  SELECT id INTO v_child_id FROM public.whitelabel_configs WHERE name = 'University of Colorado' AND parent_network_id = v_parent_id;
  IF v_child_id IS NOT NULL THEN
    -- Profile 1: buffs_zoe
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'buffs_zoe') THEN
      v_prof1_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof1_id, 'buffs_zoe', 'Boulder native & Buffs fan. Gameday fits, hiking, and activewear style. 🦬🏔️', 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof1_id, 'Shoulder-season hiking in Boulder! Staying warm and stylish with the new AVO windbreaker. 🏔️🖤💛 #GoBuffs', 'https://images.unsplash.com/photo-1614283233556-f35b0c801ef1?auto=format&fit=crop&q=80&w=600', 167, false, false),
        (v_prof1_id, 'Sko Buffs! Ready to cheer on Colorado in black and gold this weekend. 🦬✨', 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&q=80&w=600', 211, false, false);
      RAISE NOTICE 'Seeded buffs_zoe for Colorado';
    END IF;

    -- Profile 2: colorado_mia
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE username = 'colorado_mia') THEN
      v_prof2_id := gen_random_uuid();
      INSERT INTO public.profiles (id, username, bio, avatar_url, role, whitelabel_id, sub_price, platform_fee_percentage)
      VALUES (v_prof2_id, 'colorado_mia', 'CU Boulder senior. Keeping it cozy & stylish in black and gold. 💛🖤', 'https://images.unsplash.com/photo-1619380061814-58f03707f082?auto=format&fit=crop&q=80&w=256&h=256', 'influencer', v_child_id, 4.99, 15.00);
      
      INSERT INTO public.posts (creator_id, content, image_url, likes, is_locked, is_pinned)
      VALUES 
        (v_prof2_id, 'Cozy campus style. Loving the oversized AVO crewneck for early lectures. 🍂🎒', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=600', 142, false, false),
        (v_prof2_id, 'Fall sunset in Boulder is something else. Golden hour with the golden fits. ☀️🦬', 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&q=80&w=600', 188, false, false);
      RAISE NOTICE 'Seeded colorado_mia for Colorado';
    END IF;
  ELSE
    RAISE NOTICE 'University of Colorado child network not found';
  END IF;

END $$;
