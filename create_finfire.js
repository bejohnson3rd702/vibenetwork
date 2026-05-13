import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://fimzetmvrmbmdggvqzpr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg'
);

async function run() {
  const finfirePayload = {
    name: 'FinFire',
    domain: 'finfire.com',
    logo: '', // We will let the user upload the exact logo via dashboard since the chat attachment isn't a direct URL
    theme: {
      accent: '#1178B5',
      bg: '#000000',
      heroTitle: 'FINFIRE',
      heroCopy: 'FinFire was created to be the trusted bridge between enterprises and capital markets worldwide. We empower entrepreneurs with data-backed insights, best-fit capital matches, and ongoing support.',
      btnPrimary: 'Get Funded',
      sliderCount: 4,
      heroImage: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2000', // High fidelity financial/tech architecture background
      heroLayoutMode: 'verbiage',
      customSections: 'Capital Markets, Best-Fit Matches, Insights & Support'
    }
  };

  const { data, error } = await supabase
    .from('whitelabel_configs')
    .insert(finfirePayload)
    .select()
    .single();

  if (error) {
    console.error('Error creating FinFire network:', error);
  } else {
    console.log('Successfully created FinFire network! ID:', data.id);
  }
}

run();
