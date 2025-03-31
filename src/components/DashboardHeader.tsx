
import React from 'react';
import { Drone } from '@/components/icons/Drone';

const DashboardHeader: React.FC = () => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <Drone className="h-8 w-8 text-primary animate-pulse-slow" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">FPV Fleet Health</h1>
          <p className="text-muted-foreground">Manage and monitor your drone fleet</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
