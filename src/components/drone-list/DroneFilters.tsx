
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
import { Filter, Search, ChevronDown, List, Grid, SlidersHorizontal } from 'lucide-react';
import { DroneData } from '@/utils/csvParser';

interface ColumnFilter {
  column: keyof DroneData | 'all';
  value: string;
}

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
  columnFilters: ColumnFilter[];
  setColumnFilters: (filters: ColumnFilter[]) => void;
  uniqueValues: Record<string, string[]>;
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
  columnFilters,
  setColumnFilters,
  uniqueValues,
}) => {
  const getColumnFilterValue = (column: keyof DroneData | 'all') => {
    const filter = columnFilters.find(f => f.column === column);
    return filter ? filter.value : '';
  };

  const handleColumnFilterChange = (column: keyof DroneData | 'all', value: string) => {
    if (value === 'all-values') {
      setColumnFilters(columnFilters.filter(f => f.column !== column));
    } else {
      const newFilters = columnFilters.filter(f => f.column !== column);
      newFilters.push({ column, value });
      setColumnFilters(newFilters);
    }
  };

  const filterColumns: (keyof DroneData)[] = [
    'quadName', 'type', 'batteryType', 'camera', 'flightTest', 'readyForFieldTesting'
  ];

  const getColumnLabel = (column: keyof DroneData): string => {
    const columnLabels: Record<keyof DroneData, string> = {
      id: 'ID',
      quadName: 'Quad Name',
      camera: 'Camera',
      type: 'Type',
      batteryType: 'Battery Type',
      flightTest: 'Flight Test',
      readyForFieldTesting: 'Field Ready',
      notes: 'Notes'
    };
    return columnLabels[column] || column;
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-1">
              <SlidersHorizontal className="h-4 w-4" />
              Columns
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64">
            <DropdownMenuLabel>Filter By Column</DropdownMenuLabel>
            <div className="max-h-[70vh] overflow-auto">
              {filterColumns.map((column) => (
                <div key={column} className="px-2 py-1.5">
                  <div className="mb-1 text-xs font-semibold">{getColumnLabel(column)}</div>
                  <Select
                    value={getColumnFilterValue(column) || 'all-values'}
                    onValueChange={(value) => handleColumnFilterChange(column, value)}
                  >
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder={`All ${getColumnLabel(column)}s`} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all-values">All Values</SelectItem>
                      {uniqueValues[column]?.map((value) => (
                        <SelectItem key={`${column}-${value}`} value={value}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
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
