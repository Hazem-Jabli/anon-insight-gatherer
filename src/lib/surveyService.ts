
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
    
    // First check if the table exists
    const { data: tables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');
      
    if (tablesError) {
      console.error('Error checking tables in Supabase:', tablesError);
    } else {
      console.log('Available tables:', tables?.map(t => t.table_name).join(', ') || 'None');
      
      // Check if our table exists
      const surveyTableExists = tables?.some(t => t.table_name === 'survey_responses');
      console.log('survey_responses table exists:', surveyTableExists ? 'Yes' : 'No');
      
      if (!surveyTableExists) {
        console.warn('The survey_responses table does not exist in the database');
        toast.error('Database table not found. Please set up the database first.');
        return [];
      }
    }
    
    // Making a direct query with no caching
    console.log('Executing query to fetch survey responses...');
    const { data, error, count, status } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact' });
    
    console.log('Supabase query status:', status);  
    
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
    
    // Convert to SurveyResponse type
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
    
    // Direct query with count exact
    const { count, error, status } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true });
      
    console.log('Count query status:', status);
    
    if (error) {
      console.error('Error counting surveys:', error);
      return 0;
    }
    
    const countValue = count || 0;
    console.log(`Found ${countValue} responses in database (count method)`);
    
    // Double-check with a regular select query
    const checkResult = await supabase
      .from('survey_responses')
      .select('id');
      
    console.log(`Double-check query found ${checkResult.data?.length || 0} responses`);
    
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
    
    // Check if the survey_responses table exists
    const { data, error } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_name', 'survey_responses');
      
    if (error) {
      console.error('Error checking database setup:', error);
      return false;
    }
    
    const tableExists = data && data.length > 0;
    console.log('survey_responses table exists:', tableExists ? 'Yes' : 'No');
    
    return tableExists;
  } catch (err) {
    console.error('Exception checking database setup:', err);
    return false;
  }
};
