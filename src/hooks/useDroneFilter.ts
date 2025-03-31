
import { useState, useMemo } from 'react';
import { DroneData } from '@/utils/csvParser';

type SortKey = keyof DroneData | null;
type SortDirection = 'asc' | 'desc';

export interface ColumnFilter {
  column: keyof DroneData | 'all';
  value: string;
}

interface UseDroneFilterResult {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  filterStatus: string | null;
  setFilterStatus: (status: string | null) => void;
  sortConfig: { key: SortKey; direction: SortDirection } | null;
  setSortConfig: (config: { key: SortKey; direction: SortDirection } | null) => void;
  droneType: string | null;
  setDroneType: (type: string | null) => void;
  batteryFilter: string | null;
  setBatteryFilter: (battery: string | null) => void;
  columnFilters: ColumnFilter[];
  setColumnFilters: (filters: ColumnFilter[]) => void;
  filteredDrones: DroneData[];
  sortedDrones: DroneData[];
  uniqueTypes: string[];
  uniqueBatteries: string[];
  uniqueValues: Record<string, string[]>;
  handleSort: (key: keyof DroneData) => void;
  handleFilterChange: (filterType: string | null) => void;
  resetFilters: () => void;
  filtersActive: boolean;
}

export const useDroneFilter = (drones: DroneData[]): UseDroneFilterResult => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [droneType, setDroneType] = useState<string | null>(null);
  const [batteryFilter, setBatteryFilter] = useState<string | null>(null);
  const [columnFilters, setColumnFilters] = useState<ColumnFilter[]>([]);

  const uniqueTypes = useMemo(() => {
    const types = new Set<string>();
    drones.forEach(drone => {
      if (drone.type) types.add(drone.type);
    });
    return Array.from(types).sort();
  }, [drones]);

  const uniqueBatteries = useMemo(() => {
    const batteries = new Set<string>();
    drones.forEach(drone => {
      if (drone.batteryType) batteries.add(drone.batteryType);
    });
    return Array.from(batteries).sort();
  }, [drones]);

  // Get unique values for each column
  const uniqueValues = useMemo(() => {
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

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus(null);
    setDroneType(null);
    setBatteryFilter(null);
    setColumnFilters([]);
  };

  const filteredDrones = useMemo(() => {
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

  const sortedDrones = useMemo(() => {
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

  const filtersActive = columnFilters.length > 0 || filterStatus !== null || 
                        droneType !== null || batteryFilter !== null || 
                        searchTerm !== '';

  return {
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    sortConfig,
    setSortConfig,
    droneType,
    setDroneType,
    batteryFilter,
    setBatteryFilter,
    columnFilters,
    setColumnFilters,
    filteredDrones,
    sortedDrones,
    uniqueTypes,
    uniqueBatteries,
    uniqueValues,
    handleSort,
    handleFilterChange,
    resetFilters,
    filtersActive
  };
};
