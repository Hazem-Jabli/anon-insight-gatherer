
import React, { useState, useEffect } from 'react';
import {
  getAllSurveyResponses,
  clearAllSurveyData,
} from '@/lib/localStorage';
import { SurveyResponse } from '@/types/survey';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from '@/components/ui/scroll-area';
import ResponseStats from "@/components/admin/ResponseStats";
import FilterControls from "@/components/admin/FilterControls";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { generateDummyData } from "@/lib/dummyData";
import { useIsMobile } from '@/hooks/use-mobile';

const ADMIN_PIN = "223344";

const AdminPage = () => {
  const isMobile = useIsMobile();
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  const [showResponses, setShowResponses] = useState(false);
  
  const [filters, setFilters] = useState({
    ageGroup: null as string | null,
    educationLevel: null as string | null,
    professionalSector: null as string | null
  });

  useEffect(() => {
    const storedResponses = getAllSurveyResponses();
    
    // Add dummy data if no responses exist
    if (storedResponses.length === 0) {
      const dummyData = generateDummyData(10);
      setResponses(dummyData);
      setFilteredResponses(dummyData);
    } else {
      setResponses(storedResponses);
      setFilteredResponses(storedResponses);
    }
  }, []);

  useEffect(() => {
    applyFilters();
  }, [filters, responses]);

  const handleLogin = () => {
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      setPinError("");
    } else {
      setPinError("Code PIN incorrect, veuillez réessayer.");
    }
  }

  const applyFilters = () => {
    let result = [...responses];
    
    if (filters.ageGroup) {
      result = result.filter(r => r.demographics?.ageGroup === filters.ageGroup);
    }
    
    if (filters.educationLevel) {
      result = result.filter(r => r.demographics?.educationLevel === filters.educationLevel);
    }
    
    if (filters.professionalSector) {
      result = result.filter(r => r.demographics?.professionalSector === filters.professionalSector);
    }
    
    setFilteredResponses(result);
  };

  const handleFilterChange = (filter: string, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filter]: value
    }));
  };

  const handleResetFilters = () => {
    setFilters({
      ageGroup: null,
      educationLevel: null,
      professionalSector: null
    });
  };

  const handleClearResponses = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les réponses du sondage ? Cette action est irréversible.")) {
      clearAllSurveyData();
      setResponses([]);
      setFilteredResponses([]);
      alert("Toutes les réponses du sondage ont été supprimées.");
    }
  };

  const handleExportData = (format: 'json' | 'csv') => {
    if (responses.length === 0) {
      alert("Aucune donnée à exporter.");
      return;
    }

    let dataStr = '';
    let filename = '';

    if (format === 'json') {
      dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(responses, null, 2));
      filename = "survey_responses.json";
    } else if (format === 'csv') {
      // Simple CSV export
      const headers = ["id", "submittedAt", "ageGroup", "educationLevel", "professionalSector", "usesSocialMedia", "platforms", "purpose"];
      const csvData = responses.map(r => [
        r.id,
        r.submittedAt,
        r.demographics?.ageGroup || '',
        r.demographics?.educationLevel || '',
        r.demographics?.professionalSector || '',
        r.socialMedia?.usesSocialMedia ? 'Oui' : 'Non',
        r.socialMedia?.platforms ? r.socialMedia.platforms.join(';') : '',
        r.socialMedia?.purpose ? r.socialMedia.purpose.join(';') : '',
      ]);
      
      dataStr = "data:text/csv;charset=utf-8," + encodeURIComponent([headers.join(','), ...csvData.map(row => row.join(','))].join('\n'));
      filename = "survey_responses.csv";
    }

    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", filename);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
        <Header isAdmin={true} />
        <main className="flex-grow container mx-auto p-4 sm:p-6 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Authentification Admin</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pin">Code PIN</Label>
                  <Input
                    id="pin"
                    type="password"
                    placeholder="Entrez le code PIN à 6 chiffres"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                  {pinError && <p className="text-red-500 text-sm">{pinError}</p>}
                </div>
                <Button onClick={handleLogin} className="w-full">
                  Se connecter
                </Button>
              </div>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header isAdmin={true} />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Page d'administration du sondage</h1>
        
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center justify-between">
          <div>
            <Label className="block mb-2 sm:mb-0 sm:inline-block sm:mr-4">Nombre total de réponses: {responses.length}</Label>
            <Label>Réponses filtrées: {filteredResponses.length}</Label>
          </div>
          
          <Button 
            variant="outline"
            className="mt-2 sm:mt-0" 
            onClick={() => setShowResponses(!showResponses)}
          >
            {showResponses ? "Masquer les réponses" : "Afficher les réponses"}
          </Button>
        </div>

        <div className="mb-6">
          <FilterControls 
            onFilterChange={handleFilterChange}
            onResetFilters={handleResetFilters}
            onResetData={handleClearResponses}
            onExportData={handleExportData}
            filters={filters}
            responseCount={responses.length}
          />
        </div>

        {filteredResponses.length > 0 && (
          <div className={isMobile ? "mb-6" : ""}>
            <ResponseStats responses={filteredResponses} />
          </div>
        )}

        {showResponses && (
          <div className="mt-8">
            <h2 className="text-xl sm:text-2xl font-bold mb-2">Réponses au sondage</h2>
            {filteredResponses.length === 0 ? (
              <p>Aucune réponse au sondage n'a été trouvée.</p>
            ) : (
              <ScrollArea className={isMobile ? "h-[400px]" : "h-auto"}>
                <ul className="space-y-4">
                  {filteredResponses.map((response, index) => (
                    <li key={index} className="border p-4 rounded">
                      <h3 className="font-bold mb-2">Réponse #{index + 1}</h3>
                      <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded overflow-x-auto">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-semibold">Date:</p> 
                            <p>{new Date(response.submittedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Groupe d'âge:</p>
                            <p>{response.demographics.ageGroup}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Niveau d'éducation:</p>
                            <p>{response.demographics.educationLevel}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Secteur professionnel:</p>
                            <p>{response.demographics.professionalSector}</p>
                          </div>
                          <div>
                            <p className="font-semibold">Utilise les réseaux sociaux:</p>
                            <p>{response.socialMedia?.usesSocialMedia ? 'Oui' : 'Non'}</p>
                          </div>
                          {response.socialMedia?.usesSocialMedia && (
                            <>
                              <div>
                                <p className="font-semibold">Plateformes:</p>
                                <p>{response.socialMedia.platforms.join(', ') || 'Non spécifié'}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Utilisation:</p>
                                <p>{response.socialMedia.purpose.join(', ') || 'Non spécifié'}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="font-semibold">Usage fréquent:</p>
                                <p>{response.socialMedia.frequentUsage || 'Non spécifié'}</p>
                              </div>
                              <div className="md:col-span-2">
                                <p className="font-semibold">Entreprises connues:</p>
                                <p>{response.socialMedia.knownCompanies?.join(', ') || 'Aucune'}</p>
                              </div>
                              <div>
                                <p className="font-semibold">Opinion sur les influenceurs:</p>
                                <p>{response.socialMedia.influencerOpinion}</p>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </ScrollArea>
            )}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
