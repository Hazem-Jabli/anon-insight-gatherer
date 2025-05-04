
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { SurveyResponse, MarketingEfficiency } from '@/types/survey';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

interface GlobalAppreciationSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

const GlobalAppreciationSection: React.FC<GlobalAppreciationSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const isMobile = useIsMobile();

  // Skip this section if the user doesn't use social media or doesn't follow influencers
  if (!surveyData.socialMedia?.usesSocialMedia || !surveyData.influencerRelations?.followsInfluencers) {
    return null;
  }

  const efficiencyLabels: Record<MarketingEfficiency, string> = {
    'not-at-all': 'Pas du tout',
    'not-very': 'Peu efficace',
    'moderately': 'Moyennement efficace',
    'very': 'Très efficace'
  };

  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Appréciation globale
        </CardTitle>
      </CardHeader>
      <CardContent className={isMobile ? "px-3 py-3" : undefined}>
        <div className="space-y-6">
          <div>
            <p className="text-sm font-medium mb-2">Selon vous, le marketing d'influence sur réseaux sociaux est-il une bonne stratégie pour les marques ?</p>
            <RadioGroup 
              value={surveyData.globalAppreciation?.marketingEfficiency}
              onValueChange={(value) => updateSurveyData('globalAppreciation.marketingEfficiency', value as MarketingEfficiency)}
              className="grid grid-cols-1 sm:grid-cols-4 gap-2"
            >
              {Object.entries(efficiencyLabels).map(([value, label]) => (
                <div className="flex items-center space-x-2" key={value}>
                  <RadioGroupItem value={value} id={`efficiency-${value}`} />
                  <Label htmlFor={`efficiency-${value}`} className="text-sm">{label}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          <div>
            <Label htmlFor="additional-remarks" className="text-sm font-medium mb-2">
              Avez-vous d'autres remarques ou expériences à partager sur votre relation avec les influenceurs ?
            </Label>
            <Textarea 
              id="additional-remarks"
              value={surveyData.globalAppreciation?.additionalRemarks || ''}
              onChange={(e) => updateSurveyData('globalAppreciation.additionalRemarks', e.target.value)}
              className="mt-1"
              placeholder="Partagez vos expériences ou remarques..."
              rows={4}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default GlobalAppreciationSection;
