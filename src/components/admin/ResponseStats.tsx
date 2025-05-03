
// src/components/admin/ResponseStats.tsx
import React from 'react';
import { SurveyResponse } from '@/types/survey';

interface ResponseStatsProps {
  responses: SurveyResponse[];
}

const ResponseStats: React.FC<ResponseStatsProps> = ({ responses }) => {
  // Calculate average age (using the age groups as numerical values for estimation)
  const ageMapping: { [key: string]: number } = {
    '18-24': 21,
    '25-34': 29.5,
    '35-44': 39.5,
    '45-54': 49.5,
    '55-64': 59.5,
    '65+': 70,
  };
  
  const totalAgeEstimate = responses.reduce((sum, response) => {
    const ageGroup = response.demographics?.ageGroup || '';
    return sum + (ageMapping[ageGroup] || 0);
  }, 0);
  const averageAge = responses.length > 0 ? totalAgeEstimate / responses.length : 0;

  // Count education level distribution
  const educationCounts = responses.reduce((counts, response) => {
    const education = response.demographics?.educationLevel || 'Unknown';
    counts[education] = (counts[education] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  // Count professional sector distribution
  const sectorCounts = responses.reduce((counts, response) => {
    const sector = response.demographics?.professionalSector || 'Unknown';
    counts[sector] = (counts[sector] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Statistiques des Réponses</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Demographics Stats */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Démographiques</h3>
          <p>Âge Moyen Estimé: {averageAge.toFixed(2)}</p>
          <p>Distribution par Niveau d'Éducation:</p>
          <ul>
            {Object.entries(educationCounts).map(([education, count]) => (
              <li key={education}>{education}: {count}</li>
            ))}
          </ul>
        </div>

        {/* Professional Sector Stats */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Secteurs Professionnels</h3>
          <ul>
            {Object.entries(sectorCounts).map(([sector, count]) => (
              <li key={sector}>{sector}: {count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResponseStats;
