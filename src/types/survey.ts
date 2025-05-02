
// Define types for survey form data

// Demographics
export type Gender = 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
export type AgeGroup = '18-24' | '25-34' | '35-44' | '45-54' | '55-64' | '65+';
export type EducationLevel = 'high-school' | 'some-college' | 'bachelors' | 'masters' | 'doctorate' | 'other';
export type ProfessionalSector = 'technology' | 'healthcare' | 'finance' | 'education' | 'manufacturing' | 
                               'retail' | 'government' | 'non-profit' | 'other';

// Survey specific types
export type KnowledgeLevel = 'none' | 'basic' | 'intermediate' | 'advanced' | 'expert';
export type InvestmentFrequency = 'never' | 'rarely' | 'occasionally' | 'frequently' | 'regularly';
export type RiskTolerance = 'very-low' | 'low' | 'moderate' | 'high' | 'very-high';

export interface SurveyResponse {
  // Unique identifier for the response
  id: string;
  
  // Timestamp when the response was submitted
  submittedAt: string;
  
  // Demographics
  demographics: {
    gender: Gender;
    ageGroup: AgeGroup;
    educationLevel: EducationLevel;
    professionalSector: ProfessionalSector;
  };
  
  // Knowledge and experience
  investmentKnowledge: {
    selfRatedKnowledge: KnowledgeLevel;
    previousExperience: boolean;
    frequencyOfInvestment: InvestmentFrequency;
    preferredInvestmentTypes: string[];
  };
  
  // Opinions and preferences
  opinions: {
    riskTolerance: RiskTolerance;
    perceivedAdvantages: string[];
    perceivedRisks: string[];
    barriersToInvestment: string[];
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
    gender: 'prefer-not-to-say',
    ageGroup: '25-34',
    educationLevel: 'bachelors',
    professionalSector: 'other',
  },
  investmentKnowledge: {
    selfRatedKnowledge: 'basic',
    previousExperience: false,
    frequencyOfInvestment: 'never',
    preferredInvestmentTypes: [],
  },
  opinions: {
    riskTolerance: 'moderate',
    perceivedAdvantages: [],
    perceivedRisks: [],
    barriersToInvestment: [],
  },
  additionalFeedback: '',
};
