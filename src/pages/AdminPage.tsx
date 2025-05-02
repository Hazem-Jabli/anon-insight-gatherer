
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
  // State for storing survey responses
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  
  // State for filters
  const [filters, setFilters] = useState({
    gender: null as string | null,
    ageGroup: null as string | null,
    educationLevel: null as string | null
  });
  
  // Load responses on mount
  useEffect(() => {
    // Skip if running on server
    if (typeof window === 'undefined') return;
    
    loadResponses();
  }, []);
  
  // Load all responses from localStorage
  const loadResponses = () => {
    try {
      const loadedResponses = getAllSurveyResponses();
      setResponses(loadedResponses);
      
      if (loadedResponses.length === 0) {
        toast("No survey responses found", {
          description: "Waiting for responses to be submitted"
        });
      } else {
        toast.success(`${loadedResponses.length} survey responses loaded`);
      }
    } catch (error) {
      console.error("Error loading survey responses:", error);
      toast.error("Error loading survey data");
    }
  };
  
  // Handle filter changes
  const handleFilterChange = (filterName: string, value: string | null) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };
  
  // Reset all filters
  const handleResetFilters = () => {
    setFilters({
      gender: null,
      ageGroup: null,
      educationLevel: null
    });
    toast("Filters reset");
  };
  
  // Reset all data
  const handleResetData = () => {
    // Confirm before deleting all data
    if (window.confirm("Are you sure you want to delete all survey data? This action cannot be undone.")) {
      clearAllSurveyData();
      setResponses([]);
      toast.success("All survey data has been cleared");
    }
  };
  
  // Export data
  const handleExportData = (format: 'json' | 'csv') => {
    try {
      let exportData: string;
      let fileName: string;
      let mimeType: string;
      
      if (format === 'json') {
        exportData = exportSurveyDataAsJSON();
        fileName = `survey-data-${new Date().toISOString().slice(0, 10)}.json`;
        mimeType = 'application/json';
      } else {
        exportData = exportSurveyDataAsCSV();
        fileName = `survey-data-${new Date().toISOString().slice(0, 10)}.csv`;
        mimeType = 'text/csv';
      }
      
      // Create download link
      const blob = new Blob([exportData], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      
      // Clean up
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 0);
      
      toast.success(`Data exported as ${format.toUpperCase()}`);
    } catch (error) {
      console.error(`Error exporting data as ${format}:`, error);
      toast.error(`Error exporting data as ${format}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header isAdmin />
      
      <main className="flex-grow container mx-auto p-4 sm:p-6">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-center text-survey-dark mb-2">
            Survey Admin Dashboard
          </h1>
          <p className="text-center text-gray-600">
            View and analyze anonymous survey responses
          </p>
        </div>
        
        {/* Filter and Export Controls */}
        <FilterControls 
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onResetData={handleResetData}
          onExportData={handleExportData}
          filters={filters}
          responseCount={responses.length}
        />
        
        {/* Response Statistics */}
        {responses.length === 0 ? (
          <div className="bg-white p-6 rounded-md shadow-sm text-center">
            <p className="text-gray-600 mb-3">No survey responses available.</p>
            <p className="text-gray-500">Ask participants to complete the survey to see results here.</p>
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
