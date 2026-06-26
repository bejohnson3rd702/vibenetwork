import { supabase } from './supabaseClientLoader.ts';

async function run() {
  const query = `
    ALTER TABLE public.series ADD COLUMN IF NOT EXISTS subscriber_free BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.series ADD COLUMN IF NOT EXISTS subscriber_price NUMERIC;
    ALTER TABLE public.series ADD COLUMN IF NOT EXISTS billing_level TEXT DEFAULT 'series';

    ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS subscriber_free BOOLEAN DEFAULT FALSE;
    ALTER TABLE public.episodes ADD COLUMN IF NOT EXISTS subscriber_price NUMERIC;
  `;
  console.log(`Executing SQL: ${query}`);
  const { data, error } = await supabase.rpc('exec_sql', { query });
  if (error) {
    console.error("RPC Error:", error);
  } else {
    console.log("RPC Data:", data);
  }
}

run();
