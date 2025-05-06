import { createClient } from '@supabase/supabase-js';

// For development purposes, we can use default values if environment variables are not set
// These should be replaced with your actual Supabase URL and anon key in a production environment
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// Remove the strict error checking for development purposes
// In production, you should keep the validation
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return (
    import.meta.env.VITE_SUPABASE_URL !== undefined &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-supabase-project.supabase.co'
  );
};
