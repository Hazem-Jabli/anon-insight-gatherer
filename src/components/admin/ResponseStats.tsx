
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
  };
}

// Chart colors
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

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
    return true;
  });

  // Demographics Data
  const ageGroupData = countByField(filteredResponses, response => response.demographics.ageGroup);
  const educationData = countByField(filteredResponses, response => response.demographics.educationLevel);
  const genderData = countByField(filteredResponses, response => response.demographics.gender);
  
  // Investment Knowledge Data
  const knowledgeLevelData = countByField(filteredResponses, response => 
    response.investmentKnowledge.selfRatedKnowledge);
  
  const experienceData = [
    { name: 'Previous Experience', value: filteredResponses.filter(r => 
      r.investmentKnowledge.previousExperience).length },
    { name: 'No Experience', value: filteredResponses.filter(r => 
      !r.investmentKnowledge.previousExperience).length }
  ];

  // Risk Tolerance Data
  const riskToleranceData = countByField(filteredResponses, response => 
    response.opinions.riskTolerance);

  // Helper function to count occurrences by field
  function countByField(data: any[], fieldAccessor: (item: any) => any) {
    const counts: Record<string, number> = {};
    data.forEach(item => {
      const field = fieldAccessor(item);
      counts[field] = (counts[field] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  // Format labels for display
  const formatLabel = (label: string) => {
    return label
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Age Group Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Age Group Distribution</CardTitle>
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
                    label={({ name }) => formatLabel(name)}
                  >
                    {ageGroupData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gender Distribution */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Gender Distribution</CardTitle>
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
                    label={({ name }) => formatLabel(name)}
                  >
                    {genderData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Education Level */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Education Level</CardTitle>
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
                    label={({ name }) => formatLabel(name)}
                  >
                    {educationData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Knowledge Level */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Self-Rated Knowledge Level</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={knowledgeLevelData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
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
                  <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                  <Bar dataKey="value" fill="#3b82f6" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Previous Experience */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Previous Investment Experience</CardTitle>
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
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {experienceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Tolerance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Risk Tolerance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskToleranceData}
                margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
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
                <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
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
