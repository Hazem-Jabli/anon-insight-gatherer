
import { createClient } from '@supabase/supabase-js';

// Set Supabase URL and anon key from provided values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgmrdospdjqzyxqixwmv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbXJkb3NwZGpxenl4cWl4d212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjA4NzgsImV4cCI6MjA2MjA5Njg3OH0.6oVHzfRgHXQCrpWFlqDW2mVzHuDByRZ70xfCfwwYBXs';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// When the client is created, set up the stored procedure
(async () => {
  try {
    // Create a stored procedure to create the survey_responses table
    const { error } = await supabase.rpc('create_survey_responses_table_function', {}, {
      count: 'exact',
    }).catch(() => {
      // If the function doesn't exist, create it
      return supabase.sql(`
        CREATE OR REPLACE FUNCTION create_survey_responses_table()
        RETURNS void AS $$
        BEGIN
          -- Check if table exists
          IF NOT EXISTS (
            SELECT FROM pg_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'survey_responses'
          ) THEN
            -- Create the table
            CREATE TABLE public.survey_responses (
              id UUID PRIMARY KEY,
              submittedAt TIMESTAMP WITH TIME ZONE,
              demographics JSONB,
              socialMedia JSONB,
              influencerRelations JSONB,
              engagement JSONB,
              purchaseIntention JSONB,
              globalAppreciation JSONB,
              additionalFeedback TEXT
            );
            
            -- Set RLS policies
            ALTER TABLE public.survey_responses ENABLE ROW LEVEL SECURITY;
            
            -- Create policies
            CREATE POLICY "Allow anonymous read" ON public.survey_responses
            FOR SELECT USING (true);
            
            CREATE POLICY "Allow anonymous insert" ON public.survey_responses
            FOR INSERT WITH CHECK (true);
          END IF;
        END;
        $$ LANGUAGE plpgsql;
      `);
    });
    
    if (error) {
      console.warn('Could not create stored procedure:', error);
    } else {
      console.log('Database setup function created or already exists');
    }
  } catch (err) {
    console.warn('Error setting up database functions:', err);
  }
})();

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

// Export a function to get the Supabase URL
export const getSupabaseUrl = (): string => {
  return supabaseUrl;
};
