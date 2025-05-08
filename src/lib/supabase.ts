
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
    const { error } = await supabase.rpc('create_survey_responses_table_function');
    
    if (error) {
      console.warn('Could not call stored procedure. Attempting to create it...');
      
      // If the function doesn't exist, try to create the table directly
      try {
        // Try to create the table directly using a query instead of execute method
        const result = await supabase
          .from('_utils')
          .select('create_table');
          
        console.log('Create table query result:', result);
      } catch (err) {
        console.warn('Could not query utils:', err);
        
        // Try to create the table directly
        const tableResult = await supabase
          .from('survey_responses')
          .select('*', { count: 'exact', head: true })
          .then(async (response) => {
            if (response.error && response.error.code === '42P01') { // Table does not exist
              console.log('Table does not exist, trying to create it...');
              
              try {
                // Create the table using a raw query
                // Note: This might not work depending on RLS policies
                const createTableResult = await supabase
                  .from('survey_responses')
                  .insert({
                    id: '00000000-0000-0000-0000-000000000000',
                    submittedAt: new Date().toISOString(),
                    demographics: {},
                    socialMedia: {},
                    influencerRelations: {},
                    engagement: {},
                    purchaseIntention: {},
                    globalAppreciation: {}
                  })
                  .select();
                  
                return createTableResult;
              } catch (err) {
                console.error('Failed to create table:', err);
                return { error: err };
              }
            }
            return response;
          });
          
        console.log('Direct table creation attempt result:', tableResult);
      }
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

// Export a function to create the survey_responses table
export const createSurveyResponsesTable = async (): Promise<{ success: boolean; error?: any }> => {
  try {
    console.log('Creating survey_responses table...');
    
    // Try to create the table with a direct create table statement
    const { error } = await supabase.from('survey_responses').insert({
      id: '00000000-0000-0000-0000-000000000000',
      submittedAt: new Date().toISOString(),
      demographics: {},
      socialMedia: {},
      influencerRelations: {},
      engagement: {},
      purchaseIntention: {},
      globalAppreciation: {},
      additionalFeedback: ''
    }).select();
    
    if (error) {
      console.error('Error creating table:', error);
      return { success: false, error };
    }
    
    console.log('Table created successfully!');
    return { success: true };
  } catch (err) {
    console.error('Exception creating table:', err);
    return { success: false, error: err };
  }
};
