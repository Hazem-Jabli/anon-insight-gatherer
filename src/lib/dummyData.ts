
import { v4 as uuidv4 } from 'uuid';
import { 
  SurveyResponse,
  AgeGroup,
  EducationLevel,
  ProfessionalSector,
  SocialMediaPlatform,
  SocialMediaPurpose,
  InfluencerOpinion,
  InfluencerFollowReason,
  TrustLevel,
  SponsoredPostReaction,
  InfluenceLevel,
  InfluencerType,
  MarketingEfficiency
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

// Helper function to get random boolean with probability
const getRandomBoolean = (trueProbability: number = 0.5): boolean => {
  return Math.random() < trueProbability;
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

  // New data for new sections
  const influencerFollowReasons: InfluencerFollowReason[] = [
    'fashion-beauty', 'travel-discovery', 'product-advice', 'humor-entertainment', 'other'
  ];
  const trustLevels: TrustLevel[] = ['not-at-all', 'little', 'medium', 'lot', 'completely'];
  const sponsoredPostReactions: SponsoredPostReaction[] = ['ignore', 'read-no-reaction', 'interested-more-info', 'click-link-product'];
  const influenceLevels: InfluenceLevel[] = ['not-at-all', 'little', 'medium', 'lot', 'enormously'];
  const influencerTypes: InfluencerType[] = ['micro', 'macro', 'doesnt-matter'];
  const marketingEfficiencies: MarketingEfficiency[] = ['not-at-all', 'not-very', 'moderately', 'very'];
  
  const loyaltyReasons: string[] = [
    'J\'ai confiance en leur jugement',
    'Ils sont authentiques et transparents',
    'J\'aime leur style et leurs goûts',
    'Leurs recommandations correspondent à mes besoins',
    'Ils me font découvrir des produits intéressants',
    'Je me sens proche de leurs valeurs'
  ];

  const additionalRemarks: string[] = [
    'Je pense que le marketing d\'influence est l\'avenir de la publicité.',
    'J\'apprécie les partenariats transparents entre marques et influenceurs.',
    'Trop de contenu sponsorisé rend les influenceurs moins crédibles à mes yeux.',
    'Je préfère les micro-influenceurs car ils semblent plus authentiques.',
    'Les influenceurs devraient tester les produits avant de les recommander.',
    'La confiance est essentielle dans la relation entre influenceur et audience.'
  ];
  
  const responses: SurveyResponse[] = [];

  for (let i = 0; i < count; i++) {
    const usesSocialMedia = Math.random() > 0.2; // 80% use social media
    const followsInfluencers = usesSocialMedia && Math.random() > 0.3; // 70% of social media users follow influencers
    
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

    // Influencer relations data
    const influencerRelationsData = {
      followsInfluencers: followsInfluencers,
      followReasons: followsInfluencers ? getRandomItems(influencerFollowReasons, 1, 3) : [],
      otherFollowReason: followsInfluencers && Math.random() > 0.7 ? "Autre raison personnalisée" : undefined,
      trustLevel: followsInfluencers ? getRandomItem(trustLevels) : 'medium'
    };

    // Engagement data
    const hasLikedSponsoredPost = followsInfluencers && getRandomBoolean(0.6);
    const engagementData = {
      hasLikedSponsoredPost: hasLikedSponsoredPost,
      sponsoredPostReaction: followsInfluencers ? getRandomItem(sponsoredPostReactions) : 'ignore',
      hasResearchedProduct: followsInfluencers && getRandomBoolean(0.5),
      hasPurchasedProduct: followsInfluencers ? (Math.random() > 0.7 ? null : getRandomBoolean(0.4)) : false
    };

    // Purchase intention data
    const isLoyalToInfluencers = followsInfluencers && getRandomBoolean(0.4);
    const purchaseIntentionData = {
      influenceLevel: followsInfluencers ? getRandomItem(influenceLevels) : 'not-at-all',
      preferredInfluencerType: followsInfluencers ? getRandomItem(influencerTypes) : 'doesnt-matter',
      isLoyalToInfluencers: isLoyalToInfluencers,
      loyaltyReason: isLoyalToInfluencers ? getRandomItem(loyaltyReasons) : ''
    };

    // Global appreciation data
    const includeAdditionalRemarks = followsInfluencers && getRandomBoolean(0.5);
    const globalAppreciationData = {
      marketingEfficiency: followsInfluencers ? getRandomItem(marketingEfficiencies) : 'not-at-all',
      additionalRemarks: includeAdditionalRemarks ? getRandomItem(additionalRemarks) : ''
    };

    const response: SurveyResponse = {
      id: uuidv4(),
      submittedAt: getRandomDate(),
      demographics: {
        ageGroup: getRandomItem(ageGroups),
        educationLevel: getRandomItem(educationLevels),
        professionalSector: getRandomItem(professionalSectors),
      },
      socialMedia: socialMediaData,
      influencerRelations: influencerRelationsData,
      engagement: engagementData,
      purchaseIntention: purchaseIntentionData,
      globalAppreciation: globalAppreciationData,
      additionalFeedback: ''
    };

    responses.push(response);
  }

  return responses;
};
