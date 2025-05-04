
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SurveyResponse, SponsoredPostReaction } from '@/types/survey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

interface EngagementSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

const EngagementSection: React.FC<EngagementSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const isMobile = useIsMobile();

  // Skip this section if the user doesn't use social media or doesn't follow influencers
  if (!surveyData.socialMedia?.usesSocialMedia || !surveyData.influencerRelations?.followsInfluencers) {
    return null;
  }

  const reactionLabels: Record<SponsoredPostReaction, string> = {
    'ignore': 'Je l\'ignore',
    'read-no-reaction': 'Je la lis mais ne réagis pas',
    'interested-more-info': 'Je m\'y intéresse et cherche plus d\'infos',
    'click-link-product': 'Je clique souvent sur le lien/produit'
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Engagement et comportement
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-3" : undefined}>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Avez-vous déjà liké/commenté une publication sponsorisée d'un influenceur ?</p>
            <RadioGroup 
              value={surveyData.engagement?.hasLikedSponsoredPost ? "yes" : "no"}
              onValueChange={(value) => updateSurveyData('engagement.hasLikedSponsoredPost', value === "yes")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="liked-yes" />
                <Label htmlFor="liked-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="liked-no" />
                <Label htmlFor="liked-no">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Quelle est votre réaction face à une publication sponsorisée ?</p>
            <RadioGroup 
              value={surveyData.engagement?.sponsoredPostReaction}
              onValueChange={(value) => updateSurveyData('engagement.sponsoredPostReaction', value as SponsoredPostReaction)}
              className="flex flex-col space-y-2"
            >
              {Object.entries(reactionLabels).map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <RadioGroupItem value={value} id={`reaction-${value}`} />
                  <Label htmlFor={`reaction-${value}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Avez-vous déjà recherché un produit recommandé par un influenceur sur réseaux sociaux ?</p>
            <RadioGroup 
              value={surveyData.engagement?.hasResearchedProduct ? "yes" : "no"}
              onValueChange={(value) => updateSurveyData('engagement.hasResearchedProduct', value === "yes")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="researched-yes" />
                <Label htmlFor="researched-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="researched-no" />
                <Label htmlFor="researched-no">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Avez-vous déjà acheté un produit ou service suite à la recommandation d'un influenceur sur réseaux sociaux ?</p>
            <RadioGroup 
              value={
                surveyData.engagement?.hasPurchasedProduct === true ? "yes" : 
                surveyData.engagement?.hasPurchasedProduct === false ? "no" : 
                "unknown"
              }
              onValueChange={(value) => {
                let boolValue = null;
                if (value === "yes") boolValue = true;
                if (value === "no") boolValue = false;
                updateSurveyData('engagement.hasPurchasedProduct', boolValue);
              }}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="purchased-yes" />
                <Label htmlFor="purchased-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="purchased-no" />
                <Label htmlFor="purchased-no">Non</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="unknown" id="purchased-unknown" />
                <Label htmlFor="purchased-unknown">Je ne sais plus</Label>
              </div>
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EngagementSection;
