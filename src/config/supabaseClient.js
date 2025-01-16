import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
    console.log(supabaseUrl, supabaseAnonKey);
  console.error('Las variables de entorno no están definidas correctamente.');
} else {
  console.log('Supabase URL:', supabaseUrl);
  console.log('Supabase Anon Key:', supabaseAnonKey);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);