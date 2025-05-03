
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DemographicsSection from '@/components/survey/DemographicsSection';
import KnowledgeSection from '@/components/survey/KnowledgeSection';
import ThemeToggle from '@/components/ui/theme-toggle';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { emptySurveyResponse, SurveyResponse } from '@/types/survey';
import { RotateCcw, Send } from 'lucide-react';
import { 
  saveSurveyResponse, 
  getSurveyInProgress, 
  saveSurveyInProgress 
} from '@/lib/localStorage';

const Index = () => {
  // Initialize survey data state
  const [surveyData, setSurveyData] = useState<SurveyResponse>({
    ...emptySurveyResponse,
    id: uuidv4()
  });
  
  const [submitted, setSubmitted] = useState(false);
  
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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Add timestamp
    const completeResponse: SurveyResponse = {
      ...surveyData,
      submittedAt: new Date().toISOString()
    };
    
    // Save to localStorage
    saveSurveyResponse(completeResponse);
    
    // Update UI
    setSubmitted(true);
    
    toast.success("Sondage soumis avec succès! Merci pour votre participation.");
    
    console.log("Survey submitted:", completeResponse);
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-6 sm:px-6">
        {submitted ? (
          <Card className="max-w-2xl mx-auto mt-8">
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
            <div className="max-w-3xl mx-auto mb-6">
              <div className="flex flex-col items-center mb-4 relative">
                <div className="absolute top-0 right-0 z-10 mt-2 mr-2">
                  <ThemeToggle />
                </div>
                <div className="text-center mt-12 px-4 sm:mt-16">
                  <h1 className="text-xl sm:text-3xl font-bold text-center text-survey-dark dark:text-white mb-2">
                    Sondage Anonyme sur le Crédit d'Investissement
                  </h1>
                  <p className="text-center text-gray-600 dark:text-gray-400 text-sm sm:text-base mb-6">
                    Aidez-nous à comprendre les perspectives sur le crédit d'investissement sans partager d'informations personnelles
                  </p>
                </div>
              </div>
              
              <Alert className="mb-6 bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800">
                <AlertTitle className="text-blue-800 dark:text-blue-300 font-medium">Avis de confidentialité</AlertTitle>
                <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm">
                  Ce sondage est complètement anonyme. Aucune information personnelle identifiable n'est collectée.
                  Vos réponses sont stockées uniquement sur votre appareil et peuvent être effacées à tout moment.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleSubmit} className="px-2">
                <DemographicsSection 
                  surveyData={surveyData} 
                  updateSurveyData={updateSurveyData} 
                />
                
                <KnowledgeSection 
                  surveyData={surveyData} 
                  updateSurveyData={updateSurveyData} 
                />
                
                <div className="mt-6 flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleResetForm}
                    size="sm"
                    className="flex items-center gap-1 h-8 px-3 text-xs w-full sm:w-auto"
                  >
                    <RotateCcw className="h-3 w-3" />
                    Reset
                  </Button>
                  
                  <Button 
                    type="submit" 
                    className="bg-survey-primary hover:bg-survey-highlight text-white flex items-center gap-2 px-6 py-2 w-full sm:w-auto"
                  >
                    <Send className="h-4 w-4" />
                    Soumettre le sondage
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
