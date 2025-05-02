
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SurveyResponse } from '@/types/survey';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

interface ResponseStatsProps {
  responses: SurveyResponse[];
  filters: {
    ageGroup: string | null;
    educationLevel: string | null;
    gender: string | null;
    professionalSector?: string | null;
  };
}

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

const ResponseStats: React.FC<ResponseStatsProps> = ({ responses, filters }) => {
  // Apply filters to responses
  const filteredResponses = responses.filter(response => {
    if (filters.ageGroup && response.demographics.ageGroup !== filters.ageGroup) {
      return false;
    }
    if (filters.educationLevel && response.demographics.educationLevel !== filters.educationLevel) {
      return false;
    }
    if (filters.gender && response.demographics.gender !== filters.gender) {
      return false;
    }
    if (filters.professionalSector && response.demographics.professionalSector !== filters.professionalSector) {
      return false;
    }
    return true;
  });

  // Demographics Data
  const ageGroupData = countByField(filteredResponses, response => response.demographics.ageGroup);
  const educationData = countByField(filteredResponses, response => response.demographics.educationLevel);
  const genderData = countByField(filteredResponses, response => response.demographics.gender);
  const sectorData = countByField(filteredResponses, response => response.demographics.professionalSector);
  
  // Investment Knowledge Data
  const knowledgeLevelData = countByField(filteredResponses, response => 
    response.investmentKnowledge.selfRatedKnowledge);
  
  const experienceData = [
    { name: 'Avec Expérience', value: filteredResponses.filter(r => 
      r.investmentKnowledge.previousExperience).length },
    { name: 'Sans Expérience', value: filteredResponses.filter(r => 
      !r.investmentKnowledge.previousExperience).length }
  ];

  // Risk Tolerance Data
  const riskToleranceData = countByField(filteredResponses, response => 
    response.opinions.riskTolerance);
    
  // Investment Goals
  const investmentGoalsData = countByInvestmentGoals(filteredResponses);

  // Helper function to count occurrences by field
  function countByField(data: any[], fieldAccessor: (item: any) => any) {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const field = fieldAccessor(item);
      if (field) { // Skip null values
        counts[field] = (counts[field] || 0) + 1;
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }
  
  // Helper function to count investment goals (which is an array)
  function countByInvestmentGoals(data: SurveyResponse[]) {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const goals = item.opinions.preferredInvestmentGoals;
      if (goals && Array.isArray(goals)) {
        goals.forEach(goal => {
          counts[goal] = (counts[goal] || 0) + 1;
        });
      }
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  // Format labels for display
  const formatLabel = (label: string) => {
    if (!label) return "Non spécifié";
    
    const labelMap: Record<string, string> = {
      // Gender
      'male': 'Homme',
      'female': 'Femme',
      
      // Education
      'high-school': 'Lycée',
      'some-college': 'Formation sup.',
      'bachelors': 'Licence',
      'masters': 'Master',
      'doctorate': 'Doctorat',
      'other': 'Autre',
      
      // Knowledge
      'none': 'Aucune',
      'basic': 'Basique',
      'intermediate': 'Intermédiaire',
      'advanced': 'Avancée',
      'expert': 'Expert',
      
      // Risk tolerance
      'very-low': 'Très faible',
      'low': 'Faible',
      'moderate': 'Modérée',
      'high': 'Élevée',
      'very-high': 'Très élevée',
      
      // Investment goals
      'retirement': 'Retraite',
      'wealth-preservation': 'Préservation',
      'passive-income': 'Revenu passif',
      'capital-growth': 'Croissance',
      'financial-security': 'Sécurité',
      
      // Sectors
      'technology': 'Technologie',
      'healthcare': 'Santé',
      'finance': 'Finance',
      'education': 'Éducation',
      'manufacturing': 'Industrie',
      'retail': 'Commerce',
      'government': 'Administration',
      'non-profit': 'Association'
    };
    
    if (labelMap[label]) {
      return labelMap[label];
    }
    
    return label
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Custom pie chart label renderer
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = outerRadius + 10;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fill="#888"
        fontSize={12}
      >
        {`${formatLabel(name)} (${(percent * 100).toFixed(0)}%)`}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Group Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribution par âge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={ageGroupData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Distribution par genre</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Education Level */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Niveau d'éducation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={educationData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Professional Sector */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Secteur professionnel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={sectorData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tickFormatter={formatLabel} 
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Knowledge Level */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Niveau de connaissance auto-évalué</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={knowledgeLevelData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tickFormatter={formatLabel} 
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Previous Experience */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Expérience préalable en investissement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={experienceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={renderCustomizedLabel}
                  >
                    {experienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Risk Tolerance */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Tolérance au risque</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskToleranceData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    dataKey="name" 
                    angle={-45} 
                    textAnchor="end" 
                    height={70}
                    tickFormatter={formatLabel} 
                  />
                  <YAxis />
                  <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Investment Goals */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Objectifs d'investissement préférés</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={investmentGoalsData}
                margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="name" 
                  angle={-45} 
                  textAnchor="end" 
                  height={70}
                  tickFormatter={formatLabel} 
                />
                <YAxis />
                <Tooltip formatter={(value) => [`${value} réponses`, 'Nombre']} />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResponseStats;
