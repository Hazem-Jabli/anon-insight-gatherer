
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SurveyResponse, InfluenceLevel, InfluencerType } from '@/types/survey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface PurchaseIntentionSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

const PurchaseIntentionSection: React.FC<PurchaseIntentionSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const isMobile = useIsMobile();

  // Skip this section if the user doesn't use social media or doesn't follow influencers
  if (!surveyData.socialMedia?.usesSocialMedia || !surveyData.influencerRelations?.followsInfluencers) {
    return null;
  }

  const influenceLevelLabels: Record<InfluenceLevel, string> = {
    'not-at-all': 'Pas du tout',
    'little': 'Un peu',
    'medium': 'Moyennement',
    'lot': 'Beaucoup',
    'enormously': 'Énormément'
  };

  const influencerTypeLabels: Record<InfluencerType, string> = {
    'micro': 'Micro-influenceurs (moins de 100 000 abonnés)',
    'macro': 'Macro-influenceurs (plus de 100 000 abonnés)',
    'doesnt-matter': 'Peu importe'
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Intention d'achat et fidélité
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-3" : undefined}>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">En général, les publications des influenceurs influencent-elles votre intention d'achat ?</p>
            <RadioGroup 
              value={surveyData.purchaseIntention?.influenceLevel}
              onValueChange={(value) => updateSurveyData('purchaseIntention.influenceLevel', value as InfluenceLevel)}
              className="grid grid-cols-1 sm:grid-cols-5 gap-2"
            >
              {Object.entries(influenceLevelLabels).map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <RadioGroupItem value={value} id={`influence-${value}`} />
                  <Label htmlFor={`influence-${value}`} className="text-sm">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Quels types d'influenceurs vous incitent le plus à acheter ?</p>
            <RadioGroup 
              value={surveyData.purchaseIntention?.preferredInfluencerType}
              onValueChange={(value) => updateSurveyData('purchaseIntention.preferredInfluencerType', value as InfluencerType)}
              className="flex flex-col space-y-2"
            >
              {Object.entries(influencerTypeLabels).map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <RadioGroupItem value={value} id={`type-${value}`} />
                  <Label htmlFor={`type-${value}`}>{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <p className="text-sm font-medium mb-2">Êtes-vous fidèle à un ou plusieurs influenceurs au point de suivre leurs recommandations de manière récurrente ?</p>
            <RadioGroup 
              value={surveyData.purchaseIntention?.isLoyalToInfluencers ? "yes" : "no"}
              onValueChange={(value) => updateSurveyData('purchaseIntention.isLoyalToInfluencers', value === "yes")}
              className="flex flex-col space-y-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="yes" id="loyal-yes" />
                <Label htmlFor="loyal-yes">Oui</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="no" id="loyal-no" />
                <Label htmlFor="loyal-no">Non</Label>
              </div>
            </RadioGroup>
          </div>

          {surveyData.purchaseIntention?.isLoyalToInfluencers && (
            <div>
              <Label htmlFor="loyalty-reason" className="text-sm font-medium mb-2">Si oui, pourquoi ? (Ex. : J'ai confiance, j'aime leur style, ils sont authentiques, etc.)</Label>
              <Textarea 
                id="loyalty-reason"
                value={surveyData.purchaseIntention?.loyaltyReason || ''}
                onChange={(e) => updateSurveyData('purchaseIntention.loyaltyReason', e.target.value)}
                className="mt-1"
                placeholder="Expliquez pourquoi vous êtes fidèle à certains influenceurs..."
                rows={3}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PurchaseIntentionSection;
