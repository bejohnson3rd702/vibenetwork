/*
-- 1. Remove any duplicate or incomplete FinFire records
DELETE FROM whitelabel_configs WHERE domain = 'finfire.com';

-- 2. Insert the correct record with the background image AND the owner_id assigned to the Master Admin
INSERT INTO whitelabel_configs (name, domain, logo, theme, owner_id)
VALUES (
  'FINFIRE',
  'finfire.com',
  NULL,
  '{
    "accent": "#1178B5", 
    "bg": "#000000", 
    "heroImage": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2500",
    "heroCopy": "FinFire was created to be the trusted bridge between enterprises and capital markets worldwide. We empower entrepreneurs with data-backed insights, best-fit capital matches, and ongoing support.", 
    "btnPrimary": "Get Funded", 
    "sliderCount": 4, 
    "heroLayoutMode": "verbiage", 
    "customSections": "Capital Markets, Best-Fit Matches, Insights & Support", 
    "heroTitle": "FINFIRE"
  }'::jsonb,
  (SELECT id FROM profiles ORDER BY created_at ASC LIMIT 1) -- Assigns the God Admin as the owner so the profile loads
);
*/
