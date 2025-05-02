
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
import ResponseStats from "@/components/admin/ResponseStats";
import FilterControls from "@/components/admin/FilterControls";
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { generateDummyData } from "@/lib/dummyData";

const ADMIN_PIN = "223344";

const AdminPage = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [filteredResponses, setFilteredResponses] = useState<SurveyResponse[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");
  
  const [filters, setFilters] = useState({
    ageGroup: null as string | null,
    educationLevel: null as string | null,
    gender: null as string | null,
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
    
    if (filters.gender) {
      result = result.filter(r => r.demographics?.gender === filters.gender);
    }
    
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
      gender: null,
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
      // Simple CSV export (would need more robust handling for complex nested data)
      const headers = ["id", "submittedAt", "gender", "ageGroup", "educationLevel", "professionalSector"];
      const csvData = responses.map(r => [
        r.id,
        r.submittedAt,
        r.demographics?.gender || '',
        r.demographics?.ageGroup || '',
        r.demographics?.educationLevel || '',
        r.demographics?.professionalSector || '',
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
        <h1 className="text-3xl font-bold mb-6">Page d'administration du sondage</h1>
        
        <div className="mb-4">
          <Label>Nombre total de réponses: {responses.length}</Label>
          <Label className="ml-4">Réponses filtrées: {filteredResponses.length}</Label>
        </div>

        <FilterControls 
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onResetData={handleClearResponses}
          onExportData={handleExportData}
          filters={filters}
          responseCount={responses.length}
        />

        {filteredResponses.length > 0 && (
          <ResponseStats responses={filteredResponses} />
        )}

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-2">Réponses au sondage</h2>
          {filteredResponses.length === 0 ? (
            <p>Aucune réponse au sondage n'a été trouvée.</p>
          ) : (
            <ul>
              {filteredResponses.map((response, index) => (
                <li key={index} className="border p-4 mb-4 rounded">
                  <h3 className="font-bold">Réponse #{index + 1}</h3>
                  <pre className="overflow-x-auto whitespace-pre-wrap">{JSON.stringify(response, null, 2)}</pre>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
