
import { v4 as uuidv4 } from 'uuid';
import { 
  SurveyResponse, 
  AgeGroup, 
  EducationLevel, 
  ProfessionalSector,
  SocialMediaPlatform,
  SocialMediaPurpose,
  InfluencerOpinion
} from '@/types/survey';

// Helper function to get random item from array
const getRandomItem = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
};

// Helper function to get random items from array
const getRandomItems = <T>(items: T[], min: number = 1, max: number = items.length): T[] => {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...items].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
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
  
  const socialMediaPlatforms: SocialMediaPlatform[] = ['facebook', 'instagram', 'twitter', 'linkedin', 'tiktok', 'youtube', 'other'];
  const socialMediaPurposes: SocialMediaPurpose[] = ['personal', 'research', 'professional', 'other'];
  const influencerOpinions: InfluencerOpinion[] = ['yes', 'probably', 'certainly-yes', 'no'];
  const usageOptions: string[] = [
    'Partager des photos', 'Chercher des news', 'Réseautage professionnel',
    'Divertissement', 'Suivre des influenceurs', 'Communiquer avec des amis',
    'Marketing de marque', 'Recherche de produits', 'Éducation et apprentissage'
  ];
  
  const companies: string[] = [
    'Nike', 'Apple', 'Samsung', 'Coca-Cola', 'Adidas', 'Microsoft',
    'Amazon', 'Google', 'Disney', 'Netflix', 'McDonald\'s', 'Tesla',
    'Zara', 'H&M', 'Spotify', 'BMW', 'Sony', 'Lego', 'Starbucks', 'Uber'
  ];
  
  const responses: SurveyResponse[] = [];

  for (let i = 0; i < count; i++) {
    const usesSocialMedia = Math.random() > 0.2; // 80% use social media
    
    let socialMediaData;
    if (usesSocialMedia) {
      socialMediaData = {
        usesSocialMedia: true,
        platforms: getRandomItems(socialMediaPlatforms, 1, 4),
        purpose: getRandomItems(socialMediaPurposes, 1, 3),
        frequentUsage: getRandomItem(usageOptions),
        knownCompanies: getRandomItems(companies, 0, 5),
        influencerOpinion: getRandomItem(influencerOpinions)
      };
    } else {
      socialMediaData = {
        usesSocialMedia: false,
        platforms: [],
        purpose: [],
        frequentUsage: '',
        knownCompanies: [],
        influencerOpinion: 'probably'
      };
    }

    const response: SurveyResponse = {
      id: uuidv4(),
      submittedAt: getRandomDate(),
      demographics: {
        ageGroup: getRandomItem(ageGroups),
        educationLevel: getRandomItem(educationLevels),
        professionalSector: getRandomItem(professionalSectors),
      },
      socialMedia: socialMediaData,
      additionalFeedback: ''
    };

    responses.push(response);
  }

  return responses;
};
