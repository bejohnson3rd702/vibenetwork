import { supabase } from './supabaseClientLoader.ts';

async function run() {
  const { data, error } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('id', '7a017c4d-c08f-4260-8540-a0cc8bed4e11')
    .single();

  if (error) {
    console.error("Error:", error.message);
    return;
  }

  console.log("Config:", JSON.stringify(data, null, 2));
}

run();
