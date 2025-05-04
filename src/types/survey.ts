
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

// Influencer Relations
export type InfluencerFollowReason = 'fashion-beauty' | 'travel-discovery' | 'product-advice' | 'humor-entertainment' | 'other';
export type TrustLevel = 'not-at-all' | 'little' | 'medium' | 'lot' | 'completely';

// Engagement
export type SponsoredPostReaction = 'ignore' | 'read-no-reaction' | 'interested-more-info' | 'click-link-product';

// Purchase Intention
export type InfluenceLevel = 'not-at-all' | 'little' | 'medium' | 'lot' | 'enormously';
export type InfluencerType = 'micro' | 'macro' | 'doesnt-matter';
export type MarketingEfficiency = 'not-at-all' | 'not-very' | 'moderately' | 'very';

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

  // Influencer Relations
  influencerRelations: {
    followsInfluencers: boolean;
    followReasons: InfluencerFollowReason[];
    otherFollowReason?: string;
    trustLevel: TrustLevel;
  };

  // Engagement and Behavior
  engagement: {
    hasLikedSponsoredPost: boolean;
    sponsoredPostReaction: SponsoredPostReaction;
    hasResearchedProduct: boolean;
    hasPurchasedProduct: boolean | null; // null for "I don't know"
  };

  // Purchase Intention
  purchaseIntention: {
    influenceLevel: InfluenceLevel;
    preferredInfluencerType: InfluencerType;
    isLoyalToInfluencers: boolean;
    loyaltyReason?: string;
  };
  
  // Global Appreciation
  globalAppreciation: {
    marketingEfficiency: MarketingEfficiency;
    additionalRemarks?: string;
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
  influencerRelations: {
    followsInfluencers: false,
    followReasons: [],
    trustLevel: 'medium'
  },
  engagement: {
    hasLikedSponsoredPost: false,
    sponsoredPostReaction: 'ignore',
    hasResearchedProduct: false,
    hasPurchasedProduct: false
  },
  purchaseIntention: {
    influenceLevel: 'medium',
    preferredInfluencerType: 'doesnt-matter',
    isLoyalToInfluencers: false,
    loyaltyReason: ''
  },
  globalAppreciation: {
    marketingEfficiency: 'moderately',
    additionalRemarks: ''
  },
  additionalFeedback: '',
};
