
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyResponse } from '@/types/survey';

interface DemographicsSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

const DemographicsSection: React.FC<DemographicsSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Informations générales du répondant
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-4 sm:space-y-6 ${isMobile ? "px-3 py-3" : undefined}`}>
        {/* Menu déroulant Groupe d'âge */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="age-group" className="block text-sm font-medium">
            Groupe d'âge
          </Label>
          <Select
            value={surveyData.demographics.ageGroup}
            onValueChange={(value) => updateSurveyData('demographics.ageGroup', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un groupe d'âge" />
            </SelectTrigger>
            <SelectContent id="age-group">
              <SelectItem value="18-24">18-24 ans</SelectItem>
              <SelectItem value="25-34">25-34 ans</SelectItem>
              <SelectItem value="35-44">35-44 ans</SelectItem>
              <SelectItem value="45-54">45-54 ans</SelectItem>
              <SelectItem value="55-64">55-64 ans</SelectItem>
              <SelectItem value="65+">65+ ans</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Menu déroulant Niveau d'éducation */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="education-level" className="block text-sm font-medium">
            <span className="font-bold text-survey-primary">Niveau d'éducation</span>
            <span className="ml-2 text-xs text-gray-500">(Veuillez sélectionner votre plus haut niveau d'étude)</span>
          </Label>
          <Select
            value={surveyData.demographics.educationLevel}
            onValueChange={(value) => updateSurveyData('demographics.educationLevel', value)}
          >
            <SelectTrigger className="w-full border-survey-primary">
              <SelectValue placeholder="Sélectionner un niveau d'éducation" />
            </SelectTrigger>
            <SelectContent id="education-level" className="bg-white dark:bg-gray-800">
              <SelectItem value="high-school">Lycée</SelectItem>
              <SelectItem value="some-college">Formation supérieure</SelectItem>
              <SelectItem value="bachelors">Licence</SelectItem>
              <SelectItem value="masters">Master</SelectItem>
              <SelectItem value="doctorate">Doctorat</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Menu déroulant Secteur Professionnel */}
        <div className="space-y-2 sm:space-y-3">
          <Label htmlFor="professional-sector" className="block text-sm font-medium">
            Secteur Professionnel
          </Label>
          <Select
            value={surveyData.demographics.professionalSector}
            onValueChange={(value) => updateSurveyData('demographics.professionalSector', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un secteur" />
            </SelectTrigger>
            <SelectContent id="professional-sector">
              <SelectItem value="technology">Technologie</SelectItem>
              <SelectItem value="healthcare">Santé</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Éducation</SelectItem>
              <SelectItem value="manufacturing">Industrie</SelectItem>
              <SelectItem value="retail">Commerce</SelectItem>
              <SelectItem value="government">Administration</SelectItem>
              <SelectItem value="non-profit">Association</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographicsSection;
