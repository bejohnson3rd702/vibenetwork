import { supabase } from './supabaseClientLoader.ts';

async function run() {
  console.log("🔑 Logging in as admin...");
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: 'admin_avonetwork@test.com',
    password: 'TestPassword123!'
  });

  if (authError || !authData) {
    console.error("❌ Admin login failed:", authError?.message);
    process.exit(1);
  }
  console.log("✅ Logged in successfully!");

  const sqlStatements = [
    // 1. Ledger Table Policy
    `DROP POLICY IF EXISTS "Network admins can view network ledger" ON public.ledger;`,
    `CREATE POLICY "Network admins can view network ledger" ON public.ledger FOR SELECT USING (
      creator_id IN (
        SELECT p.id FROM public.profiles p
        JOIN public.whitelabel_configs w ON p.whitelabel_id = w.id
        WHERE w.owner_id = auth.uid() OR w.parent_network_id IN (
          SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid()
        )
      )
    );`,

    // 2. Network Leads Table Policy
    `DROP POLICY IF EXISTS "Admins can read leads" ON public.network_leads;`,
    `CREATE POLICY "Admins can read leads" ON public.network_leads FOR SELECT USING (
      (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true OR
      whitelabel_id IN (
        SELECT id FROM public.whitelabel_configs 
        WHERE owner_id = auth.uid() OR parent_network_id IN (
          SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid()
        )
      )
    );`,
    `DROP POLICY IF EXISTS "Admins can update leads" ON public.network_leads;`,
    `CREATE POLICY "Admins can update leads" ON public.network_leads FOR UPDATE USING (
      (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = true OR
      whitelabel_id IN (
        SELECT id FROM public.whitelabel_configs 
        WHERE owner_id = auth.uid() OR parent_network_id IN (
          SELECT id FROM public.whitelabel_configs WHERE owner_id = auth.uid()
        )
      )
    );`
  ];

  console.log("Executing SQL statements to update RLS policies...");
  for (const sql of sqlStatements) {
    console.log(`> Executing: ${sql.substring(0, 80)}...`);
    const { data, error } = await supabase.rpc('execute_sql', { sql });
    if (error) {
      console.error("❌ SQL Execution failed:", error.message);
    } else {
      console.log("✅ Success");
    }
  }

  console.log("🎉 Database policies updated successfully!");
}

run().catch(console.error);
