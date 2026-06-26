import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const env = fs.readFileSync('.env', 'utf-8');
const url = env.match(/VITE_SUPABASE_URL="?(.*?)"?$/m)[1];
const key = env.match(/VITE_SUPABASE_ANON_KEY="?(.*?)"?$/m)[1];
const supabase = createClient(url, key);

async function run() {
  const profileId = '19a1f776-daa5-460b-8dc9-c89dd4cb4d06';
  const localFilePath = 'public/phuzn_channel_bg.png';
  const fileBuffer = fs.readFileSync(localFilePath);
  
  const ext = 'png';
  const storagePath = `${profileId}/bg_${Date.now()}.${ext}`;
  
  console.log(`Uploading ${localFilePath} to Supabase storage at ${storagePath}...`);
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('images')
    .upload(storagePath, fileBuffer, {
      contentType: 'image/png',
      upsert: true
    });
    
  if (uploadError) {
    console.error("Storage Upload Error:", uploadError);
    return;
  }
  
  const { data: publicUrlData } = supabase.storage
    .from('images')
    .getPublicUrl(storagePath);
    
  const newUrl = publicUrlData.publicUrl;
  console.log(`Uploaded successfully! Public URL: ${newUrl}`);
  
  console.log(`Updating profile ${profileId} homepage_image_url...`);
  const { error: updateError } = await supabase
    .from('profiles')
    .update({ homepage_image_url: newUrl })
    .eq('id', profileId);
    
  if (updateError) {
    console.error("Database Update Error:", updateError);
  } else {
    console.log("Database updated successfully!");
  }
}
run();
