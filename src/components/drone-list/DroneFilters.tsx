
import React from 'react';
import { DroneData } from '@/utils/csvParser';
import { ColumnFilter } from '@/hooks/useDroneFilter';
import { ViewMode } from '@/hooks/useViewMode';
import {
  SearchInput,
  StatusFilter,
  ColumnFilters,
  ViewToggle,
  ResetFiltersButton,
  AdvancedFilters
} from './filters';

interface DroneFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string | null;
  handleFilterChange: (filterType: string | null) => void;
  viewMode: ViewMode;
  handleViewModeChange: (mode: ViewMode) => void;
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
  const filtersActive = columnFilters.length > 0 || filterStatus !== null || 
                        droneType !== null || batteryFilter !== null || 
                        searchTerm !== '';

  return (
    <>
      <div className="flex w-full sm:w-auto gap-2">
        <SearchInput 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <StatusFilter 
          filterStatus={filterStatus} 
          handleFilterChange={handleFilterChange} 
          showAdvancedFilters={showAdvancedFilters} 
          setShowAdvancedFilters={setShowAdvancedFilters} 
        />
        
        <ColumnFilters 
          columnFilters={columnFilters} 
          setColumnFilters={setColumnFilters} 
          uniqueValues={uniqueValues} 
          resetFilters={resetFilters} 
          filtersActive={filtersActive} 
        />
        
        <ViewToggle 
          viewMode={viewMode} 
          handleViewModeChange={handleViewModeChange} 
        />
        
        {filtersActive && (
          <ResetFiltersButton resetFilters={resetFilters} />
        )}
      </div>
      
      <AdvancedFilters 
        showAdvancedFilters={showAdvancedFilters}
        droneType={droneType}
        setDroneType={setDroneType}
        batteryFilter={batteryFilter}
        setBatteryFilter={setBatteryFilter}
        uniqueTypes={uniqueTypes}
        uniqueBatteries={uniqueBatteries}
      />
    </>
  );
};

export default DroneFilters;
