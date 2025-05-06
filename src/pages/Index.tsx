
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DemographicsSection from '@/components/survey/DemographicsSection';
import SocialMediaSection from '@/components/survey/SocialMediaSection';
import InfluencerRelationsSection from '@/components/survey/InfluencerRelationsSection';
import EngagementSection from '@/components/survey/EngagementSection';
import PurchaseIntentionSection from '@/components/survey/PurchaseIntentionSection';
import GlobalAppreciationSection from '@/components/survey/GlobalAppreciationSection';
import ThankYouMessage from '@/components/survey/ThankYouMessage';
import ThemeToggle from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { emptySurveyResponse, SurveyResponse } from '@/types/survey';
import { useIsMobile } from '@/hooks/use-mobile';
import { RotateCcw, Send } from 'lucide-react';
import { 
  saveSurveyResponse, 
  getSurveyInProgress, 
  saveSurveyInProgress 
} from '@/lib/localStorage';

const Index = () => {
  const isMobile = useIsMobile();
  
  // Initialize survey data state
  const [surveyData, setSurveyData] = useState<SurveyResponse>({
    ...emptySurveyResponse,
    id: uuidv4()
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Load any in-progress survey data on mount
  useEffect(() => {
    // Skip if running on the server
    if (typeof window === 'undefined') return;
    
    try {
      const savedData = getSurveyInProgress();
      if (savedData) {
        console.log("Loaded in-progress survey data:", savedData);
        
        // Merge saved data with empty template to ensure all fields exist
        setSurveyData({
          ...emptySurveyResponse,
          ...savedData,
          id: savedData.id || uuidv4() // Use existing ID or generate new one
        });
      }
    } catch (error) {
      console.error("Error loading in-progress survey data:", error);
    }
  }, []);
  
  // Save survey data to localStorage whenever it changes
  useEffect(() => {
    // Skip if running on the server
    if (typeof window === 'undefined') return;
    
    // Don't save if we're in the submitted state
    if (!submitted) {
      saveSurveyInProgress(surveyData);
      console.log("Saved in-progress survey data");
    }
  }, [surveyData, submitted]);
  
  // Update survey data handler - supports nested properties with dot notation
  const updateSurveyData = (field: string, value: any) => {
    setSurveyData(prevData => {
      // Handle nested properties using dot notation (e.g., 'demographics.ageGroup')
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        return {
          ...prevData,
          [parent]: {
            ...(prevData as any)[parent],
            [child]: value
          }
        };
      }
      
      // Handle top-level properties
      return {
        ...prevData,
        [field]: value
      };
    });
  };
  
  // Handle survey submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setIsSubmitting(true);
    
    try {
      // Add timestamp
      const completeResponse: SurveyResponse = {
        ...surveyData,
        submittedAt: new Date().toISOString()
      };
      
      // Save to Supabase (with localStorage fallback)
      await saveSurveyResponse(completeResponse);
      
      // Update UI
      setSubmitted(true);
      toast.success("Sondage soumis avec succès! Merci pour votre participation.");
      
      console.log("Survey submitted:", completeResponse);
    } catch (error) {
      console.error("Error submitting survey:", error);
      toast.error("Une erreur s'est produite lors de la soumission du sondage. Veuillez réessayer.");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Start a new survey
  const handleStartNewSurvey = () => {
    setSurveyData({
      ...emptySurveyResponse,
      id: uuidv4()
    });
    setSubmitted(false);
  };
  
  // Reset the form
  const handleResetForm = () => {
    if (window.confirm("Êtes-vous sûr de vouloir réinitialiser le formulaire ? Toutes les données saisies seront perdues.")) {
      setSurveyData({
        ...emptySurveyResponse,
        id: uuidv4()
      });
      toast.info("Formulaire réinitialisé");
    }
  };

  // Determine if we should show the full form
  const shouldShowThankYouMessage = !surveyData.socialMedia.usesSocialMedia || !surveyData.influencerRelations?.followsInfluencers;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-3 sm:px-6 py-4 sm:py-6">
        {submitted ? (
          <Card className="max-w-2xl mx-auto mt-4 sm:mt-8">
            <CardHeader>
              <CardTitle>Merci pour votre participation!</CardTitle>
              <CardDescription>
                Votre réponse a été enregistrée de manière anonyme.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Vos commentaires nous aideront à comprendre les perspectives sur le crédit d'investissement
                sans collecter aucune information personnelle identifiable.
              </p>
              <Button onClick={handleStartNewSurvey}>
                Commencer un autre sondage
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="max-w-3xl mx-auto mb-4 sm:mb-6">
              <div className="flex flex-col items-center mb-4 relative">
                <div className="absolute top-0 right-0 z-10 mt-2 mr-2">
                  <ThemeToggle />
                </div>
                <div className="text-center mt-8 sm:mt-12 px-2 sm:px-4">
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-center text-survey-dark dark:text-white mb-2 break-words">
                    L'impact du marketing d'influence sur le comportement des consommateurs sur réseaux sociaux
                  </h1>
                  <p className="text-center text-gray-600 dark:text-gray-400 text-xs sm:text-sm mb-4 sm:mb-6">
                    Aidez-nous à comprendre les perspectives sur le marketing d'influence sans partager d'informations personnelles
                  </p>
                </div>
              </div>
              
              <Alert className="mb-4 sm:mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <AlertTitle className="text-blue-800 dark:text-blue-300 font-medium">Avis de confidentialité</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400 text-xs sm:text-sm">
                  Ce sondage est complètement anonyme. Aucune information personnelle identifiable n'est collectée.
                  Vos réponses sont stockées uniquement sur votre appareil et peuvent être effacées à tout moment.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleSubmit} className="px-1 sm:px-2">
                <DemographicsSection 
                  surveyData={surveyData} 
                  updateSurveyData={updateSurveyData} 
                />
                
                <SocialMediaSection
                  surveyData={surveyData}
                  updateSurveyData={updateSurveyData}
                />
                
                <InfluencerRelationsSection
                  surveyData={surveyData}
                  updateSurveyData={updateSurveyData}
                />
                
                <EngagementSection
                  surveyData={surveyData}
                  updateSurveyData={updateSurveyData}
                />
                
                <PurchaseIntentionSection
                  surveyData={surveyData}
                  updateSurveyData={updateSurveyData}
                />
                
                <GlobalAppreciationSection
                  surveyData={surveyData}
                  updateSurveyData={updateSurveyData}
                />
                
                {shouldShowThankYouMessage && (
                  <ThankYouMessage />
                )}
                
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleResetForm}
                    size="sm"
                    className="flex items-center gap-1 h-8 px-3 text-xs w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="bg-survey-primary hover:bg-survey-highlight text-white flex items-center gap-2 px-4 py-2 w-full sm:w-auto"
                    disabled={isSubmitting}
                  >
                    <Send className="h-4 w-4" />
                    {isSubmitting ? "Soumission en cours..." : "Soumettre le sondage"}
                  </Button>
                </div>
              </form>
            </div>
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
