
import { supabase, isSupabaseConfigured, getSupabaseUrl } from './supabase';
import { SurveyResponse } from '@/types/survey';
import { toast } from 'sonner';

// Save a new survey response to Supabase
export const saveSurveyToDatabase = async (response: SurveyResponse): Promise<boolean> => {
  // If Supabase is not configured, return false but don't show an error
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to save to database');
    return false;
  }
  
  try {
    console.log('Attempting to save survey response to Supabase:', response);
    const { error } = await supabase
      .from('survey_responses')
      .insert([response]);
      
    if (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Error saving survey. Please try again.');
      return false;
    }
    
    console.log('Survey response saved successfully to Supabase');
    return true;
  } catch (err) {
    console.error('Exception saving to Supabase:', err);
    toast.error('Unexpected error saving survey.');
    return false;
  }
};

// Get all survey responses from Supabase with more robust error handling
export const getAllSurveyResponsesFromDB = async (): Promise<SurveyResponse[]> => {
  // If Supabase is not configured, return empty array but don't show an error
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to fetch from database');
    return [];
  }
  
  try {
    console.log('Fetching responses from Supabase with URL:', getSupabaseUrl());
    
    // Use a simpler query approach for better reliability
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*');
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      throw error; // Let the calling function handle the error
    }
    
    if (!data) {
      console.log('No data returned from Supabase query');
      return [];
    }
    
    console.log(`Successfully retrieved ${data.length} responses from Supabase`);
    
    // Debug response structure if needed
    if (data.length > 0) {
      console.log('Sample response structure:', data[0]);
    }
    
    return data as SurveyResponse[];
  } catch (err) {
    console.error('Exception fetching from Supabase:', err);
    throw err; // Propagate the error to be handled by the caller
  }
};

// Count total number of survey responses with more reliable implementation
export const countSurveyResponses = async (): Promise<number> => {
  // If Supabase is not configured, return 0 but don't show an error
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to count responses');
    return 0;
  }
  
  try {
    console.log('Counting responses in Supabase...');
    
    // Just get all data and count it locally, which is more reliable
    const { data, error } = await supabase
      .from('survey_responses')
      .select('id');
    
    if (error) {
      console.error('Error counting surveys:', error);
      throw error; // Propagate the error
    }
    
    const count = data?.length || 0;
    console.log(`Found ${count} responses in database (direct count method)`);
    
    return count;
  } catch (err) {
    console.error('Exception counting surveys:', err);
    throw err; // Propagate the error
  }
};

// Function to check if the survey_responses table exists
export const checkDatabaseSetup = async (): Promise<boolean> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to check database setup');
    return false;
  }
  
  try {
    console.log('Checking database setup...');
    
    // Simple query to check if table exists and connection works
    const { error } = await supabase
      .from('survey_responses')
      .select('id')
      .limit(1)
      .single();
    
    // If there's no error or if it's just a "no rows returned" error (not found),
    // it means the table exists and connection works
    if (!error || error.code === 'PGRST116') {
      console.log('survey_responses table exists');
      return true;
    }
    
    // Table doesn't exist error
    if (error && error.code === '42P01') {
      console.log('survey_responses table does not exist');
      return false;
    }
    
    // Any other error likely means connection issues
    console.error('Error checking database setup:', error);
    throw error;
  } catch (err) {
    console.error('Exception checking database setup:', err);
    throw err; // Propagate the error
  }
};

// Debug function to directly fetch all responses for better diagnostics
export const debugFetchAllResponses = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured for debug fetch');
    return [];
  }
  
  try {
    console.log('Debug: Direct fetch attempt from survey_responses table');
    
    // Direct query with minimal options and retry logic
    const fetchData = async (attempt = 1): Promise<any[]> => {
      console.log(`Fetch attempt ${attempt}`);
      
      const { data, error } = await supabase
        .from('survey_responses')
        .select('*');
      
      if (error) {
        console.error(`Debug fetch error (attempt ${attempt}):`, error);
        
        // For auth error or table not found, don't retry
        if (error.code === '42P01' || error.code === '401' || attempt >= 3) {
          throw error;
        }
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchData(attempt + 1);
      }
      
      return data || [];
    };
    
    const data = await fetchData();
    console.log('Debug fetch result count:', data.length);
    if (data.length > 0) {
      console.log('First result sample:', data[0]);
    }
    
    return data;
  } catch (err) {
    console.error('Exception in debug fetch:', err);
    throw err; // Propagate the error
  }
};

// Export a function to handle database connection with retry logic
export const testDatabaseConnection = async (): Promise<{
  isConnected: boolean;
  error?: string;
}> => {
  if (!isSupabaseConfigured()) {
    return { isConnected: false, error: 'Supabase not configured' };
  }
  
  try {
    console.log('Testing database connection...');
    
    // Try a simple health check query with retry logic
    const tryConnection = async (attempt = 1): Promise<{
      isConnected: boolean;
      error?: string;
    }> => {
      try {
        const { error } = await supabase
          .from('survey_responses')
          .select('id')
          .limit(1)
          .maybeSingle();
        
        // Connection success if no error or just a "not found" error
        if (!error || error.code === 'PGRST116') {
          console.log('Database connection successful');
          return { isConnected: true };
        }
        
        // If table doesn't exist
        if (error.code === '42P01') {
          console.log('Table does not exist');
          return { isConnected: false, error: 'Table does not exist' };
        }
        
        console.error(`Connection error (attempt ${attempt}):`, error);
        
        // Don't retry after 3 attempts or certain errors
        if (attempt >= 3) {
          return { isConnected: false, error: `Connection error: ${error.message}` };
        }
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return tryConnection(attempt + 1);
      } catch (err) {
        console.error(`Connection exception (attempt ${attempt}):`, err);
        
        if (attempt >= 3) {
          return { 
            isConnected: false, 
            error: `Connection exception: ${err instanceof Error ? err.message : String(err)}` 
          };
        }
        
        // Wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000));
        return tryConnection(attempt + 1);
      }
    };
    
    return await tryConnection();
  } catch (err) {
    console.error('Exception testing connection:', err);
    return { 
      isConnected: false, 
      error: `Unexpected error: ${err instanceof Error ? err.message : String(err)}` 
    };
  }
};
