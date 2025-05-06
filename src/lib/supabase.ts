
import { createClient } from '@supabase/supabase-js';

// Set Supabase URL and anon key from provided values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgmrdospdjqzyxqixwmv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbXJkb3NwZGpxenl4cWl4d212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjA4NzgsImV4cCI6MjA2MjA5Njg3OH0.6oVHzfRgHXQCrpWFlqDW2mVzHuDByRZ70xfCfwwYBXs';

// Remove the strict error checking for development purposes
// In production, you should keep the validation
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return (
    import.meta.env.VITE_SUPABASE_URL !== undefined &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-supabase-project.supabase.co' ||
    // Also return true if using the hardcoded values
    supabaseUrl === 'https://qgmrdospdjqzyxqixwmv.supabase.co'
  );
};
