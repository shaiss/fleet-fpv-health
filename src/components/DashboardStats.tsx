
import React from 'react';
import { DroneData, getStatusCounters } from '@/utils/csvParser';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Drone, AlertTriangle, CheckCircle, Camera, Activity } from 'lucide-react';

interface DashboardStatsProps {
  drones: DroneData[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ drones }) => {
  const stats = getStatusCounters(drones);
  const readyPercentage = drones.length > 0 ? Math.round((stats.ready / drones.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard 
        title="Total Drones" 
        value={stats.total.toString()} 
        icon={<Drone className="h-6 w-6 text-primary" />} 
      />
      <StatCard 
        title="Ready for Field" 
        value={`${stats.ready} (${readyPercentage}%)`} 
        icon={<CheckCircle className="h-6 w-6 text-green-400" />} 
      >
        <Progress value={readyPercentage} className="h-2 mt-2" />
      </StatCard>
      <StatCard 
        title="Needs Repair" 
        value={stats.needsRepair.toString()} 
        icon={<AlertTriangle className="h-6 w-6 text-yellow-400" />} 
      />
      <StatCard 
        title="Camera Issues" 
        value={stats.missingCamera.toString()} 
        icon={<Camera className="h-6 w-6 text-red-400" />} 
      />
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon, children }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
          {icon}
        </div>
        <p className="text-2xl font-bold">{value}</p>
        {children}
      </CardContent>
    </Card>
  );
};

export default DashboardStats;
