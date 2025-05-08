
import { createClient } from '@supabase/supabase-js';

// Set Supabase URL and anon key from provided values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgmrdospdjqzyxqixwmv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbXJkb3NwZGpxenl4cWl4d212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjA4NzgsImV4cCI6MjA2MjA5Njg3OH0.6oVHzfRgHXQCrpWFlqDW2mVzHuDByRZ70xfCfwwYBXs';

// Create the Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if table exists on initialization to avoid errors
(async () => {
  try {
    console.log('Initializing Supabase connection and checking table existence...');
    
    // Check if table exists by trying to select from it
    const { error } = await supabase
      .from('survey_responses')
      .select('id', { count: 'exact', head: true });
    
    if (error && error.code === '42P01') {
      console.warn('survey_responses table does not exist, attempting to create it...');
      await createSurveyResponsesTable();
    } else {
      console.log('survey_responses table exists or other error occurred:', error ? error.message : 'No error');
    }
  } catch (err) {
    console.warn('Error during Supabase initialization:', err);
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
    
    // First test if the table already exists by selecting from it
    const { error: testError } = await supabase
      .from('survey_responses')
      .select('id', { count: 'exact', head: true });
      
    // If the table exists, return success
    if (!testError) {
      console.log('Table already exists!');
      return { success: true };
    }
    
    // If we get an error other than table doesn't exist, return failure
    if (testError && testError.code !== '42P01') {
      console.error('Error checking table:', testError);
      return { success: false, error: testError };
    }
    
    console.log('Table does not exist, attempting to create it...');
    
    // Try to create the table with a direct SQL query
    // This will only work if the user has permission to create tables
    try {
      const { error } = await supabase.rpc('create_survey_responses_table');
      
      if (error) {
        console.warn('RPC failed, attempting direct insert instead:', error);
        
        // Try to create it by inserting a record
        const insertResult = await supabase
          .from('survey_responses')
          .insert({
            id: '00000000-0000-0000-0000-000000000000',
            submittedAt: new Date().toISOString(),
            demographics: {},
            socialMedia: {},
            influencerRelations: {},
            engagement: {},
            purchaseIntention: {},
            globalAppreciation: {},
            additionalFeedback: ''
          });
          
        if (insertResult.error && insertResult.error.code === '42P01') {
          console.error('Failed to create table via insert:', insertResult.error);
          return { success: false, error: insertResult.error };
        }
        
        // Check if the table now exists
        const { error: checkError } = await supabase
          .from('survey_responses')
          .select('id', { count: 'exact', head: true });
          
        return { success: !checkError, error: checkError };
      }
      
      return { success: true };
    } catch (err) {
      console.error('Exception creating table:', err);
      return { success: false, error: err };
    }
  } catch (err) {
    console.error('Exception creating table:', err);
    return { success: false, error: err };
  }
};
