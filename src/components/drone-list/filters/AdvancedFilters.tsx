
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedFiltersProps {
  showAdvancedFilters: boolean;
  droneType: string | null;
  setDroneType: (type: string | null) => void;
  batteryFilter: string | null;
  setBatteryFilter: (battery: string | null) => void;
  uniqueTypes: string[];
  uniqueBatteries: string[];
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  showAdvancedFilters,
  droneType,
  setDroneType,
  batteryFilter,
  setBatteryFilter,
  uniqueTypes,
  uniqueBatteries,
}) => {
  if (!showAdvancedFilters) return null;

  return (
    <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
    </div>
  );
};

export default AdvancedFilters;
