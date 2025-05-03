
import React from 'react';
import { SurveyResponse } from '@/types/survey';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';

interface ResponseStatsProps {
  responses: SurveyResponse[];
}

// Chart colors
const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f97316', '#22c55e', '#eab308'];

const ResponseStats: React.FC<ResponseStatsProps> = ({ responses }) => {
  const isMobile = useIsMobile();
  
  // Calculate average age (using the age groups as numerical values for estimation)
  const ageMapping: { [key: string]: number } = {
    '18-24': 21,
    '25-34': 29.5,
    '35-44': 39.5,
    '45-54': 49.5,
    '55-64': 59.5,
    '65+': 70,
  };
  
  // Count age group distribution
  const ageGroupCounts = responses.reduce((counts, response) => {
    const ageGroup = response.demographics?.ageGroup || '';
    counts[ageGroup] = (counts[ageGroup] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const ageGroupData = Object.entries(ageGroupCounts).map(([name, value]) => ({
    name,
    value,
  }));

  // Count education level distribution
  const educationCounts = responses.reduce((counts, response) => {
    const education = response.demographics?.educationLevel || 'Unknown';
    counts[education] = (counts[education] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const educationLabels: { [key: string]: string } = {
    'high-school': 'Lycée',
    'some-college': 'Formation supérieure',
    'bachelors': 'Licence',
    'masters': 'Master',
    'doctorate': 'Doctorat',
    'other': 'Autre'
  };

  const educationData = Object.entries(educationCounts).map(([key, value]) => ({
    name: educationLabels[key] || key,
    value,
  }));

  // Count professional sector distribution
  const sectorCounts = responses.reduce((counts, response) => {
    const sector = response.demographics?.professionalSector || 'Unknown';
    counts[sector] = (counts[sector] || 0) + 1;
    return counts;
  }, {} as { [key: string]: number });

  const sectorLabels: { [key: string]: string } = {
    'technology': 'Technologie',
    'healthcare': 'Santé',
    'finance': 'Finance',
    'education': 'Éducation',
    'manufacturing': 'Industrie',
    'retail': 'Commerce',
    'government': 'Administration',
    'non-profit': 'Association',
    'other': 'Autre'
  };

  const sectorData = Object.entries(sectorCounts).map(([key, value]) => ({
    name: sectorLabels[key] || key,
    value,
  }));
  
  const chartHeight = isMobile ? 200 : 300;
  const chartWidth = '100%';

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold mb-4">Statistiques des Réponses</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Age Groups Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-4">Groupes d'âge</h3>
          <div className="h-[300px] w-full">
            <ChartContainer config={{}} className="h-full">
              <PieChart>
                <Pie
                  data={ageGroupData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={isMobile ? 80 : 100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ageGroupData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </div>
        </div>

        {/* Education Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-4">Niveau d'éducation</h3>
          <div className="h-[300px] w-full">
            <ChartContainer config={{}} className="h-full">
              <BarChart data={educationData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{fontSize: isMobile ? 8 : 12}} />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>

        {/* Sector Chart */}
        <div className="bg-white dark:bg-gray-800 shadow-md rounded-md p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-4">Secteurs professionnels</h3>
          <div className="h-[300px] w-full">
            <ChartContainer config={{}} className="h-full">
              <BarChart 
                data={sectorData}
                layout={isMobile ? "vertical" : "horizontal"}
              >
                <CartesianGrid strokeDasharray="3 3" />
                {isMobile ? (
                  <>
                    <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                    <XAxis type="number" />
                  </>
                ) : (
                  <>
                    <XAxis dataKey="name" />
                    <YAxis />
                  </>
                )}
                <ChartTooltip content={<ChartTooltipContent />} />
                <Legend />
                <Bar dataKey="value" fill="#8b5cf6" />
              </BarChart>
            </ChartContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResponseStats;
