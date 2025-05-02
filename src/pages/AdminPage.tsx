
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilterControls from '@/components/admin/FilterControls';
import ResponseStats from '@/components/admin/ResponseStats';
import { 
  getAllSurveyResponses, 
  clearAllSurveyData,
  exportSurveyDataAsJSON,
  exportSurveyDataAsCSV,
  saveSurveyResponse
} from '@/lib/localStorage';
import { SurveyResponse, emptySurveyResponse } from '@/types/survey';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

// Fonction pour générer des données aléatoires
const generateDummyData = (count = 10) => {
  const genders = ['male', 'female'];
  const ageGroups = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const educationLevels = ['high-school', 'some-college', 'bachelors', 'masters', 'doctorate', 'other'];
  const sectors = ['technology', 'healthcare', 'finance', 'education', 'manufacturing', 'retail', 'government', 'non-profit', 'other'];
  const knowledgeLevels = ['none', 'basic', 'intermediate', 'advanced', 'expert'];
  const frequencies = ['never', 'rarely', 'occasionally', 'frequently', 'regularly'];
  const riskTolerances = ['very-low', 'low', 'moderate', 'high', 'very-high'];
  const investmentTypes = ['stocks', 'bonds', 'mutual-funds', 'etfs', 'real-estate', 'crypto', 'retirement', 'commodities'];
  const investmentGoals = ['retirement', 'wealth-preservation', 'passive-income', 'capital-growth', 'financial-security'];
  
  const getRandomElement = (array: any[]) => array[Math.floor(Math.random() * array.length)];
  const getRandomMultiple = (array: any[], min = 1, max = 3) => {
    const count = Math.floor(Math.random() * (max - min + 1)) + min;
    const result = [];
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    for (let i = 0; i < count && i < shuffled.length; i++) {
      result.push(shuffled[i]);
    }
    return result;
  };
  
  const dummyData: SurveyResponse[] = [];
  
  for (let i = 0; i < count; i++) {
    const datePast = new Date();
    datePast.setDate(datePast.getDate() - Math.random() * 30); // Date aléatoire dans les 30 derniers jours
    
    const response: SurveyResponse = {
      ...emptySurveyResponse,
      id: uuidv4(),
      submittedAt: datePast.toISOString(),
      demographics: {
        gender: getRandomElement(genders),
        ageGroup: getRandomElement(ageGroups),
        educationLevel: getRandomElement(educationLevels),
        professionalSector: getRandomElement(sectors)
      },
      investmentKnowledge: {
        selfRatedKnowledge: getRandomElement(knowledgeLevels),
        previousExperience: Math.random() > 0.5,
        frequencyOfInvestment: getRandomElement(frequencies),
        preferredInvestmentTypes: getRandomMultiple(investmentTypes)
      },
      opinions: {
        riskTolerance: getRandomElement(riskTolerances),
        importantFeatures: getRandomMultiple(['low-interest', 'flexibility', 'tax-benefits', 'ease-of-access', 'low-fees']),
        preferredInvestmentGoals: getRandomMultiple(investmentGoals),
        willRecommend: Math.floor(Math.random() * 11) // 0-10
      }
    };
    
    dummyData.push(response);
  }
  
  return dummyData;
};

const AdminPage = () => {
  // États pour les données et les filtres
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const [authenticated, setAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const correctPin = '223344';
  
  // État pour les filtres
  const [filters, setFilters] = useState({
    gender: null as string | null,
    ageGroup: null as string | null,
    educationLevel: null as string | null,
    professionalSector: null as string | null
  });
  
  // Charger les réponses au montage (si authentifié)
  useEffect(() => {
    if (authenticated) {
      loadResponses();
    }
  }, [authenticated]);
  
  // Vérifier le PIN
  const verifyPin = () => {
    if (pin === correctPin) {
      setAuthenticated(true);
      toast.success("Authentification réussie");
    } else {
      toast.error("PIN incorrect");
    }
  };
  
  // Charger toutes les réponses depuis localStorage
  const loadResponses = () => {
    try {
      let loadedResponses = getAllSurveyResponses();
      
      // Si aucune réponse n'est trouvée, générer des données de démonstration
      if (loadedResponses.length === 0) {
        loadedResponses = generateDummyData(10);
        
        // Enregistrer les données de démonstration
        loadedResponses.forEach(response => {
          saveSurveyResponse(response);
        });
        
        toast.success(`10 réponses de démonstration générées`);
      } else {
        toast.success(`${loadedResponses.length} réponses au sondage chargées`);
      }
      
      setResponses(loadedResponses);
    } catch (error) {
      console.error("Erreur lors du chargement des réponses au sondage:", error);
      toast.error("Erreur lors du chargement des données du sondage");
    }
  };
  
  // Gérer les changements de filtre
  const handleFilterChange = (filterName: string, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Réinitialiser tous les filtres
  const handleResetFilters = () => {
    setFilters({
      gender: null,
      ageGroup: null,
      educationLevel: null,
      professionalSector: null
    });
    toast("Filtres réinitialisés");
  };
  
  // Réinitialiser toutes les données
  const handleResetData = () => {
    // Confirmer avant de supprimer toutes les données
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les données du sondage ? Cette action ne peut pas être annulée.")) {
      clearAllSurveyData();
      setResponses([]);
      toast.success("Toutes les données du sondage ont été effacées");
    }
  };
  
  // Exporter les données
  const handleExportData = (format: 'json' | 'csv') => {
    try {
      let exportData: string;
      let fileName: string;
      let mimeType: string;
      
      if (format === 'json') {
        exportData = exportSurveyDataAsJSON();
        fileName = `donnees-sondage-${new Date().toISOString().slice(0, 10)}.json`;
        mimeType = 'application/json';
      } else {
        exportData = exportSurveyDataAsCSV();
        fileName = `donnees-sondage-${new Date().toISOString().slice(0, 10)}.csv`;
        mimeType = 'text/csv';
      }
      
      // Créer un lien de téléchargement
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Nettoyage
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success(`Données exportées en ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Erreur lors de l'exportation des données au format ${format}:`, error);
      toast.error(`Erreur lors de l'exportation des données au format ${format}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <Header isAdmin />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-survey-dark dark:text-white mb-2">
            Tableau de Bord Administrateur du Sondage
          </h1>
          <p className="text-center text-gray-600 dark:text-gray-400">
            Visualiser et analyser les réponses anonymes au sondage
          </p>
        </div>
        
        {!authenticated ? (
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Authentification requise</CardTitle>
              <CardDescription>Veuillez saisir le code PIN pour accéder au tableau de bord administrateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pin">Code PIN (6 chiffres)</Label>
                <Input 
                  id="pin" 
                  type="password" 
                  value={pin} 
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Entrez le code PIN"
                  maxLength={6}
                  className="text-center text-xl tracking-widest"
                />
              </div>
              <Button 
                onClick={verifyPin} 
                className="w-full"
              >
                Accéder au tableau de bord
              </Button>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Contrôles de Filtrage et d'Exportation */}
            <FilterControls 
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              onResetData={handleResetData}
              onExportData={handleExportData}
              filters={filters}
              responseCount={responses.length}
            />
            
            {/* Statistiques des Réponses */}
            {responses.length === 0 ? (
              <div className="bg-white dark:bg-gray-800 p-6 rounded-md shadow-sm text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-3">Aucune réponse au sondage disponible.</p>
                <p className="text-gray-500 dark:text-gray-500">Demandez aux participants de compléter le sondage pour voir les résultats ici.</p>
              </div>
            ) : (
              <ResponseStats 
                responses={responses}
                filters={filters}
              />
            )}
          </>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
