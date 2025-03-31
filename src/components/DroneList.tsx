import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DroneData } from '@/utils/csvParser';
import { DroneTable, DroneCards, DroneFilters } from '@/components/drone-list';

interface DroneListProps {
  drones: DroneData[];
}

type ViewMode = 'table' | 'cards';
type SortKey = keyof DroneData | null;
type SortDirection = 'asc' | 'desc';

interface ColumnFilter {
  column: keyof DroneData | 'all';
  value: string;
}

const DroneList: React.FC<DroneListProps> = ({ drones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [droneType, setDroneType] = useState<string | null>(null);
  const [batteryFilter, setBatteryFilter] = useState<string | null>(null);
  const [selectedDrones, setSelectedDrones] = useState<Set<number>>(new Set());
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  const uniqueTypes = React.useMemo(() => {
    const types = new Set<string>();
    drones.forEach(drone => {
      if (drone.type) types.add(drone.type);
    });
    return Array.from(types).sort();
  }, [drones]);

  const uniqueBatteries = React.useMemo(() => {
    const batteries = new Set<string>();
    drones.forEach(drone => {
      if (drone.batteryType) batteries.add(drone.batteryType);
    });
    return Array.from(batteries).sort();
  }, [drones]);

  // Get unique values for each column
  const uniqueValues = React.useMemo(() => {
    const columns: Record<string, Set<string>> = {
      type: new Set<string>(),
      batteryType: new Set<string>(),
      camera: new Set<string>(),
      flightTest: new Set<string>(),
      readyForFieldTesting: new Set<string>(),
    };
    
    drones.forEach(drone => {
      Object.entries(drone).forEach(([key, value]) => {
        if (key in columns && value) {
          columns[key].add(String(value));
        }
      });
    });
    
    const result: Record<string, string[]> = {};
    Object.entries(columns).forEach(([key, values]) => {
      result[key] = Array.from(values).sort();
    });
    
    return result;
  }, [drones]);

  const handleSort = (key: keyof DroneData) => {
    let direction: SortDirection = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (filterType: string | null) => {
    setFilterStatus(filterType);
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSelectDrone = (id: number) => {
    const newSelected = new Set(selectedDrones);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDrones(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDrones.size === filteredDrones.length) {
      setSelectedDrones(new Set());
    } else {
      setSelectedDrones(new Set(filteredDrones.map(drone => drone.id)));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus(null);
    setDroneType(null);
    setBatteryFilter(null);
    setColumnFilters([]);
    setShowAdvancedFilters(false);
  };

  const filteredDrones = React.useMemo(() => {
    return drones.filter(drone => {
      // Global search
      const matchesSearch = drone.quadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drone.notes && drone.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      let matchesStatus = true;
      if (filterStatus) {
        if (filterStatus === 'ready') {
          matchesStatus = drone.readyForFieldTesting === '✓';
        } else if (filterStatus === 'not-ready') {
          matchesStatus = drone.readyForFieldTesting !== '✓';
        } else if (filterStatus === 'needs-repair') {
          matchesStatus = !!(drone.notes && drone.notes.trim() !== '');
        } else if (filterStatus === 'camera-issues') {
          matchesStatus = drone.camera === 'X' || drone.camera !== '✓';
        } else if (filterStatus === 'flight-test-passed') {
          matchesStatus = drone.flightTest === '✓';
        }
      }
      
      // Type filter
      const matchesType = !droneType || drone.type === droneType;
      
      // Battery filter
      const matchesBattery = !batteryFilter || drone.batteryType === batteryFilter;
      
      // Column-specific filters
      const matchesColumnFilters = columnFilters.every(filter => {
        const column = filter.column as keyof DroneData;
        const droneValue = String(drone[column]);
        return droneValue === filter.value;
      });
      
      return matchesSearch && matchesStatus && matchesType && matchesBattery && matchesColumnFilters;
    });
  }, [drones, searchTerm, filterStatus, droneType, batteryFilter, columnFilters]);

  const sortedDrones = React.useMemo(() => {
    if (!sortConfig) return filteredDrones;
    
    return [...filteredDrones].sort((a, b) => {
      if (!sortConfig.key) return 0;
      
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      if (aValue === undefined || aValue === null || aValue === '') return 1;
      if (bValue === undefined || bValue === null || bValue === '') return -1;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredDrones, sortConfig]);

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
            onSelectAll={handleSelectAll}
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
