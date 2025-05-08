
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

// Get all survey responses from Supabase
export const getAllSurveyResponsesFromDB = async (): Promise<SurveyResponse[]> => {
  // If Supabase is not configured, return empty array but don't show an error
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to fetch from database');
    return [];
  }
  
  try {
    console.log('Fetching responses from Supabase with URL:', getSupabaseUrl());
    console.log('Supabase connection status:', isSupabaseConfigured() ? 'Configured' : 'Not configured');
    
    // Use simpler query with fewer options to improve reliability
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*');
    
    if (error) {
      console.error('Error fetching from Supabase:', error);
      toast.error('Error loading survey data: ' + error.message);
      return [];
    }
    
    if (!data) {
      console.log('Data is null from Supabase query');
      return [];
    }
    
    console.log(`Retrieved ${data.length} responses from Supabase`);
    
    // Debug each item to check their structure
    data.forEach((item, index) => {
      console.log(`Response ${index + 1}:`, item);
    });
    
    // Type assertion
    const responses = data as SurveyResponse[];
    return responses;
  } catch (err) {
    console.error('Exception fetching from Supabase:', err);
    toast.error('Unexpected error loading survey data.');
    return [];
  }
};

// Count total number of survey responses
export const countSurveyResponses = async (): Promise<number> => {
  // If Supabase is not configured, return 0 but don't show an error
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to count responses');
    return 0;
  }
  
  try {
    console.log('Counting responses in Supabase...');
    
    // Simplified count query
    const { count, error } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      console.error('Error counting surveys:', error);
      return 0;
    }
    
    const countValue = count || 0;
    console.log(`Found ${countValue} responses in database (count method)`);
    
    return countValue;
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
    
    // Simplified table existence check
    const { error } = await supabase
      .from('survey_responses')
      .select('id', { count: 'exact', head: true });
    
    // If we get a specific error code, table doesn't exist
    if (error && error.code === '42P01') {
      console.log('survey_responses table does not exist');
      return false;
    }
    
    // If no error, assume table exists
    const tableExists = !error;
    console.log('survey_responses table exists:', tableExists ? 'Yes' : 'No');
    
    return tableExists;
  } catch (err) {
    console.error('Exception checking database setup:', err);
    return false;
  }
};

// Add a function to directly fetch all responses for debugging
export const debugFetchAllResponses = async (): Promise<any[]> => {
  if (!isSupabaseConfigured()) {
    console.warn('Supabase not configured, unable to debug fetch');
    return [];
  }
  
  try {
    console.log('Debug: Direct fetch attempt from survey_responses table');
    
    // Most basic query possible
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .limit(100);
    
    if (error) {
      console.error('Debug fetch error:', error);
      return [];
    }
    
    console.log('Debug fetch result:', data);
    return data || [];
  } catch (err) {
    console.error('Exception in debug fetch:', err);
    return [];
  }
};
