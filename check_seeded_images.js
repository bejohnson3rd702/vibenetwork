import { supabase } from './supabaseClientLoader.ts';

async function test() {
  console.log('Fetching videos...');
  const { data, error } = await supabase
    .from('videos')
    .select('id, title, image_url, video_url');
  
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log(`Found ${data.length} videos:`);
  for (const v of data) {
    console.log(`Video: "${v.title}"`);
    console.log(`  Image URL: ${v.image_url}`);
    console.log(`  Video URL: ${v.video_url}`);
  }
}

test();
