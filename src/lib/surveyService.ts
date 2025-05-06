
import { supabase } from './supabase';
import { SurveyResponse } from '@/types/survey';
import { toast } from 'sonner';

// Save a new survey response to Supabase
export const saveSurveyToDatabase = async (response: SurveyResponse): Promise<boolean> => {
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
  try {
    const { data, error } = await supabase
      .from('survey_responses')
      .select('*')
      .order('submittedAt', { ascending: false });
      
    if (error) {
      console.error('Error fetching from Supabase:', error);
      toast.error('Error loading survey data.');
      return [];
    }
    
    return data as SurveyResponse[];
  } catch (err) {
    console.error('Exception fetching from Supabase:', err);
    toast.error('Unexpected error loading survey data.');
    return [];
  }
};

// Count total number of survey responses
export const countSurveyResponses = async (): Promise<number> => {
  try {
    const { count, error } = await supabase
      .from('survey_responses')
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error('Error counting surveys:', error);
      return 0;
    }
    
    return count || 0;
  } catch (err) {
    console.error('Exception counting surveys:', err);
    return 0;
  }
};
