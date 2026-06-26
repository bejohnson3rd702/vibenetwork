require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const networks = [
  { id: '3915f1e5-4c79-4b2a-ad41-7029ce8052d7', name: 'AVO NETWORK' },
  { id: 'b7f74446-403b-4f9b-8be1-1bd2df35df54', name: 'Mississippi State University' },
  { id: 'be124de3-82be-4017-b6d0-58b0132f5550', name: 'University of Alabama' },
  { id: 'eb2428a2-87e2-46ed-b7c5-c1f5e6c4cf1b', name: 'Ole Miss University' },
  { id: '16e37654-6a62-490c-bb55-aee61558eee4', name: 'Penn State University' },
  { id: '6b797710-bec0-4887-8336-d1eaf76cd307', name: 'Vanderbilt University' },
  { id: 'e86c5900-0d27-420b-98f7-922213540ec2', name: 'Baylor University' },
  { id: 'd0fd9b57-d8af-474b-a011-aa8babeadb34', name: 'University of Colorado' },
  { id: '83b21eac-0f37-4b66-b7e0-1320105e82f1', name: 'University of Georgia' }
];

async function createAccounts() {
  console.log('Creating test accounts...');
  
  for (const network of networks) {
    const safeName = network.name.toLowerCase().replace(/[^a-z0-9]/g, '');
    const email = `admin_${safeName}@test.com`;
    const password = 'TestPassword123!';
    
    // Attempt signup
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: 'Test',
          last_name: 'Admin',
          whitelabel_id: network.id
        }
      }
    });

    if (authError) {
      if (authError.message.includes('already registered')) {
        console.log(`[SKIP] Account already exists: ${email}`);
      } else {
        console.error(`[ERROR] Failed to create ${email}:`, authError.message);
      }
    } else {
      console.log(`[SUCCESS] Created account for ${network.name}`);
      console.log(`          Email: ${email}`);
      console.log(`          Password: ${password}`);
      console.log(`          Network ID: ${network.id}`);
      
      // Update the user profile to set their role to 'business_admin'
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'business_admin', whitelabel_id: network.id })
          .eq('id', authData.user.id);
          
        if (profileError) {
          console.error(`[WARNING] Failed to set role to business_admin for ${email}:`, profileError.message);
        } else {
          console.log(`          Role successfully set to 'business_admin'`);
        }
      }
    }
  }
}

createAccounts();
