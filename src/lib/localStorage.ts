
import { SurveyDataStore, SurveyResponse } from '@/types/survey';

// LocalStorage keys
const SURVEY_DATA_KEY = 'anonymous-survey-data';
const SURVEY_IN_PROGRESS_KEY = 'survey-in-progress';

// Initialize the survey data store
export const initializeSurveyDataStore = (): SurveyDataStore => {
  // Only run on client side
  if (typeof window === 'undefined') {
    return { responses: [], lastUpdated: new Date().toISOString() };
  }
  
  try {
    const storedData = localStorage.getItem(SURVEY_DATA_KEY);
    if (storedData) {
      return JSON.parse(storedData);
    }
  } catch (error) {
    console.error('Error reading from localStorage:', error);
  }
  
  // Return empty data store if nothing exists or error occurred
  const emptyStore: SurveyDataStore = { 
    responses: [], 
    lastUpdated: new Date().toISOString() 
  };
  
  // Save the empty store
  localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(emptyStore));
  return emptyStore;
};

// Save a completed survey response
export const saveSurveyResponse = (response: SurveyResponse): void => {
  try {
    // Get current data
    const currentData = initializeSurveyDataStore();
    
    // Add new response
    currentData.responses.push(response);
    currentData.lastUpdated = new Date().toISOString();
    
    // Save updated data
    localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(currentData));
    
    // Clear in-progress data
    localStorage.removeItem(SURVEY_IN_PROGRESS_KEY);
    
    console.log('Survey response saved successfully');
  } catch (error) {
    console.error('Error saving survey response:', error);
  }
};

// Get all survey responses
export const getAllSurveyResponses = (): SurveyResponse[] => {
  const store = initializeSurveyDataStore();
  return store.responses;
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
export const clearAllSurveyData = (): void => {
  try {
    const emptyStore: SurveyDataStore = { 
      responses: [], 
      lastUpdated: new Date().toISOString() 
    };
    localStorage.setItem(SURVEY_DATA_KEY, JSON.stringify(emptyStore));
    console.log('All survey data cleared');
  } catch (error) {
    console.error('Error clearing survey data:', error);
  }
};

// Export survey data as JSON
export const exportSurveyDataAsJSON = (): string => {
  const data = initializeSurveyDataStore();
  return JSON.stringify(data, null, 2);
};

// Export survey data as CSV
export const exportSurveyDataAsCSV = (): string => {
  const responses = getAllSurveyResponses();
  
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
      response.demographics.ageGroup,
      response.demographics.educationLevel,
      response.demographics.professionalSector,
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
