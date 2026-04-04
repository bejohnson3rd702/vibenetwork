import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Safely initialize the client ONLY if the user has provided their real URL and Key in the .env file
export const supabase = (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL_HERE') && (supabaseAnonKey && supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE')
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
