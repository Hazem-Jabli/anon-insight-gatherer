
// Define types for survey form data

// Demographics
export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type EducationLevel = 'high-school' | 'some-college' | 'bachelors' | 'masters' | 'doctorate' | 'other';
export type ProfessionalSector = 'technology' | 'healthcare' | 'finance' | 'education' | 'manufacturing' | 
                               'retail' | 'government' | 'non-profit' | 'other';

// Social Media
export type SocialMediaPlatform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'youtube' | 'other';
export type SocialMediaPurpose = 'personal' | 'research' | 'professional' | 'other';
export type InfluencerOpinion = 'yes' | 'probably' | 'certainly-yes' | 'no';

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
  
  // Social Media
  socialMedia: {
    usesSocialMedia: boolean;
    platforms: SocialMediaPlatform[];
    purpose: SocialMediaPurpose[];
    frequentUsage: string;
    knownCompanies: string[];
    influencerOpinion: InfluencerOpinion;
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
  socialMedia: {
    usesSocialMedia: false,
    platforms: [],
    purpose: [],
    frequentUsage: '',
    knownCompanies: [],
    influencerOpinion: 'probably'
  },
  additionalFeedback: '',
};
