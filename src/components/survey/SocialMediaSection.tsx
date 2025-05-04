
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SocialMediaPlatform, SocialMediaPurpose, SurveyResponse } from '@/types/survey';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

interface SocialMediaSectionProps {
  surveyData: SurveyResponse;
  updateSurveyData: (field: string, value: any) => void;
}

const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({ 
  surveyData, 
  updateSurveyData 
}) => {
  const isMobile = useIsMobile();
  
  if (!surveyData.socialMedia.usesSocialMedia) {
    return (
      <Card className="mb-4 sm:mb-6">
        <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
          <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
            Réseaux Sociaux
          </CardTitle>
        </CardHeader>
        <CardContent className={`${isMobile ? "px-3 py-3" : undefined}`}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Utilisez-vous les réseaux sociaux?
              </Label>
              <div className="flex space-x-4 mt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroup
                    value={surveyData.socialMedia.usesSocialMedia ? "yes" : "no"}
                    onValueChange={(value) => updateSurveyData('socialMedia.usesSocialMedia', value === "yes")}
                    className="flex space-x-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="yes" id="social-media-yes" />
                      <Label htmlFor="social-media-yes">Oui</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="no" id="social-media-no" />
                      <Label htmlFor="social-media-no">Non</Label>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Platform options with icons
  const platforms: {value: SocialMediaPlatform; label: string; icon: React.ReactNode}[] = [
    { value: 'facebook', label: 'Facebook', icon: <Facebook className="h-4 w-4 text-blue-600" /> },
    { value: 'instagram', label: 'Instagram', icon: <Instagram className="h-4 w-4 text-pink-500" /> },
    { value: 'twitter', label: 'Twitter', icon: <Twitter className="h-4 w-4 text-blue-400" /> },
    { value: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="h-4 w-4 text-blue-700" /> },
    { value: 'tiktok', label: 'TikTok', icon: null },
    { value: 'youtube', label: 'YouTube', icon: null },
    { value: 'other', label: 'Autre', icon: null },
  ];
  
  // Purpose options
  const purposes: {value: SocialMediaPurpose; label: string}[] = [
    { value: 'personal', label: 'Personnel' },
    { value: 'research', label: 'Recherche' },
    { value: 'professional', label: 'Professionnel' },
    { value: 'other', label: 'Autre' },
  ];
  
  const handlePlatformToggle = (platform: SocialMediaPlatform) => {
    const currentPlatforms = [...surveyData.socialMedia.platforms];
    if (currentPlatforms.includes(platform)) {
      updateSurveyData(
        'socialMedia.platforms', 
        currentPlatforms.filter(p => p !== platform)
      );
    } else {
      updateSurveyData('socialMedia.platforms', [...currentPlatforms, platform]);
    }
  };
  
  const handlePurposeToggle = (purpose: SocialMediaPurpose) => {
    const currentPurposes = [...surveyData.socialMedia.purpose];
    if (currentPurposes.includes(purpose)) {
      updateSurveyData(
        'socialMedia.purpose', 
        currentPurposes.filter(p => p !== purpose)
      );
    } else {
      updateSurveyData('socialMedia.purpose', [...currentPurposes, purpose]);
    }
  };
  
  const handleCompanyChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const companies = event.target.value.split(',').map(company => company.trim());
    updateSurveyData('socialMedia.knownCompanies', companies);
  };
  
  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader className={isMobile ? "px-3 py-3" : undefined}>
        <CardTitle className="text-lg sm:text-xl font-semibold text-survey-dark dark:text-gray-100">
          Réseaux Sociaux
        </CardTitle>
      </CardHeader>
      <CardContent className={`space-y-4 sm:space-y-6 ${isMobile ? "px-3 py-3" : undefined}`}>
        {/* Uses Social Media */}
        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Utilisez-vous les réseaux sociaux?
          </Label>
          <div className="flex space-x-4 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroup
                value={surveyData.socialMedia.usesSocialMedia ? "yes" : "no"}
                onValueChange={(value) => updateSurveyData('socialMedia.usesSocialMedia', value === "yes")}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="yes" id="social-media-yes" />
                  <Label htmlFor="social-media-yes">Oui</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="no" id="social-media-no" />
                  <Label htmlFor="social-media-no">Non</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        </div>
        
        {/* Platforms */}
        <div className="space-y-2">
          <Label className="text-sm font-medium block mb-2">
            Quels réseaux sociaux utilisez-vous? (Sélectionnez tous ceux que vous utilisez)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {platforms.map((platform) => (
              <div key={platform.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`platform-${platform.value}`}
                  checked={surveyData.socialMedia.platforms.includes(platform.value)}
                  onCheckedChange={() => handlePlatformToggle(platform.value)}
                />
                <Label htmlFor={`platform-${platform.value}`} className="flex items-center space-x-1">
                  {platform.icon && <span>{platform.icon}</span>}
                  <span>{platform.label}</span>
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Purpose */}
        <div className="space-y-2">
          <Label className="text-sm font-medium block mb-2">
            Quel est votre objectif principal en utilisant les réseaux sociaux? (Sélectionnez tous ceux qui s'appliquent)
          </Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {purposes.map((purpose) => (
              <div key={purpose.value} className="flex items-center space-x-2">
                <Checkbox 
                  id={`purpose-${purpose.value}`}
                  checked={surveyData.socialMedia.purpose.includes(purpose.value)}
                  onCheckedChange={() => handlePurposeToggle(purpose.value)}
                />
                <Label htmlFor={`purpose-${purpose.value}`}>{purpose.label}</Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Frequent Usage */}
        <div className="space-y-2">
          <Label htmlFor="frequent-usage" className="text-sm font-medium">
            Qu'utilisez-vous fréquemment sur les réseaux sociaux?
          </Label>
          <Input 
            id="frequent-usage" 
            value={surveyData.socialMedia.frequentUsage}
            onChange={(e) => updateSurveyData('socialMedia.frequentUsage', e.target.value)}
            placeholder="Ex: Regarder des vidéos, poster des photos, suivre l'actualité..."
          />
        </div>
        
        {/* Known Companies */}
        <div className="space-y-2">
          <Label htmlFor="known-companies" className="text-sm font-medium">
            Quelles sont les entreprises que vous connaissez à travers les réseaux sociaux? (Séparées par des virgules)
          </Label>
          <Input 
            id="known-companies" 
            value={surveyData.socialMedia.knownCompanies.join(', ')}
            onChange={handleCompanyChange}
            placeholder="Ex: Netflix, Coca-Cola, Adidas..."
          />
        </div>
        
        {/* Influencer Opinion */}
        <div className="space-y-2">
          <Label className="text-sm font-medium block">
            Pensez-vous que les influenceurs attirent les clients vers les entreprises?
          </Label>
          <RadioGroup
            value={surveyData.socialMedia.influencerOpinion}
            onValueChange={(value: any) => updateSurveyData('socialMedia.influencerOpinion', value)}
            className="space-y-2 mt-2"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="yes" id="influencer-yes" />
              <Label htmlFor="influencer-yes">Oui</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="probably" id="influencer-probably" />
              <Label htmlFor="influencer-probably">Probablement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="certainly-yes" id="influencer-certainly" />
              <Label htmlFor="influencer-certainly">Certainement</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="no" id="influencer-no" />
              <Label htmlFor="influencer-no">Non</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaSection;
