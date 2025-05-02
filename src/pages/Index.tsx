
import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import DemographicsSection from '@/components/survey/DemographicsSection';
import KnowledgeSection from '@/components/survey/KnowledgeSection';
import OpinionsSection from '@/components/survey/OpinionsSection';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { emptySurveyResponse, SurveyResponse } from '@/types/survey';
import { 
  saveSurveyResponse, 
  getSurveyInProgress, 
  saveSurveyInProgress 
} from '@/lib/localStorage';
import { set } from 'date-fns';

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
      // Handle nested properties using dot notation (e.g., 'demographics.gender')
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
    
    toast.success("Survey submitted successfully! Thank you for your participation.");
    
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

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        {submitted ? (
          <Card className="max-w-2xl mx-auto mt-8">
            <CardHeader>
              <CardTitle>Thank You for Your Participation!</CardTitle>
              <CardDescription>
                Your response has been recorded anonymously.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Your feedback will help us understand perspectives on investment credit
                without collecting any personally identifiable information.
              </p>
              <Button onClick={handleStartNewSurvey}>
                Start Another Survey
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="max-w-3xl mx-auto mb-6">
              <h1 className="text-3xl font-bold text-center text-survey-dark mb-2">
                Anonymous Investment Credit Survey
              </h1>
              <p className="text-center text-gray-600 mb-6">
                Help us understand perspectives on investment credit without sharing any personal information
              </p>
              
              <Alert className="mb-6">
                <AlertTitle>Privacy Notice</AlertTitle>
                <AlertDescription>
                  This survey is completely anonymous. No personal identifying information is collected.
                  Your responses are stored only on your device and can be cleared at any time.
                </AlertDescription>
              </Alert>
              
              <form onSubmit={handleSubmit}>
                <DemographicsSection 
                  surveyData={surveyData} 
                  updateSurveyData={updateSurveyData} 
                />
                
                <KnowledgeSection 
                  surveyData={surveyData} 
                  updateSurveyData={updateSurveyData} 
                />
                
                <OpinionsSection 
                  surveyData={surveyData} 
                  updateSurveyData={updateSurveyData} 
                />
                
                <div className="mt-6 flex justify-center">
                  <Button 
                    type="submit" 
                    size="lg"
                    className="bg-survey-primary hover:bg-survey-highlight text-white"
                  >
                    Submit Survey
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
