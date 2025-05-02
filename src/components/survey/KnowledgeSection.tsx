
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyResponse } from '@/types/survey';

interface KnowledgeSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

// Liste des types d'investissement
const investmentTypes = [
  { id: 'stocks', label: 'Actions' },
  { id: 'bonds', label: 'Obligations' },
  { id: 'mutual-funds', label: 'Fonds communs' },
  { id: 'etfs', label: 'FNB' },
  { id: 'real-estate', label: 'Immobilier' },
  { id: 'crypto', label: 'Cryptomonnaies' },
  { id: 'retirement', label: 'Comptes de retraite' },
  { id: 'commodities', label: 'Matières premières' },
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
        <CardTitle className="text-xl font-semibold text-survey-dark dark:text-gray-100">
          Connaissances et Expérience en Investissement
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-12">
        {/* Connaissance auto-évaluée */}
        <div className="space-y-3">
          <Label htmlFor="knowledge-level" className="block text-sm font-medium mb-2">
            Comment évalueriez-vous votre connaissance du crédit d'investissement ?
          </Label>
          <RadioGroup 
            id="knowledge-level"
            value={surveyData.investmentKnowledge.selfRatedKnowledge}
            onValueChange={(value) => updateSurveyData('investmentKnowledge.selfRatedKnowledge', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="none" id="knowledge-none" />
              <Label htmlFor="knowledge-none">Aucune</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="basic" id="knowledge-basic" />
              <Label htmlFor="knowledge-basic">Basique</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="intermediate" id="knowledge-intermediate" />
              <Label htmlFor="knowledge-intermediate">Intermédiaire</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="advanced" id="knowledge-advanced" />
              <Label htmlFor="knowledge-advanced">Avancée</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="expert" id="knowledge-expert" />
              <Label htmlFor="knowledge-expert">Expert</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Expérience précédente */}
        <div className="space-y-3">
          <Label htmlFor="previous-experience" className="block text-sm font-medium mb-2">
            Avez-vous déjà utilisé des produits de crédit d'investissement ?
          </Label>
          <RadioGroup 
            id="previous-experience"
            value={surveyData.investmentKnowledge.previousExperience ? "yes" : "no"}
            onValueChange={(value) => updateSurveyData('investmentKnowledge.previousExperience', value === "yes")}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="experience-yes" />
              <Label htmlFor="experience-yes">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="experience-no" />
              <Label htmlFor="experience-no">Non</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Fréquence d'investissement */}
        <div className="space-y-3">
          <Label htmlFor="investment-frequency" className="block text-sm font-medium mb-2">
            À quelle fréquence prenez-vous des décisions d'investissement ?
          </Label>
          <RadioGroup 
            id="investment-frequency"
            value={surveyData.investmentKnowledge.frequencyOfInvestment}
            onValueChange={(value) => updateSurveyData('investmentKnowledge.frequencyOfInvestment', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="never" id="frequency-never" />
              <Label htmlFor="frequency-never">Jamais</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="rarely" id="frequency-rarely" />
              <Label htmlFor="frequency-rarely">Rarement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="occasionally" id="frequency-occasionally" />
              <Label htmlFor="frequency-occasionally">Occasionnellement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="frequently" id="frequency-frequently" />
              <Label htmlFor="frequency-frequently">Fréquemment</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="regularly" id="frequency-regularly" />
              <Label htmlFor="frequency-regularly">Régulièrement</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Types d'investissement préférés */}
        <div className="space-y-3">
          <Label className="block text-sm font-medium mb-2">
            Quels types d'investissement vous intéressent le plus ? (Sélectionnez tous ceux qui s'appliquent)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
