const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);
(async () => {
    const { data: users, error: fetchErr } = await supabase.from('profiles').select('*').limit(1);
    if (fetchErr) {
        console.error("Fetch Error:", fetchErr);
        return;
    }
    if (!users || users.length === 0) {
        console.log("No users found.");
        return;
    }
    const user = users[0];
    console.log("User ID:", user.id);
    console.log("Current Fee:", user.platform_fee_percentage);
    
    const { data, error } = await supabase.from('profiles').update({ platform_fee_percentage: 22 }).eq('id', user.id).select();
    console.log("Update Error:", error);
    console.log("Update Data:", data);
})();
