import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

let tenantId = '';
if (typeof window !== 'undefined') {
   const urlParams = new URLSearchParams(window.location.search);
   const hostname = window.location.hostname;
   tenantId = urlParams.get('tenant') || (hostname !== 'localhost' && hostname !== '127.0.0.1' ? hostname : '');
}
export const storageKey = tenantId ? `sb-${tenantId}-auth-token` : 'sb-vibe-master-auth-token';

export const supabase = (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') && (supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE')
  ? createClient(supabaseUrl, supabaseAnonKey, { auth: { storageKey } }) 
  : null;
