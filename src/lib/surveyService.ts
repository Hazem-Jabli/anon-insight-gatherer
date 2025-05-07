
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
    
    // Verify connection before attempting query
    console.log('Supabase connection status:', isSupabaseConfigured() ? 'Configured' : 'Not configured');
    
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('submittedAt', { ascending: false });
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      toast.error('Error loading survey data.');
      return [];
    }
    
    console.log(`Retrieved ${data?.length || 0} responses from Supabase`);
    
    if (!data) {
      console.log('Data is null from Supabase query');
      return [];
    }
    
    if (data.length === 0) {
      console.log('No data returned from Supabase query (empty array)');
      return [];
    }
    
    // Debug log all items to check structure
    console.log('All response items:', JSON.stringify(data));
    
    return data as SurveyResponse[];
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
    
    // Force a fresh count with no caching
    const { data, error, status } = await supabase
      .from('survey_responses')
      .select('id', { count: 'exact', head: false });
      
    console.log('Supabase response status:', status);
    
    if (error) {
      console.error('Error counting surveys:', error);
      return 0;
    }
    
    const count = data?.length || 0;
    console.log(`Found ${count} responses in Supabase database`);
    
    // Additional fetch to double-check
    const checkResult = await supabase
      .from('survey_responses')
      .select('*');
      
    console.log(`Double-check query found ${checkResult.data?.length || 0} responses`);
    
    return count;
  } catch (err) {
    console.error('Exception counting surveys:', err);
    return 0;
  }
};
