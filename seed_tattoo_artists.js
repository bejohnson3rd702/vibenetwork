import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const artists = [
  { username: 'InkMaster_Jay', email: 'jay@sacredserpent.test', password: 'password123', bio: 'Specializing in traditional Japanese irezumi and bold linework.' },
  { username: 'Sarah_Tattoos', email: 'sarah@sacredserpent.test', password: 'password123', bio: 'Fine-line and botanical tattoo artist.' },
  { username: 'DarkArt_Dom', email: 'dom@sacredserpent.test', password: 'password123', bio: 'Blackwork and dark surrealism specialist.' },
  { username: 'NeoTraditional_Kat', email: 'kat@sacredserpent.test', password: 'password123', bio: 'Neo-traditional and vibrant color work.' },
  { username: 'Geometric_Leo', email: 'leo@sacredserpent.test', password: 'password123', bio: 'Sacred geometry and dotwork mandala master.' },
  { username: 'Realistic_Ray', email: 'ray@sacredserpent.test', password: 'password123', bio: 'Award-winning photo-realism and portrait tattoos.' }
];

async function seedArtists() {
    console.log('Fetching Sacred Serpent network ID...');
    const { data: wlConfig, error: wlError } = await supabase
        .from('whitelabel_configs')
        .select('id')
        .eq('domain', 'sacredserpent.vibenetwork.tv')
        .single();

    if (wlError || !wlConfig) {
        console.error('Failed to find Sacred Serpent network! Did you run the SQL snippet?', wlError);
        return;
    }

    const networkId = wlConfig.id;
    console.log(`Found Network ID: ${networkId}`);
    
    console.log('Creating 6 Tattoo Artist accounts...');

    for (const artist of artists) {
        const { data, error } = await supabase.auth.signUp({
            email: artist.email,
            password: artist.password,
            options: {
                data: {
                    username: artist.username,
                    role: 'influencer',
                    whitelabel_id: networkId,
                    bio: artist.bio
                }
            }
        });

        if (error) {
            console.error(`Failed to create ${artist.username}:`, error.message);
        } else {
            console.log(`✅ Created artist: ${artist.username}`);
            // Update profile with bio since user_metadata doesn't directly map to profile bio without a trigger (unless trigger handles it)
            if (data?.user) {
                await supabase.from('profiles').update({
                    bio: artist.bio,
                    avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(artist.username)}&background=random&size=200`
                }).eq('id', data.user.id);
            }
        }
    }
    
    console.log('Done! 6 test tattoo artists added to Sacred Serpent.');
}

seedArtists();
