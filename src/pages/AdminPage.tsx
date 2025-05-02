
import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FilterControls from '@/components/admin/FilterControls';
import ResponseStats from '@/components/admin/ResponseStats';
import { 
  getAllSurveyResponses, 
  clearAllSurveyData,
  exportSurveyDataAsJSON,
  exportSurveyDataAsCSV
} from '@/lib/localStorage';
import { SurveyResponse } from '@/types/survey';

const AdminPage = () => {
  // État pour stocker les réponses au sondage
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  
  // État pour les filtres
  const [filters, setFilters] = useState({
    gender: null as string | null,
    ageGroup: null as string | null,
    educationLevel: null as string | null
  });
  
  // Charger les réponses au montage
  useEffect(() => {
    // Ignorer si exécuté sur le serveur
    if (typeof window === 'undefined') return;
    
    loadResponses();
  }, []);
  
  // Charger toutes les réponses depuis localStorage
  const loadResponses = () => {
    try {
      const loadedResponses = getAllSurveyResponses();
      setResponses(loadedResponses);
      
      if (loadedResponses.length === 0) {
        toast("Aucune réponse au sondage trouvée", {
          description: "En attente de soumission de réponses"
        });
      } else {
        toast.success(`${loadedResponses.length} réponses au sondage chargées`);
      }
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
      educationLevel: null
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
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminPage;
