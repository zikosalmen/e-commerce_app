import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
console.log("Supabase URL checking:", supabaseUrl);
console.log("Supabase Key length:", supabaseAnonKey?.length);
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Missing Supabase env vars. Check .env.local');
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');
