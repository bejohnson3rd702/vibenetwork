import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  let val = '';
  try {
    if (key === 'VITE_SUPABASE_URL') val = import.meta.env.VITE_SUPABASE_URL;
    if (key === 'VITE_SUPABASE_ANON_KEY') val = import.meta.env.VITE_SUPABASE_ANON_KEY;
  } catch {}
  if (!val && typeof process !== 'undefined' && process.env) {
    val = process.env[key] || '';
  }
  return val || '';
};

const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';

let tenantId = '';
if (typeof window !== 'undefined') {
   const urlParams = new URLSearchParams(window.location.search);
   const hostname = window.location.hostname;
   tenantId = urlParams.get('tenant') || (hostname !== 'localhost' && hostname !== '127.0.0.1' ? hostname : '');
}
export const storageKey = tenantId ? `sb-${tenantId}-auth-token` : 'sb-vibe-master-auth-token';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, { auth: { storageKey } });
