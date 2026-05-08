const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setHero() {
  const { data: config } = await supabase.from('whitelabel_configs').select('*').eq('domain', 'jamiesgirls.com').single();
  const theme = config.theme || {};
  theme.heroImage = 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=2500&q=80';
  const { error } = await supabase.from('whitelabel_configs').update({ theme }).eq('domain', 'jamiesgirls.com');
  console.log("Updated?", error ? error : "Success");
}
setHero();
