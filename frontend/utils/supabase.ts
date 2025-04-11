import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Supabase miljøvariabler mangler. Sørg for at definere VITE_SUPABASE_URL og VITE_SUPABASE_ANON_KEY i din .env fil.');
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;