/*
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envLines = fs.readFileSync('.env', 'utf8').split('\n');
let supabaseUrl = '';
let supabaseKey = '';
for (const line of envLines) {
  if (line.startsWith('VITE_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim().replace(/['"]/g, '');
  if (line.startsWith('VITE_SUPABASE_ANON_KEY=')) supabaseKey = line.split('=')[1].trim().replace(/['"]/g, '');
}

const supabase = createClient(supabaseUrl, supabaseKey);

const team = [
  { name: 'Alex Mercer', roleTitle: 'Managing Partner', email: 'alex@finfire.test', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400' },
  { name: 'Sarah Sterling', roleTitle: 'Chief Financial Officer', email: 'sarah@finfire.test', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400' },
  { name: 'Marcus Vance', roleTitle: 'VP of Operations', email: 'marcus@finfire.test', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=400' },
  { name: 'Elena Rossi', roleTitle: 'Head of Capital Markets', email: 'elena@finfire.test', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=400' },
  { name: 'David Chen', roleTitle: 'Director of Strategy', email: 'david@finfire.test', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400' },
  { name: 'Rachel Pierce', roleTitle: 'Principal Investor', email: 'rachel@finfire.test', image: 'https://images.unsplash.com/photo-1598550874175-4d0ef436c909?auto=format&fit=crop&q=80&w=400' },
  { name: 'James Thorne', roleTitle: 'Senior Analyst', email: 'james@finfire.test', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400' },
  { name: 'Olivia Vance', roleTitle: 'Compliance Officer', email: 'olivia@finfire.test', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=400' },
  { name: 'Michael Hayes', roleTitle: 'Regional Director', email: 'michael@finfire.test', image: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?auto=format&fit=crop&q=80&w=400' },
  { name: 'Chloe Bennett', roleTitle: 'Wealth Advisor', email: 'chloe@finfire.test', image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400' }
];

async function seedTeam() {
    console.log('Fetching FinFire network ID...');
    const { data: wlConfig, error: wlError } = await supabase
        .from('whitelabel_configs')
        .select('id')
        .eq('domain', 'finfire.com')
        .single();

    if (wlError || !wlConfig) {
        console.error('Failed to find FinFire network! Ensure the database is clean.', wlError);
        return;
    }

    const networkId = wlConfig.id;
    console.log(`Found Network ID: ${networkId}`);
    console.log('Creating 10 Mock FinFire Executive profiles...');

    for (const person of team) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: person.email,
            password: 'password123'
        });

        if (error) {
            console.error(`Failed to login ${person.name}:`, error.message);
        } else {
            if (data?.user) {
                const { error: updateErr } = await supabase.from('profiles').update({
                    bio: person.roleTitle,
                    avatar_url: person.image
                }).eq('id', data.user.id);
                
                if (updateErr) console.error(`Failed to update profile for ${person.name}:`, updateErr.message);
                else console.log(`✅ Updated profile: ${person.name} with Avatar!`);
                
                await supabase.auth.signOut();
            }
        }
    }
    
    console.log('Done! 10 FinFire executives have been provisioned.');
}

seedTeam();
*/
