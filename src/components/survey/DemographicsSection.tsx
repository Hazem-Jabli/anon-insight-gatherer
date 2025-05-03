
import React from 'react';
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
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-survey-dark dark:text-gray-100">Informations Démographiques</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Menu déroulant Groupe d'âge */}
        <div className="space-y-3">
          <Label htmlFor="age-group" className="block text-sm font-medium mb-2">
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
        <div className="space-y-3">
          <Label htmlFor="education-level" className="block text-sm font-medium mb-2">
            Niveau d'éducation
          </Label>
          <Select
            value={surveyData.demographics.educationLevel}
            onValueChange={(value) => updateSurveyData('demographics.educationLevel', value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un niveau d'éducation" />
            </SelectTrigger>
            <SelectContent id="education-level">
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
        <div className="space-y-3">
          <Label htmlFor="professional-sector" className="block text-sm font-medium mb-2">
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
