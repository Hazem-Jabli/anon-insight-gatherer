
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
    
    // Use a direct, basic query with no count to improve reliability
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .limit(1000);
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      toast.error('Error loading survey data');
      return [];
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
    toast.error('Unexpected error loading survey data');
    return [];
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
      .select('id')
      .limit(1000);
    
    if (error) {
      console.error('Error counting surveys:', error);
      return 0;
    }
    
    const count = data?.length || 0;
    console.log(`Found ${count} responses in database (direct count method)`);
    
    return count;
  } catch (err) {
    console.error('Exception counting surveys:', err);
    return 0;
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
    
    // Simple query to check if table exists
    const { data, error } = await supabase
      .from('survey_responses')
      .select('id')
      .limit(1);
    
    // If the table doesn't exist, we'll get a specific error code
    if (error && error.code === '42P01') {
      console.log('survey_responses table does not exist');
      return false;
    }
    
    // If there's no error, or any other error, assume the table exists
    const tableExists = !error || error.code !== '42P01';
    console.log('survey_responses table exists:', tableExists ? 'Yes' : 'No');
    
    return tableExists;
  } catch (err) {
    console.error('Exception checking database setup:', err);
    return false;
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
    
    // Direct query with minimal options
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .limit(100);
    
    if (error) {
      console.error('Debug fetch error:', error);
      return [];
    }
    
    console.log('Debug fetch result count:', data?.length || 0);
    if (data && data.length > 0) {
      console.log('First result sample:', data[0]);
    }
    
    return data || [];
  } catch (err) {
    console.error('Exception in debug fetch:', err);
    return [];
  }
};
