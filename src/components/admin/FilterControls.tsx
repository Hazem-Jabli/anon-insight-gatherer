
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contrôles de Filtres - Colonne Gauche */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-base">Filtres</h3>
            
            <div>
              <Label htmlFor="filter-gender" className="mb-2 block">Genre</Label>
              <Select
                value={filters.gender || 'all-genders'}
                onValueChange={(value) => onFilterChange('gender', value === 'all-genders' ? null : value)}
              >
                <SelectTrigger id="filter-gender" className="w-full">
                  <SelectValue placeholder="Tous les genres" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-genders">Tous les genres</SelectItem>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-age" className="mb-2 block">Groupe d'âge</Label>
              <Select
                value={filters.ageGroup || 'all-ages'}
                onValueChange={(value) => onFilterChange('ageGroup', value === 'all-ages' ? null : value)}
              >
                <SelectTrigger id="filter-age" className="w-full">
                  <SelectValue placeholder="Tous les âges" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-ages">Tous les âges</SelectItem>
                  <SelectItem value="18-24">18-24 ans</SelectItem>
                  <SelectItem value="25-34">25-34 ans</SelectItem>
                  <SelectItem value="35-44">35-44 ans</SelectItem>
                  <SelectItem value="45-54">45-54 ans</SelectItem>
                  <SelectItem value="55-64">55-64 ans</SelectItem>
                  <SelectItem value="65+">65+ ans</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="filter-education" className="mb-2 block">Éducation</Label>
              <Select
                value={filters.educationLevel || 'all-education'}
                onValueChange={(value) => onFilterChange('educationLevel', value === 'all-education' ? null : value)}
              >
                <SelectTrigger id="filter-education" className="w-full">
                  <SelectValue placeholder="Tous les niveaux d'éducation" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-education">Tous les niveaux</SelectItem>
                  <SelectItem value="high-school">Lycée</SelectItem>
                  <SelectItem value="some-college">Formation supérieure</SelectItem>
                  <SelectItem value="bachelors">Licence</SelectItem>
                  <SelectItem value="masters">Master</SelectItem>
                  <SelectItem value="doctorate">Doctorat</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Button 
                variant="outline"
                onClick={onResetFilters}
                className="w-full"
              >
                Réinitialiser les filtres
              </Button>
            </div>
          </div>
          
          {/* Contrôles de Gestion des Données - Colonne Droite */}
          <div className="flex flex-col gap-4">
            <h3 className="font-medium text-base">Gestion des données</h3>
            
            <div className="text-sm text-gray-500">
              Total des réponses: <span className="font-medium">{responseCount}</span>
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={() => onExportData('json')}
                disabled={responseCount === 0}
                className="w-full mb-2"
              >
                Exporter en JSON
              </Button>
            </div>
            
            <div>
              <Button
                variant="outline"
                onClick={() => onExportData('csv')}
                disabled={responseCount === 0}
                className="w-full mb-2"
              >
                Exporter en CSV
              </Button>
            </div>
            
            <div>
              <Button
                variant="destructive"
                onClick={onResetData}
                disabled={responseCount === 0}
                className="w-full"
              >
                Effacer toutes les données
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
