
import React, { useState } from 'react';
import DashboardHeader from '@/components/DashboardHeader';
import FileUploader from '@/components/FileUploader';
import DashboardStats from '@/components/DashboardStats';
import DroneCharts from '@/components/DroneCharts';
import DroneList from '@/components/DroneList';
import { DroneData } from '@/utils/csvParser';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  const [drones, setDrones] = useState<DroneData[]>([]);

  const handleDataLoaded = (data: DroneData[]) => {
    setDrones(data);
  };

  return (
    <div className="container py-6 max-w-7xl mx-auto">
      <DashboardHeader />
      
      {drones.length === 0 ? (
        <div className="mt-8">
          <FileUploader onDataLoaded={handleDataLoaded} />
          <div className="text-center text-muted-foreground mt-8">
            <p className="text-lg">Upload your fleet CSV to get started</p>
            <p className="text-sm mt-2">
              No data to display. Use the uploader above to load your drone fleet data in CSV format.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <FileUploader onDataLoaded={handleDataLoaded} />
          <Separator />
          <DashboardStats drones={drones} />
          <DroneCharts drones={drones} />
          <DroneList drones={drones} />
        </div>
      )}
    </div>
  );
};

export default Index;
