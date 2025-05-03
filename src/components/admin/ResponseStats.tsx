
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

  // Calculate average investment knowledge from self-rated knowledge
  const totalInvestmentKnowledge = responses.reduce((sum, response) => {
    // Convert string ratings to numbers (1-5 scale)
    const ratingMap: { [key: string]: number } = {
      'none': 1,
      'basic': 2,
      'intermediate': 3,
      'advanced': 4,
      'expert': 5
    };
    const rating = response.investmentKnowledge?.selfRatedKnowledge || '';
    return sum + (ratingMap[rating] || 0);
  }, 0);
  const averageInvestmentKnowledge = responses.length > 0 ? totalInvestmentKnowledge / responses.length : 0;

  // Aggregate preferred investment types
  const investmentTypeCounts = responses.reduce((counts, response) => {
    const investmentTypes = response.investmentKnowledge?.preferredInvestmentTypes || [];
    investmentTypes.forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });
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

        {/* Knowledge Stats */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Connaissances</h3>
          <p>Niveau Moyen de Connaissance en Investissement: {averageInvestmentKnowledge.toFixed(2)}</p>
          <p>Types d'Investissement Préférés:</p>
          <ul>
            {Object.entries(investmentTypeCounts).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResponseStats;
