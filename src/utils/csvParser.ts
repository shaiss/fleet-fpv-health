
export interface DroneData {
  id: number;
  quadName: string;
  camera: string;
  type: string;
  propSize: string;
  vtx: string;
  rcReceiver: string;
  transmitter: string;
  externalTransmitter: string;
  txModelNum: string;
  batteryType: string;
  videoChannel: string;
  flightTest: string;
  readyForFieldTesting: string;
  notes: string;
}

export const parseCSV = (csvText: string): DroneData[] => {
  const lines = csvText.split('\n');
  
  // Ensure we have at least a header and one data row
  if (lines.length < 2) {
    return [];
  }
  
  // Skip the first line (header) and process the rest
  return lines.slice(1)
    .filter(line => line.trim() !== '') // Skip empty lines
    .map((line, index) => {
      // Split by comma but respect quotes
      const values: string[] = [];
      let currentValue = '';
      let insideQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        
        if (char === '"' && (i === 0 || line[i-1] !== '\\')) {
          insideQuotes = !insideQuotes;
        } else if (char === ',' && !insideQuotes) {
          values.push(currentValue);
          currentValue = '';
        } else {
          currentValue += char;
        }
      }
      
      // Add the last value
      values.push(currentValue);
      
      // Create drone data object
      return {
        id: Number(values[0]) || index + 1,
        quadName: values[1] || '',
        camera: values[2] || '',
        type: values[3] || '',
        propSize: values[4] || '',
        vtx: values[5] || '',
        rcReceiver: values[6] || '',
        transmitter: values[7] || '',
        externalTransmitter: values[8] || '',
        txModelNum: values[9] || '',
        batteryType: values[10] || '',
        videoChannel: values[11] || '',
        flightTest: values[12] || '',
        readyForFieldTesting: values[13] || '',
        notes: values[14] || ''
      };
    });
};

export const getStatusCounters = (drones: DroneData[]) => {
  const total = drones.length;
  const ready = drones.filter(drone => drone.readyForFieldTesting === "✓").length;
  const needsRepair = drones.filter(drone => drone.notes && drone.notes.trim() !== "").length;
  const missingCamera = drones.filter(drone => drone.camera === "X").length;
  
  return {
    total,
    ready,
    needsRepair,
    missingCamera,
    notReady: total - ready
  };
};

export const getBatteryTypeDistribution = (drones: DroneData[]) => {
  const batteryTypes: Record<string, number> = {};
  
  drones.forEach(drone => {
    if (drone.batteryType && drone.batteryType.trim() !== "") {
      if (batteryTypes[drone.batteryType]) {
        batteryTypes[drone.batteryType]++;
      } else {
        batteryTypes[drone.batteryType] = 1;
      }
    }
  });
  
  return Object.entries(batteryTypes).map(([name, value]) => ({
    name,
    value
  }));
};

export const getQuadTypeDistribution = (drones: DroneData[]) => {
  const quadTypes: Record<string, number> = {};
  
  drones.forEach(drone => {
    if (drone.type && drone.type.trim() !== "") {
      if (quadTypes[drone.type]) {
        quadTypes[drone.type]++;
      } else {
        quadTypes[drone.type] = 1;
      }
    }
  });
  
  return Object.entries(quadTypes).map(([name, value]) => ({
    name,
    value
  }));
};
