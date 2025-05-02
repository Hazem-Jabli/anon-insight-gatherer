
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Radio } from '@/components/ui/radio';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyResponse } from '@/types/survey';

interface OpinionsSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

// Arrays of options
const advantageOptions = [
  { id: 'higher-returns', label: 'Potential for higher returns' },
  { id: 'diversification', label: 'Portfolio diversification' },
  { id: 'tax-benefits', label: 'Tax benefits' },
  { id: 'leverage', label: 'Increased purchasing power through leverage' },
  { id: 'professional-management', label: 'Access to professional management' },
  { id: 'liquidity', label: 'Improved liquidity' },
];

const riskOptions = [
  { id: 'market-volatility', label: 'Market volatility' },
  { id: 'interest-rate', label: 'Interest rate risk' },
  { id: 'leverage-risk', label: 'Risk of excessive leverage' },
  { id: 'default', label: 'Default risk' },
  { id: 'illiquidity', label: 'Illiquidity' },
  { id: 'regulatory', label: 'Regulatory changes' },
];

const barrierOptions = [
  { id: 'lack-knowledge', label: 'Lack of knowledge/understanding' },
  { id: 'high-fees', label: 'High fees and costs' },
  { id: 'min-requirements', label: 'Minimum investment requirements' },
  { id: 'risk-concerns', label: 'Risk concerns' },
  { id: 'lack-advice', label: 'Lack of trusted advice' },
  { id: 'complex-terms', label: 'Complex terms and conditions' },
  { id: 'past-experience', label: 'Negative past experience' },
];

const OpinionsSection: React.FC<OpinionsSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  // Handle checkbox array changes
  const handleCheckboxArrayChange = (
    arrayName: 'perceivedAdvantages' | 'perceivedRisks' | 'barriersToInvestment',
    itemId: string,
    checked: boolean
  ) => {
    const currentArray = [...surveyData.opinions[arrayName]];
    
    if (checked) {
      if (!currentArray.includes(itemId)) {
        updateSurveyData(
          `opinions.${arrayName}`, 
          [...currentArray, itemId]
        );
      }
    } else {
      updateSurveyData(
        `opinions.${arrayName}`,
        currentArray.filter(item => item !== itemId)
      );
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-survey-dark">
          Opinions & Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Risk Tolerance */}
        <div>
          <Label htmlFor="risk-tolerance" className="block text-sm font-medium mb-2">
            How would you describe your risk tolerance for investments?
          </Label>
          <RadioGroup 
            id="risk-tolerance"
            value={surveyData.opinions.riskTolerance}
            onValueChange={(value) => updateSurveyData('opinions.riskTolerance', value)}
            className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <Radio value="very-low" id="risk-very-low" />
              <Label htmlFor="risk-very-low">Very Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="low" id="risk-low" />
              <Label htmlFor="risk-low">Low</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="moderate" id="risk-moderate" />
              <Label htmlFor="risk-moderate">Moderate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="high" id="risk-high" />
              <Label htmlFor="risk-high">High</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="very-high" id="risk-very-high" />
              <Label htmlFor="risk-very-high">Very High</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Perceived Advantages */}
        <div>
          <Label className="block text-sm font-medium mb-2">
            What do you perceive as the main advantages of investment credit? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {advantageOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`advantage-${option.id}`}
                  checked={surveyData.opinions.perceivedAdvantages.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxArrayChange('perceivedAdvantages', option.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`advantage-${option.id}`}
                  className="text-sm"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Perceived Risks */}
        <div>
          <Label className="block text-sm font-medium mb-2">
            What do you perceive as the main risks of investment credit? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {riskOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`risk-${option.id}`}
                  checked={surveyData.opinions.perceivedRisks.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxArrayChange('perceivedRisks', option.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`risk-${option.id}`}
                  className="text-sm"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Barriers to Investment */}
        <div>
          <Label className="block text-sm font-medium mb-2">
            What barriers prevent you from using investment credit products? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {barrierOptions.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`barrier-${option.id}`}
                  checked={surveyData.opinions.barriersToInvestment.includes(option.id)}
                  onCheckedChange={(checked) => 
                    handleCheckboxArrayChange('barriersToInvestment', option.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`barrier-${option.id}`}
                  className="text-sm"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Additional Feedback */}
        <div>
          <Label htmlFor="additional-feedback" className="block text-sm font-medium mb-2">
            Do you have any additional thoughts on investment credit? (Optional)
          </Label>
          <Textarea
            id="additional-feedback"
            placeholder="Share your thoughts here..."
            value={surveyData.additionalFeedback || ''}
            onChange={(e) => updateSurveyData('additionalFeedback', e.target.value)}
            className="w-full h-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default OpinionsSection;
