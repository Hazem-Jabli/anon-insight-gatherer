
import { createClient } from '@supabase/supabase-js';

// Set Supabase URL and anon key from provided values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qgmrdospdjqzyxqixwmv.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFnbXJkb3NwZGpxenl4cWl4d212Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1MjA4NzgsImV4cCI6MjA2MjA5Njg3OH0.6oVHzfRgHXQCrpWFlqDW2mVzHuDByRZ70xfCfwwYBXs';

// Create the Supabase client with proper options
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  global: {
    fetch: fetch,
  },
});

console.log('Initialized Supabase client with URL:', supabaseUrl);

// Check if table exists on initialization to avoid errors
(async () => {
  try {
    console.log('Initializing Supabase connection and checking table existence...');
    
    // Simple query to check if table exists
    const { error } = await supabase
      .from('survey_responses')
      .select('id')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.warn('survey_responses table does not exist, attempting to create it...');
      await createSurveyResponsesTable();
    } else if (error) {
      console.error('Error checking table existence:', error.message);
    } else {
      console.log('survey_responses table exists');
    }
  } catch (err) {
    console.warn('Error during Supabase initialization:', err);
  }
})();

// Export a function to check if Supabase is properly configured
export const isSupabaseConfigured = (): boolean => {
  return (
    (import.meta.env.VITE_SUPABASE_URL !== undefined &&
    import.meta.env.VITE_SUPABASE_ANON_KEY !== undefined &&
    import.meta.env.VITE_SUPABASE_URL !== 'https://your-supabase-project.supabase.co') ||
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
    console.log('Attempting to create survey_responses table...');
    
    // First check if the table already exists
    const { error: checkError } = await supabase
      .from('survey_responses')
      .select('id')
      .limit(1);
      
    if (!checkError) {
      console.log('Table already exists!');
      return { success: true };
    }
    
    if (checkError && checkError.code !== '42P01') {
      console.error('Error checking table:', checkError);
      return { success: false, error: checkError };
    }
    
    console.log('Table does not exist, attempting to create it...');
    
    // Try to insert a record - if the table doesn't exist, it will fail
    try {
      // Try using SQL directly to create the table
      const { error } = await supabase.rpc('create_survey_table', {
        table_name: 'survey_responses'
      });
      
      if (error) {
        console.warn('RPC failed, attempting direct insert instead:', error);
        
        // Try creating the table by inserting a record
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
          
        if (insertResult.error) {
          console.error('Failed to create table via insert:', insertResult.error);
          return { success: false, error: insertResult.error };
        }
      }
      
      // Verify the table exists now
      const { error: verifyError } = await supabase
        .from('survey_responses')
        .select('id')
        .limit(1);
        
      const success = !verifyError || verifyError.code !== '42P01';
      return { success, error: verifyError };
    } catch (err) {
      console.error('Exception creating table:', err);
      return { success: false, error: err };
    }
  } catch (err) {
    console.error('Exception in createSurveyResponsesTable:', err);
    return { success: false, error: err };
  }
};
