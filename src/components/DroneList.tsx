
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DroneData } from '@/utils/csvParser';
import { DroneTable, DroneCards, DroneFilters } from '@/components/drone-list';
import { useDroneFilter, ColumnFilter } from '@/hooks/useDroneFilter';
import { useDroneSelection } from '@/hooks/useDroneSelection';
import { useViewMode, ViewMode } from '@/hooks/useViewMode';

interface DroneListProps {
  drones: DroneData[];
}

const DroneList: React.FC<DroneListProps> = ({ drones }) => {
  const {
    searchTerm,
    setSearchTerm,
    filterStatus,
    handleFilterChange,
    sortConfig,
    droneType,
    setDroneType,
    batteryFilter,
    setBatteryFilter,
    columnFilters,
    setColumnFilters,
    sortedDrones,
    uniqueTypes,
    uniqueBatteries,
    uniqueValues,
    handleSort,
    resetFilters,
    filtersActive
  } = useDroneFilter(drones);

  const {
    viewMode,
    handleViewModeChange,
    showAdvancedFilters,
    setShowAdvancedFilters
  } = useViewMode();

  const {
    selectedDrones,
    handleSelectDrone,
    handleSelectAll
  } = useDroneSelection();

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Drone Fleet</CardTitle>
          <DroneFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            filterStatus={filterStatus}
            handleFilterChange={handleFilterChange}
            viewMode={viewMode}
            handleViewModeChange={handleViewModeChange}
            showAdvancedFilters={showAdvancedFilters}
            setShowAdvancedFilters={setShowAdvancedFilters}
            droneType={droneType}
            setDroneType={setDroneType}
            batteryFilter={batteryFilter}
            setBatteryFilter={setBatteryFilter}
            resetFilters={resetFilters}
            uniqueTypes={uniqueTypes}
            uniqueBatteries={uniqueBatteries}
            columnFilters={columnFilters}
            setColumnFilters={setColumnFilters}
            uniqueValues={uniqueValues}
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {viewMode === 'table' ? (
          <DroneTable
            drones={sortedDrones}
            selectedDrones={selectedDrones}
            sortConfig={sortConfig}
            onSort={handleSort}
            onSelectDrone={handleSelectDrone}
            onSelectAll={() => handleSelectAll(sortedDrones)}
          />
        ) : (
          <DroneCards
            drones={sortedDrones}
            selectedDrones={selectedDrones}
            onSelectDrone={handleSelectDrone}
          />
        )}
      </CardContent>
      <CardFooter className="flex justify-between items-center p-4 border-t">
        <div>
          {selectedDrones.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedDrones.size} drone{selectedDrones.size !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {columnFilters.length > 0 && (
            <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded-full">
              {columnFilters.length} column filter{columnFilters.length !== 1 ? 's' : ''}
            </span>
          )}
          <span className="text-sm text-muted-foreground">
            Showing {sortedDrones.length} of {drones.length} drones
          </span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DroneList;
