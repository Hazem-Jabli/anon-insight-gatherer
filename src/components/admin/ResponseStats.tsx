// src/components/admin/ResponseStats.tsx
import React from 'react';
import { SurveyResponse } from '@/types/survey';

interface ResponseStatsProps {
  responses: SurveyResponse[];
}

const ResponseStats: React.FC<ResponseStatsProps> = ({ responses }) => {
  // Calculate average age
  const totalAge = responses.reduce((sum, response) => sum + (response.demographics?.age || 0), 0);
  const averageAge = responses.length > 0 ? totalAge / responses.length : 0;

  // Count gender distribution
  const genderCounts = responses.reduce((counts, response) => {
    const gender = response.demographics?.gender || 'Unknown';
    counts[gender] = (counts[gender] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  // Count education level distribution
  const educationCounts = responses.reduce((counts, response) => {
    const education = response.demographics?.education || 'Unknown';
    counts[education] = (counts[education] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  // Calculate average investment knowledge
  const totalInvestmentKnowledge = responses.reduce((sum, response) => sum + (response.knowledge?.investmentKnowledge || 0), 0);
  const averageInvestmentKnowledge = responses.length > 0 ? totalInvestmentKnowledge / responses.length : 0;

  // Aggregate preferred investment types
  const investmentTypeCounts = responses.reduce((counts, response) => {
    const investmentTypes = response.opinions?.preferredInvestmentTypes || [];
    investmentTypes.forEach(type => {
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, {} as { [key: string]: number });

  // Aggregate preferred information sources
  const informationSourceCounts = responses.reduce((counts, response) => {
    const sources = response.opinions?.informationSources || [];
    sources.forEach(source => {
      counts[source] = (counts[source] || 0) + 1;
    });
    return counts;
  }, {} as { [key: string]: number });

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Response Statistics</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Demographics Stats */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Demographics</h3>
          <p>Average Age: {averageAge.toFixed(2)}</p>
          <p>Gender Distribution:</p>
          <ul>
            {Object.entries(genderCounts).map(([gender, count]) => (
              <li key={gender}>{gender}: {count}</li>
            ))}
          </ul>
          <p>Education Level Distribution:</p>
          <ul>
            {Object.entries(educationCounts).map(([education, count]) => (
              <li key={education}>{education}: {count}</li>
            ))}
          </ul>
        </div>

        {/* Knowledge Stats */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Knowledge</h3>
          <p>Average Investment Knowledge: {averageInvestmentKnowledge.toFixed(2)}</p>
        </div>

        {/* Opinions Stats */}
        <div className="bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Opinions</h3>
          <p>Preferred Investment Types:</p>
          <ul>
            {Object.entries(investmentTypeCounts).map(([type, count]) => (
              <li key={type}>{type}: {count}</li>
            ))}
          </ul>
          <p>Information Sources:</p>
          <ul>
            {Object.entries(informationSourceCounts).map(([source, count]) => (
              <li key={source}>{source}: {count}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResponseStats;
