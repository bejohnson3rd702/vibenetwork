import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
    const { data, error } = await supabase.from('profiles').select('id, username, whitelabel_id, role').order('created_at', { ascending: false }).limit(10);
    console.log('Error:', error);
    console.log('Recent Profiles:', data);
}
check();
