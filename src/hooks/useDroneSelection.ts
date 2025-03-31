
import { useState } from 'react';
import { DroneData } from '@/utils/csvParser';

interface UseDroneSelectionResult {
  selectedDrones: Set<number>;
  handleSelectDrone: (id: number) => void;
  handleSelectAll: (drones: DroneData[]) => void;
}

export const useDroneSelection = (): UseDroneSelectionResult => {
  const [selectedDrones, setSelectedDrones] = useState<Set<number>>(new Set());

  const handleSelectDrone = (id: number) => {
    const newSelected = new Set(selectedDrones);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDrones(newSelected);
  };

  const handleSelectAll = (drones: DroneData[]) => {
    if (selectedDrones.size === drones.length) {
      setSelectedDrones(new Set());
    } else {
      setSelectedDrones(new Set(drones.map(drone => drone.id)));
    }
  };

  return {
    selectedDrones,
    handleSelectDrone,
    handleSelectAll
  };
};
