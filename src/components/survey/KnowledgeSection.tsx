
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Radio } from '@/components/ui/radio';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyResponse } from '@/types/survey';

interface KnowledgeSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

// Array of investment types
const investmentTypes = [
  { id: 'stocks', label: 'Stocks' },
  { id: 'bonds', label: 'Bonds' },
  { id: 'mutual-funds', label: 'Mutual Funds' },
  { id: 'etfs', label: 'ETFs' },
  { id: 'real-estate', label: 'Real Estate' },
  { id: 'crypto', label: 'Cryptocurrencies' },
  { id: 'retirement', label: 'Retirement Accounts' },
  { id: 'commodities', label: 'Commodities' },
];

const KnowledgeSection: React.FC<KnowledgeSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const handleInvestmentTypeChange = (
    investmentType: string, 
    checked: boolean
  ) => {
    const currentTypes = [...surveyData.investmentKnowledge.preferredInvestmentTypes];
    
    if (checked) {
      if (!currentTypes.includes(investmentType)) {
        updateSurveyData(
          'investmentKnowledge.preferredInvestmentTypes', 
          [...currentTypes, investmentType]
        );
      }
    } else {
      updateSurveyData(
        'investmentKnowledge.preferredInvestmentTypes',
        currentTypes.filter(type => type !== investmentType)
      );
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-survey-dark">
          Investment Knowledge & Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Self-Rated Knowledge */}
        <div>
          <Label htmlFor="knowledge-level" className="block text-sm font-medium mb-2">
            How would you rate your knowledge of investment credit?
          </Label>
          <RadioGroup 
            id="knowledge-level"
            value={surveyData.investmentKnowledge.selfRatedKnowledge}
            onValueChange={(value) => updateSurveyData('investmentKnowledge.selfRatedKnowledge', value)}
            className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <Radio value="none" id="knowledge-none" />
              <Label htmlFor="knowledge-none">None</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="basic" id="knowledge-basic" />
              <Label htmlFor="knowledge-basic">Basic</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="intermediate" id="knowledge-intermediate" />
              <Label htmlFor="knowledge-intermediate">Intermediate</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="advanced" id="knowledge-advanced" />
              <Label htmlFor="knowledge-advanced">Advanced</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="expert" id="knowledge-expert" />
              <Label htmlFor="knowledge-expert">Expert</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Previous Experience */}
        <div>
          <Label htmlFor="previous-experience" className="block text-sm font-medium mb-2">
            Have you previously used investment credit products?
          </Label>
          <RadioGroup 
            id="previous-experience"
            value={surveyData.investmentKnowledge.previousExperience ? "yes" : "no"}
            onValueChange={(value) => updateSurveyData('investmentKnowledge.previousExperience', value === "yes")}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <Radio value="yes" id="experience-yes" />
              <Label htmlFor="experience-yes">Yes</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="no" id="experience-no" />
              <Label htmlFor="experience-no">No</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Investment Frequency */}
        <div>
          <Label htmlFor="investment-frequency" className="block text-sm font-medium mb-2">
            How often do you make investment decisions?
          </Label>
          <RadioGroup 
            id="investment-frequency"
            value={surveyData.investmentKnowledge.frequencyOfInvestment}
            onValueChange={(value) => updateSurveyData('investmentKnowledge.frequencyOfInvestment', value)}
            className="flex flex-col space-y-1 sm:space-y-0 sm:flex-row sm:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <Radio value="never" id="frequency-never" />
              <Label htmlFor="frequency-never">Never</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="rarely" id="frequency-rarely" />
              <Label htmlFor="frequency-rarely">Rarely</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="occasionally" id="frequency-occasionally" />
              <Label htmlFor="frequency-occasionally">Occasionally</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="frequently" id="frequency-frequently" />
              <Label htmlFor="frequency-frequently">Frequently</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="regularly" id="frequency-regularly" />
              <Label htmlFor="frequency-regularly">Regularly</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Preferred Investment Types */}
        <div>
          <Label className="block text-sm font-medium mb-2">
            Which investment types are you most interested in? (Select all that apply)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-1">
            {investmentTypes.map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`investment-type-${type.id}`}
                  checked={surveyData.investmentKnowledge.preferredInvestmentTypes.includes(type.id)}
                  onCheckedChange={(checked) => 
                    handleInvestmentTypeChange(type.id, checked === true)
                  }
                />
                <Label 
                  htmlFor={`investment-type-${type.id}`}
                  className="text-sm"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default KnowledgeSection;
