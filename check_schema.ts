import { supabase } from './supabaseClientLoader.ts';

async function run() {
  console.log('🔄 Checking and updating schema...');

  // Try DDL queries using exec_sql RPC
  const { data: rpcResult, error: rpcError } = await supabase.rpc('exec_sql', {
    query: `
      ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS n2n_enabled BOOLEAN DEFAULT false;
      ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS parent_network_id UUID REFERENCES public.whitelabel_configs(id);
      ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;
    `
  });
  
  if (rpcError) {
    console.log('RPC not available or insufficient permissions (common with anon key):', rpcError.message);
    console.log('\n⚠️  YOU MUST RUN THESE SQL STATEMENTS IN YOUR SUPABASE DASHBOARD SQL EDITOR:');
    console.log('');
    console.log('------------------------------------------------------------');
    console.log('ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS n2n_enabled BOOLEAN DEFAULT false;');
    console.log('ALTER TABLE public.whitelabel_configs ADD COLUMN IF NOT EXISTS parent_network_id UUID REFERENCES public.whitelabel_configs(id);');
    console.log('ALTER TABLE public.posts ADD COLUMN IF NOT EXISTS is_pinned BOOLEAN DEFAULT false;');
    console.log('------------------------------------------------------------');
    console.log('');
  } else {
    console.log('✅ Schema successfully updated:', rpcResult);
  }
}

run().catch(console.error);
