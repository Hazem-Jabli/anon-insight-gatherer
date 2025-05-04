
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SurveyResponse, InfluencerFollowReason, TrustLevel } from '@/types/survey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface InfluencerRelationsSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

const InfluencerRelationsSection: React.FC<InfluencerRelationsSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const isMobile = useIsMobile();

  // Skip this section if the user doesn't use social media
  if (!surveyData.socialMedia?.usesSocialMedia) {
    return null;
  }

  const handleFollowsInfluencers = (follows: boolean) => {
    updateSurveyData('influencerRelations.followsInfluencers', follows);
  };

  const handleFollowReasonChange = (reason: InfluencerFollowReason, checked: boolean) => {
    const currentReasons = [...(surveyData.influencerRelations?.followReasons || [])];
    
    if (checked) {
      if (!currentReasons.includes(reason)) {
        updateSurveyData('influencerRelations.followReasons', [...currentReasons, reason]);
      }
    } else {
      updateSurveyData('influencerRelations.followReasons', currentReasons.filter(r => r !== reason));
    }
  };

  const handleTrustLevelChange = (level: TrustLevel) => {
    updateSurveyData('influencerRelations.trustLevel', level);
  };

  // Skip the rest of this section questions if user doesn't follow influencers
  if (surveyData.influencerRelations?.followsInfluencers === false) {
    return (
      <Card className="mb-4 sm:mb-6">
        <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
          <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
            Relations avec les influenceurs sur réseaux sociaux
          </CardTitle>
        </CardHeader>
        <CardContent className={isMobile ? "px-3 py-3" : undefined}>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium mb-2">Suivez-vous des influenceurs sur réseaux sociaux?</p>
              <RadioGroup 
                value={surveyData.influencerRelations?.followsInfluencers ? "yes" : "no"}
                onValueChange={(value) => handleFollowsInfluencers(value === "yes")}
                className="flex flex-col space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="follows-yes" />
                  <Label htmlFor="follows-yes">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="follows-no" />
                  <Label htmlFor="follows-no">Non</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const reasonLabels: Record<InfluencerFollowReason, string> = {
    'fashion-beauty': 'Inspiration mode/beauté',
    'travel-discovery': 'Voyages et découvertes',
    'product-advice': 'Conseils produits',
    'humor-entertainment': 'Humour/divertissement',
    'other': 'Autre'
  };

  const trustLevelLabels: Record<TrustLevel, string> = {
    'not-at-all': 'Pas du tout',
    'little': 'Peu',
    'medium': 'Moyennement',
    'lot': 'Beaucoup',
    'completely': 'Complètement'
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Relations avec les influenceurs sur réseaux sociaux
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-3" : undefined}>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Suivez-vous des influenceurs sur réseaux sociaux?</p>
            <RadioGroup 
              value={surveyData.influencerRelations?.followsInfluencers ? "yes" : "no"}
              onValueChange={(value) => handleFollowsInfluencers(value === "yes")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="follows-yes" />
                <Label htmlFor="follows-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="follows-no" />
                <Label htmlFor="follows-no">Non</Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-3">
            <p className="text-sm font-medium mb-1">Pour quelles raisons suivez-vous principalement des influenceurs ? (Plusieurs réponses possibles)</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(reasonLabels).map(([value, label]) => (
                <div className="flex items-start space-x-2" key={value}>
                  <Checkbox 
                    id={`reason-${value}`} 
                    checked={surveyData.influencerRelations?.followReasons?.includes(value as InfluencerFollowReason)}
                    onCheckedChange={(checked) => handleFollowReasonChange(value as InfluencerFollowReason, checked === true)}
                  />
                  <Label htmlFor={`reason-${value}`} className="text-sm leading-tight">{label}</Label>
                </div>
              ))}
            </div>
            {surveyData.influencerRelations?.followReasons?.includes('other') && (
              <div className="mt-2">
                <Label htmlFor="other-reason" className="text-sm">Préciser:</Label>
                <Input 
                  id="other-reason"
                  value={surveyData.influencerRelations?.otherFollowReason || ''}
                  onChange={(e) => updateSurveyData('influencerRelations.otherFollowReason', e.target.value)}
                  className="mt-1"
                  placeholder="Autre raison..."
                />
              </div>
            )}
          </div>

          <div>
            <p className="text-sm font-medium mb-2">En général, à quel point faites-vous confiance aux recommandations des influenceurs que vous suivez ?</p>
            <RadioGroup 
              value={surveyData.influencerRelations?.trustLevel}
              onValueChange={(value) => handleTrustLevelChange(value as TrustLevel)}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              {Object.entries(trustLevelLabels).map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <RadioGroupItem value={value} id={`trust-${value}`} />
                  <Label htmlFor={`trust-${value}`} className="text-sm">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InfluencerRelationsSection;
