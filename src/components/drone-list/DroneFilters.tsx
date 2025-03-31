
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Filter, Search, ChevronDown, List, Grid } from 'lucide-react';

interface DroneFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string | null;
  handleFilterChange: (filterType: string | null) => void;
  viewMode: 'table' | 'cards';
  handleViewModeChange: (mode: 'table' | 'cards') => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
  droneType: string | null;
  setDroneType: (type: string | null) => void;
  batteryFilter: string | null;
  setBatteryFilter: (battery: string | null) => void;
  resetFilters: () => void;
  uniqueTypes: string[];
  uniqueBatteries: string[];
}

const DroneFilters: React.FC<DroneFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  filterStatus,
  handleFilterChange,
  viewMode,
  handleViewModeChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
  droneType,
  setDroneType,
  batteryFilter,
  setBatteryFilter,
  resetFilters,
  uniqueTypes,
  uniqueBatteries,
}) => {
  return (
    <>
      <div className="flex w-full sm:w-auto gap-2">
        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search drones..."
            className="pl-8 w-full sm:w-[240px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <Filter className="h-4 w-4" />
              Filter
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => handleFilterChange(null)}>
              All Drones
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('ready')}>
              Ready for Field
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('not-ready')}>
              Not Ready
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('needs-repair')}>
              Needs Repair
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('camera-issues')}>
              Camera Issues
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleFilterChange('flight-test-passed')}>
              Flight Test Passed
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
              {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => handleViewModeChange('table')}
          className={viewMode === 'table' ? 'bg-muted' : ''}
        >
          <List className="h-4 w-4" />
        </Button>
        <Button 
          variant="ghost"
          size="icon"
          onClick={() => handleViewModeChange('cards')}
          className={viewMode === 'cards' ? 'bg-muted' : ''}
        >
          <Grid className="h-4 w-4" />
        </Button>
      </div>
      
      {showAdvancedFilters && (
        <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          <div>
            <Select 
              value={droneType || 'all-types'} 
              onValueChange={(value) => setDroneType(value === 'all-types' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Drone Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-types">All Types</SelectItem>
                {uniqueTypes.map((type) => (
                  <SelectItem key={type} value={type}>{type}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Select 
              value={batteryFilter || 'all-batteries'} 
              onValueChange={(value) => setBatteryFilter(value === 'all-batteries' ? null : value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Battery Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-batteries">All Batteries</SelectItem>
                {uniqueBatteries.map((battery) => (
                  <SelectItem key={battery} value={battery}>{battery}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-end">
            <Button variant="outline" size="sm" onClick={resetFilters}>
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DroneFilters;
