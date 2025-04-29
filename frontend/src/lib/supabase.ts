import { createClient } from '@supabase/supabase-js';

// These environment variables are set in the .env file at the root of the project
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://wilitrpckvtndqvxayxn.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndpbGl0cnBja3Z0bmRxdnhheXhuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUzMTU1MTUsImV4cCI6MjA2MDg5MTUxNX0.AvwVcdwMH1uV2hyWPHT0tH8h7ZCtCW1WGTagLFzUuhE';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);