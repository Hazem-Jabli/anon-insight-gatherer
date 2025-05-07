
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
    const { error } = await supabase
      .from('survey_responses')
      .insert([response]);
      
    if (error) {
      console.error('Error saving to Supabase:', error);
      toast.error('Error saving survey. Please try again.');
      return false;
    }
    
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
    
    // Making a direct query with no caching
    const { data, error, count, status } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact' })
      .order('submittedAt', { ascending: false });
    
    console.log('Supabase query status:', status);  
    console.log('Retrieved count:', count);
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      toast.error('Error loading survey data.');
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
      .select('*', { count: 'exact', head: false });
      
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
      .select('*');
      
    console.log(`Double-check query found ${checkResult.data?.length || 0} responses`);
    
    return countValue;
  } catch (err) {
    console.error('Exception counting surveys:', err);
    return 0;
  }
};
