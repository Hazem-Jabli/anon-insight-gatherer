
// Define types for survey form data

// Demographics
export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type EducationLevel = 'high-school' | 'some-college' | 'bachelors' | 'masters' | 'doctorate' | 'other';
export type ProfessionalSector = 'technology' | 'healthcare' | 'finance' | 'education' | 'manufacturing' | 
                               'retail' | 'government' | 'non-profit' | 'other';

export interface SurveyResponse {
  // Unique identifier for the response
  id: string;
  
  // Timestamp when the response was submitted
  submittedAt: string;
  
  // Demographics
  demographics: {
    ageGroup: AgeGroup;
    educationLevel: EducationLevel;
    professionalSector: ProfessionalSector;
  };
  
  // Additional feedback
  additionalFeedback?: string;
}

// Type for the entire survey data store
export interface SurveyDataStore {
  responses: SurveyResponse[];
  lastUpdated: string;
}

// Empty survey response template
export const emptySurveyResponse: SurveyResponse = {
  id: '',
  submittedAt: '',
  demographics: {
    ageGroup: '25-34',
    educationLevel: 'bachelors',
    professionalSector: 'other',
  },
  additionalFeedback: '',
};
