import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    // 1. Find profile for Sacred Serpent
    const targetId = 'd77161d0-53af-4cc7-97c3-4dd9efbe2f02';
    
    console.log('Targeting SacredSerpent profile:', targetId);

    // 2. Check if a whitelabel_config already exists for this owner
    const { data: existingWl } = await supabase
        .from('whitelabel_configs')
        .select('*')
        .eq('owner_id', targetId);

    let wlId;

    if (existingWl && existingWl.length > 0) {
        console.log('Whitelabel config already exists for this owner:', existingWl[0].name);
        wlId = existingWl[0].id;
    } else {
        console.log('Creating new whitelabel config for Sacred Serpent...');
        // Insert new whitelabel config
        const { data: newWl, error: wlErr } = await supabase
            .from('whitelabel_configs')
            .insert({
                owner_id: targetId,
                name: 'Sacred Serpent',
                domain: 'sacredserpent.vibenetwork.tv',
                theme: {
                    bg: '#050505',
                    accent: '#ff4d85',
                    heroCopy: 'Welcome to Sacred Serpent.',
                    sliderCount: 4
                }
            })
            .select()
            .single();

        if (wlErr) {
            console.error('Error creating whitelabel config:', wlErr);
            return;
        }
        console.log('Created whitelabel config:', newWl.id);
        wlId = newWl.id;
    }

    // 3. Update profile to be linked to this network
    const { error: updateErr } = await supabase
        .from('profiles')
        .update({ whitelabel_id: wlId, role: 'business' })
        .eq('id', targetId);

    if (updateErr) {
        console.error('Error updating profile:', updateErr);
        return;
    }

    console.log('Successfully upgraded Sacred Serpent to a Network!');
}

main();
