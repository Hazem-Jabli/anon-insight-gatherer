import React, { useState, useEffect } from 'react';
import {
  getSurveyResponses,
  clearSurveyResponses,
} from '@/lib/localStorage';
import { SurveyResponse } from '@/types/survey';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const AdminPage = () => {
  const [responses, setResponses] = useState<SurveyResponse[]>([]);

  useEffect(() => {
    const storedResponses = getSurveyResponses();
    setResponses(storedResponses);
  }, []);

  const handleClearResponses = () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer toutes les réponses du sondage ? Cette action est irréversible.")) {
      clearSurveyResponses();
      setResponses([]);
      alert("Toutes les réponses du sondage ont été supprimées.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Page d'administration du sondage</h1>
      
      <div className="mb-4">
        <Label>Nombre total de réponses: {responses.length}</Label>
      </div>

      <Button onClick={handleClearResponses} variant="destructive">
        Effacer toutes les réponses
      </Button>

      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-2">Réponses au sondage</h2>
        {responses.length === 0 ? (
          <p>Aucune réponse au sondage n'a été trouvée.</p>
        ) : (
          <ul>
            {responses.map((response, index) => (
              <li key={index} className="border p-4 mb-4 rounded">
                <h3 className="font-bold">Réponse #{index + 1}</h3>
                <pre>{JSON.stringify(response, null, 2)}</pre>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
