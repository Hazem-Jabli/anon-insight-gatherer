
import React from 'react';
import { RadioGroup } from '@/components/ui/radio-group';
import { Radio } from '@/components/ui/radio';
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
        <CardTitle className="text-xl font-semibold text-survey-dark">Demographics Information</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gender Selection */}
        <div>
          <Label htmlFor="gender" className="block text-sm font-medium mb-2">
            Gender
          </Label>
          <RadioGroup 
            id="gender"
            value={surveyData.demographics.gender}
            onValueChange={(value) => updateSurveyData('demographics.gender', value)}
            className="flex flex-col space-y-1 sm:flex-row sm:space-y-0 sm:space-x-4"
          >
            <div className="flex items-center space-x-2">
              <Radio value="male" id="gender-male" />
              <Label htmlFor="gender-male">Male</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="female" id="gender-female" />
              <Label htmlFor="gender-female">Female</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="non-binary" id="gender-non-binary" />
              <Label htmlFor="gender-non-binary">Non-binary</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Radio value="prefer-not-to-say" id="gender-prefer-not-to-say" />
              <Label htmlFor="gender-prefer-not-to-say">Prefer not to say</Label>
            </div>
          </RadioGroup>
        </div>
        
        {/* Age Group Dropdown */}
        <div>
          <Label htmlFor="age-group" className="block text-sm font-medium mb-2">
            Age Group
          </Label>
          <Select
            value={surveyData.demographics.ageGroup}
            onValueChange={(value) => updateSurveyData('demographics.ageGroup', value)}
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select age group" />
            </SelectTrigger>
            <SelectContent id="age-group">
              <SelectItem value="18-24">18-24 years</SelectItem>
              <SelectItem value="25-34">25-34 years</SelectItem>
              <SelectItem value="35-44">35-44 years</SelectItem>
              <SelectItem value="45-54">45-54 years</SelectItem>
              <SelectItem value="55-64">55-64 years</SelectItem>
              <SelectItem value="65+">65+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Education Level Dropdown */}
        <div>
          <Label htmlFor="education-level" className="block text-sm font-medium mb-2">
            Education Level
          </Label>
          <Select
            value={surveyData.demographics.educationLevel}
            onValueChange={(value) => updateSurveyData('demographics.educationLevel', value)}
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select education level" />
            </SelectTrigger>
            <SelectContent id="education-level">
              <SelectItem value="high-school">High School</SelectItem>
              <SelectItem value="some-college">Some College</SelectItem>
              <SelectItem value="bachelors">Bachelor's Degree</SelectItem>
              <SelectItem value="masters">Master's Degree</SelectItem>
              <SelectItem value="doctorate">Doctorate</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        {/* Professional Sector Dropdown */}
        <div>
          <Label htmlFor="professional-sector" className="block text-sm font-medium mb-2">
            Professional Sector
          </Label>
          <Select
            value={surveyData.demographics.professionalSector}
            onValueChange={(value) => updateSurveyData('demographics.professionalSector', value)}
          >
            <SelectTrigger className="w-full sm:w-[240px]">
              <SelectValue placeholder="Select sector" />
            </SelectTrigger>
            <SelectContent id="professional-sector">
              <SelectItem value="technology">Technology</SelectItem>
              <SelectItem value="healthcare">Healthcare</SelectItem>
              <SelectItem value="finance">Finance</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="manufacturing">Manufacturing</SelectItem>
              <SelectItem value="retail">Retail</SelectItem>
              <SelectItem value="government">Government</SelectItem>
              <SelectItem value="non-profit">Non-Profit</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographicsSection;
