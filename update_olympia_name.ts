import { supabase } from './supabaseClientLoader.ts';

async function run() {
  const parentId = '7a017c4d-c08f-4260-8540-a0cc8bed4e11';
  console.log("Updating Mr. Olympian parent whitelabel config name and logo...");

  // Fetch current config to make sure we don't wipe out other theme fields
  const { data: current, error: fetchError } = await supabase
    .from('whitelabel_configs')
    .select('*')
    .eq('id', parentId)
    .single();

  if (fetchError || !current) {
    console.error("❌ Failed to fetch current config:", fetchError?.message);
    return;
  }

  const updatedTheme = {
    ...(current.theme || {}),
    logoImage: '/n2n/mr_olympia_logo.png',
    heroCopy: 'Mr. Olympia — Official Weekend Schedule & Gear'
  };

  const { data, error } = await supabase
    .from('whitelabel_configs')
    .update({
      name: 'Mr. Olympia',
      logo: '/n2n/mr_olympia_logo.png',
      theme: updatedTheme
    })
    .eq('id', parentId)
    .select();

  if (error) {
    console.error("❌ Update failed:", error.message);
  } else {
    console.log("✅ Mr. Olympia parent config updated successfully:", JSON.stringify(data[0], null, 2));
  }
}

run().catch(console.error);
