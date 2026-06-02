import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load variables from .env file
dotenv.config();

const url = process.env.VITE_SUPABASE_URL || 'https://fimzetmvrmbmdggvqzpr.supabase.co';
const key = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZpbXpldG12cm1ibWRnZ3ZxenByIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwMTQ2MjcsImV4cCI6MjA5MDU5MDYyN30.1spJ19jp6RZzpMVSHZRNLjaS-bd2RoztlIYMxmKQQQg';

export const supabase = createClient(url, key);
