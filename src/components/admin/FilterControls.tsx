
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
    professionalSector: string | null;
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
          {/* Filtres - Colonne Gauche */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Filtres</h3>
            
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
          </div>
          
          {/* Filtres - Colonne Droite */}
          <div className="space-y-4">
            <h3 className="font-medium text-base">Filtres supplémentaires</h3>
            
            <div>
              <Label htmlFor="filter-sector" className="mb-2 block">Secteur professionnel</Label>
              <Select
                value={filters.professionalSector || 'all-sectors'}
                onValueChange={(value) => onFilterChange('professionalSector', value === 'all-sectors' ? null : value)}
              >
                <SelectTrigger id="filter-sector" className="w-full">
                  <SelectValue placeholder="Tous les secteurs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-sectors">Tous les secteurs</SelectItem>
                  <SelectItem value="technology">Technologie</SelectItem>
                  <SelectItem value="healthcare">Santé</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="education">Éducation</SelectItem>
                  <SelectItem value="manufacturing">Industrie</SelectItem>
                  <SelectItem value="retail">Commerce</SelectItem>
                  <SelectItem value="government">Administration</SelectItem>
                  <SelectItem value="non-profit">Association</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        
        {/* Boutons de gestion - En bas */}
        <div className="mt-6">
          <Button 
            variant="outline"
            onClick={onResetFilters}
            className="mr-2"
          >
            Réinitialiser les filtres
          </Button>
          
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => onExportData('json')}
              disabled={responseCount === 0}
            >
              Exporter JSON
            </Button>
            
            <Button
              variant="outline"
              onClick={() => onExportData('csv')}
              disabled={responseCount === 0}
            >
              Exporter CSV
            </Button>
            
            <Button
              variant="destructive"
              onClick={onResetData}
              disabled={responseCount === 0}
              className="ml-auto"
            >
              Effacer toutes les données
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FilterControls;
