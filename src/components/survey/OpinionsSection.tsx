
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Radio } from '@/components/ui/radio';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyResponse } from '@/types/survey';

interface OpinionsSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

// Tableaux d'options
const advantageOptions = [
  { id: 'higher-returns', label: 'Potentiel de rendements plus élevés' },
  { id: 'diversification', label: 'Diversification du portefeuille' },
  { id: 'tax-benefits', label: 'Avantages fiscaux' },
  { id: 'leverage', label: 'Pouvoir d\'achat accru grâce à l\'effet de levier' },
  { id: 'professional-management', label: 'Accès à une gestion professionnelle' },
  { id: 'liquidity', label: 'Meilleure liquidité' },
];

const riskOptions = [
  { id: 'market-volatility', label: 'Volatilité du marché' },
  { id: 'interest-rate', label: 'Risque de taux d\'intérêt' },
  { id: 'leverage-risk', label: 'Risque d\'effet de levier excessif' },
  { id: 'default', label: 'Risque de défaut' },
  { id: 'illiquidity', label: 'Illiquidité' },
  { id: 'regulatory', label: 'Changements réglementaires' },
];

const barrierOptions = [
  { id: 'lack-knowledge', label: 'Manque de connaissances/compréhension' },
  { id: 'high-fees', label: 'Frais et coûts élevés' },
  { id: 'min-requirements', label: 'Exigences minimales d\'investissement' },
  { id: 'risk-concerns', label: 'Préoccupations liées au risque' },
  { id: 'lack-advice', label: 'Manque de conseils fiables' },
  { id: 'complex-terms', label: 'Conditions générales complexes' },
  { id: 'past-experience', label: 'Expérience passée négative' },
];

const OpinionsSection: React.FC<OpinionsSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  // Gérer les modifications du tableau de cases à cocher
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
          Opinions et Préférences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Tolérance au risque */}
        <div className="space-y-3">
          <Label htmlFor="risk-tolerance" className="block text-sm font-medium mb-2">
            Comment décririez-vous votre tolérance au risque pour les investissements ?
          </Label>
          <RadioGroup 
            id="risk-tolerance"
            value={surveyData.opinions.riskTolerance}
            onValueChange={(value) => updateSurveyData('opinions.riskTolerance', value)}
            className="flex flex-col space-y-3"
          >
            <div className="flex items-center space-x-2">
              <Radio value="very-low" id="risk-very-low" />
              <Label htmlFor="risk-very-low">Très faible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="low" id="risk-low" />
              <Label htmlFor="risk-low">Faible</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="moderate" id="risk-moderate" />
              <Label htmlFor="risk-moderate">Modérée</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="high" id="risk-high" />
              <Label htmlFor="risk-high">Élevée</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="very-high" id="risk-very-high" />
              <Label htmlFor="risk-very-high">Très élevée</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Avantages perçus */}
        <div className="space-y-3">
          <Label className="block text-sm font-medium mb-2">
            Quels sont selon vous les principaux avantages du crédit d'investissement ? (Sélectionnez tous ceux qui s'appliquent)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
        
        {/* Risques perçus */}
        <div className="space-y-3">
          <Label className="block text-sm font-medium mb-2">
            Quels sont selon vous les principaux risques du crédit d'investissement ? (Sélectionnez tous ceux qui s'appliquent)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
        
        {/* Obstacles à l'investissement */}
        <div className="space-y-3">
          <Label className="block text-sm font-medium mb-2">
            Quels obstacles vous empêchent d'utiliser des produits de crédit d'investissement ? (Sélectionnez tous ceux qui s'appliquent)
          </Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
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
      </CardContent>
    </Card>
  );
};

export default OpinionsSection;
