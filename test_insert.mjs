import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
const envFile = fs.readFileSync('.env', 'utf8');
const env = {};
envFile.split('\n').forEach(line => {
  const match = line.match(/^([^=]+)=(.*)$/);
  if (match) env[match[1]] = match[2].replace(/^"|"$/g, '');
});

const supabase = createClient(env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY);

async function test() {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: 'test-rls-2@example.com',
    password: 'password123'
  });
  
  if (authData.session) {
    const { data, error } = await supabase.from('whitelabel_configs').insert({
      name: "Test Insert",
      domain: "test.com",
      accent: "#ff0000",
      hero_copy: "Testing",
      logo: "test.png"
    }).select().single();
    
    if (error) console.log("ERROR:", error);
    else console.log("SUCCESS:", data);
  }
}
test();
