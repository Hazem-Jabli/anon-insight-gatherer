
import { SurveyDataStore, SurveyResponse } from '@/types/survey';
import { saveSurveyToDatabase, getAllSurveyResponsesFromDB } from './surveyService';

// LocalStorage keys
const SURVEY_DATA_KEY = 'anonymous-survey-data';
const SURVEY_IN_PROGRESS_KEY = 'survey-in-progress';

// Initialize the survey data store
export const initializeSurveyDataStore = async (): Promise<SurveyDataStore> => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return { responses: [], lastUpdated: new Date().toISOString() };
  }
  
  try {
    // Get responses from Supabase
    const responses = await getAllSurveyResponsesFromDB();
    
    return {
      responses,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error initializing survey data store:', error);
    
    // Fallback to localStorage if there's an error
    try {
      const storedData = localStorage.getItem(SURVEY_DATA_KEY);
      if (storedData) {
        return JSON.parse(storedData);
      }
    } catch (localError) {
      console.error('Error reading from localStorage:', localError);
    }
  }
  
  // Return empty data store if nothing exists or error occurred
  const emptyStore: SurveyDataStore = { 
    responses: [], 
    lastUpdated: new Date().toISOString() 
  };
  
  return emptyStore;
};

// Save a completed survey response
export const saveSurveyResponse = async (response: SurveyResponse): Promise<void> => {
  try {
    // Save to Supabase
    await saveSurveyToDatabase(response);
    
    // Clear in-progress data
    localStorage.removeItem(SURVEY_IN_PROGRESS_KEY);
    
    console.log('Survey response saved successfully to database');
  } catch (error) {
    console.error('Error saving survey response to database:', error);
    
    // Fallback to localStorage
    try {
      // Get current data
      const currentData = await initializeSurveyDataStore();
      
      // Add new response
      currentData.responses.push(response);
      currentData.lastUpdated = new Date().toISOString();
      
      // Save updated data
      localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(currentData));
      
      console.log('Survey response saved to localStorage as fallback');
    } catch (localError) {
      console.error('Error saving to localStorage:', localError);
    }
  }
};

// Get all survey responses directly from the database
export const getAllSurveyResponses = async (): Promise<SurveyResponse[]> => {
  try {
    return await getAllSurveyResponsesFromDB();
  } catch (error) {
    console.error('Error fetching responses from DB:', error);
    // Fall back to local storage if DB fetch fails
    const store = await initializeSurveyDataStore();
    return store.responses;
  }
};

// Save survey in progress to prevent data loss on page refresh
export const saveSurveyInProgress = (partialResponse: Partial<SurveyResponse>): void => {
  try {
    localStorage.setItem(SURVEY_IN_PROGRESS_KEY, JSON.stringify(partialResponse));
  } catch (error) {
    console.error('Error saving in-progress survey:', error);
  }
};

// Get in-progress survey if it exists
export const getSurveyInProgress = (): Partial<SurveyResponse> | null => {
  try {
    const data = localStorage.getItem(SURVEY_IN_PROGRESS_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Error getting in-progress survey:', error);
    return null;
  }
};

// Clear all survey data
export const clearAllSurveyData = async (): Promise<void> => {
  try {
    // This would require additional backend implementation to delete data from Supabase
    // For now, just clear localStorage
    const emptyStore: SurveyDataStore = { 
      responses: [], 
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(emptyStore));
    console.log('Local survey data cleared');
  } catch (error) {
    console.error('Error clearing survey data:', error);
  }
};

// Export survey data as JSON
export const exportSurveyDataAsJSON = async (): Promise<string> => {
  const responses = await getAllSurveyResponses();
  const data = {
    responses,
    lastUpdated: new Date().toISOString()
  };
  return JSON.stringify(data, null, 2);
};

// Export survey data as CSV
export const exportSurveyDataAsCSV = async (): Promise<string> => {
  const responses = await getAllSurveyResponses();
  
  if (responses.length === 0) {
    return '';
  }
  
  // Create header row
  const headers = [
    'ID',
    'Submitted At',
    'Age Group',
    'Education Level',
    'Professional Sector',
    'Additional Feedback'
  ];
  
  // Create CSV content
  const csvRows = [];
  csvRows.push(headers.join(','));
  
  for (const response of responses) {
    const row = [
      response.id,
      response.submittedAt,
      response.demographics?.ageGroup || '',
      response.demographics?.educationLevel || '',
      response.demographics?.professionalSector || '',
      response.additionalFeedback || ''
    ];
    
    // Escape any fields containing commas
    const escapedRow = row.map(field => {
      const stringField = String(field);
      return stringField.includes(',') ? `"${stringField}"` : stringField;
    });
    
    csvRows.push(escapedRow.join(','));
  }
  
  return csvRows.join('\n');
};
