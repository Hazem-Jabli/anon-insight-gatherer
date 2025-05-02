
import React from 'react';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface FilterControlsProps {
  onFilterChange: (filter: string, value: string | null) => void;
  onResetFilters: () => void;
  onResetData: () => void;
  onExportData: (format: 'json' | 'csv') => void;
  filters: {
    ageGroup: string | null;
    educationLevel: string | null;
    gender: string | null;
  };
  responseCount: number;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  onFilterChange,
  onResetFilters,
  onResetData,
  onExportData,
  filters,
  responseCount
}) => {
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between">
          {/* Filter Controls */}
          <div className="flex flex-col sm:flex-row gap-4 items-start">
            <div>
              <Label htmlFor="filter-gender" className="mb-2 block">Gender</Label>
              <Select
                value={filters.gender || 'all-genders'}
                onValueChange={(value) => onFilterChange('gender', value === 'all-genders' ? null : value)}
              >
                <SelectTrigger id="filter-gender" className="w-[180px]">
                  <SelectValue placeholder="All Genders" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-genders">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="non-binary">Non-Binary</SelectItem>
                  <SelectItem value="prefer-not-to-say">Prefer Not To Say</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-age" className="mb-2 block">Age Group</Label>
              <Select
                value={filters.ageGroup || 'all-ages'}
                onValueChange={(value) => onFilterChange('ageGroup', value === 'all-ages' ? null : value)}
              >
                <SelectTrigger id="filter-age" className="w-[180px]">
                  <SelectValue placeholder="All Age Groups" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-ages">All Age Groups</SelectItem>
                  <SelectItem value="18-24">18-24 years</SelectItem>
                  <SelectItem value="25-34">25-34 years</SelectItem>
                  <SelectItem value="35-44">35-44 years</SelectItem>
                  <SelectItem value="45-54">45-54 years</SelectItem>
                  <SelectItem value="55-64">55-64 years</SelectItem>
                  <SelectItem value="65+">65+ years</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-education" className="mb-2 block">Education</Label>
              <Select
                value={filters.educationLevel || 'all-education'}
                onValueChange={(value) => onFilterChange('educationLevel', value === 'all-education' ? null : value)}
              >
                <SelectTrigger id="filter-education" className="w-[180px]">
                  <SelectValue placeholder="All Education Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-education">All Education Levels</SelectItem>
                  <SelectItem value="high-school">High School</SelectItem>
                  <SelectItem value="some-college">Some College</SelectItem>
                  <SelectItem value="bachelors">Bachelor's</SelectItem>
                  <SelectItem value="masters">Master's</SelectItem>
                  <SelectItem value="doctorate">Doctorate</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="self-end">
              <Button 
                variant="outline"
                onClick={onResetFilters}
              >
                Reset Filters
              </Button>
            </div>
          </div>
          
          {/* Data Management Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end">
            <div className="text-sm text-gray-500 hidden md:block">
              Total Responses: <span className="font-medium">{responseCount}</span>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => onExportData('json')}
                disabled={responseCount === 0}
              >
                Export JSON
              </Button>
              <Button
                variant="outline"
                onClick={() => onExportData('csv')}
                disabled={responseCount === 0}
              >
                Export CSV
              </Button>
              <Button
                variant="destructive"
                onClick={onResetData}
                disabled={responseCount === 0}
              >
                Reset All Data
              </Button>
            </div>
          </div>
        </div>
        
        <div className="text-sm text-gray-500 mt-4 block md:hidden">
          Total Responses: <span className="font-medium">{responseCount}</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
