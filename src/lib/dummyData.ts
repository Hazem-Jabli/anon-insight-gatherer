
import { v4 as uuidv4 } from 'uuid';
import { 
  SurveyResponse, 
  AgeGroup, 
  EducationLevel, 
  ProfessionalSector,
  KnowledgeLevel,
  InvestmentFrequency
} from '@/types/survey';

// Helper function to get random item from array
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to get random items from array (1 to max items)
const getRandomItems = <T>(items: T[], max: number = 3): T[] => {
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.floor(Math.random() * max) + 1);
};

// Generate random date in the last 30 days
const getRandomDate = (): string => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
};

export const generateDummyData = (count: number): SurveyResponse[] => {
  const ageGroups: AgeGroup[] = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const educationLevels: EducationLevel[] = ['high-school', 'some-college', 'bachelors', 'masters', 'doctorate', 'other'];
  const professionalSectors: ProfessionalSector[] = ['technology', 'healthcare', 'finance', 'education', 'manufacturing', 
                                                'retail', 'government', 'non-profit', 'other'];
  const knowledgeLevels: KnowledgeLevel[] = ['none', 'basic', 'intermediate', 'advanced', 'expert'];
  const investmentFrequencies: InvestmentFrequency[] = ['never', 'rarely', 'occasionally', 'frequently', 'regularly'];
  const investmentTypes = ['stocks', 'bonds', 'real-estate', 'crypto', 'mutual-funds', 'etfs', 'retirement', 'commodities'];
  
  const responses: SurveyResponse[] = [];

  for (let i = 0; i < count; i++) {
    const response: SurveyResponse = {
      id: uuidv4(),
      submittedAt: getRandomDate(),
      demographics: {
        ageGroup: getRandomItem(ageGroups),
        educationLevel: getRandomItem(educationLevels),
        professionalSector: getRandomItem(professionalSectors),
      },
      investmentKnowledge: {
        selfRatedKnowledge: getRandomItem(knowledgeLevels),
        previousExperience: Math.random() > 0.5,
        frequencyOfInvestment: getRandomItem(investmentFrequencies),
        preferredInvestmentTypes: getRandomItems(investmentTypes, 4),
      },
      additionalFeedback: ''
    };

    responses.push(response);
  }

  return responses;
};
