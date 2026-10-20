-- ==============================================================================
-- SUPABASE POSTGREST / API ACCESS PERMISSIONS (GRANT SCRIPT)
--
-- Supabase notice:
-- "Any table created in 'public' from that date onwards needs an explicit GRANT
-- before supabase-js, PostgREST, or GraphQL can reach it. Without one, the API
-- returns a 'permission denied' error that includes the statement to run.
-- This includes migrations that recreate your schema: new projects, preview
-- branches, and local 'supabase db reset'."
-- ==============================================================================

-- 1. Ensure API roles have USAGE on schema public
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

-- 2. Grant permissions on ALL EXISTING tables, sequences, and routines in public schema
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

-- 3. Set ALTER DEFAULT PRIVILEGES so ANY FUTURE tables created in public automatically
-- inherit permissions for supabase-js, PostgREST, and GraphQL
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- 4. Set DEFAULT PRIVILEGES explicitly for postgres owner role (for migrations / CLI resets)
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
