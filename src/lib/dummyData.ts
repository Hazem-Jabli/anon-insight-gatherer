
import { v4 as uuidv4 } from 'uuid';
import { 
  SurveyResponse, 
  AgeGroup, 
  EducationLevel, 
  ProfessionalSector
} from '@/types/survey';

// Helper function to get random item from array
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
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
      additionalFeedback: ''
    };

    responses.push(response);
  }

  return responses;
};
