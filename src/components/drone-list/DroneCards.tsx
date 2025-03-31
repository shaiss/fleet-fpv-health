
import React from 'react';
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DroneData } from '@/utils/csvParser';
import { Plane, Battery, Camera as CameraIcon, Activity, AlertTriangle, Check, X } from 'lucide-react';

interface DroneCardsProps {
  drones: DroneData[];
  selectedDrones: Set<number>;
  onSelectDrone: (id: number) => void;
}

const DroneCards: React.FC<DroneCardsProps> = ({
  drones,
  selectedDrones,
  onSelectDrone,
}) => {
  const renderStatusIcon = (value: string) => {
    if (value === '✓') return <Check className="h-5 w-5 text-green-400" />;
    if (value === 'X' || value === '✗') return <X className="h-5 w-5 text-red-400" />;
    if (value === '-') return <span className="text-yellow-400">-</span>;
    return value;
  };

  const getStatusColor = (drone: DroneData) => {
    if (drone.readyForFieldTesting === '✓') return "border-green-500/20 bg-green-500/5";
    if (drone.notes && drone.notes.trim() !== '') return "border-yellow-500/20 bg-yellow-500/5";
    if (drone.camera === 'X' || drone.camera === '✗') return "border-red-500/20 bg-red-500/5";
    return "border-blue-500/20 bg-blue-500/5";
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {drones.length > 0 ? (
        drones.map((drone) => (
          <Card key={drone.id} className={`overflow-hidden transition-all hover:shadow-md ${getStatusColor(drone)}`}>
            <CardHeader className="pb-2 pt-4 px-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">#{drone.id}</span>
                  </div>
                  <h3 className="font-semibold text-lg mt-1">{drone.quadName}</h3>
                </div>
                <div className="flex gap-1">
                  <Badge variant={drone.readyForFieldTesting === '✓' ? "success" : "destructive"}>
                    {drone.readyForFieldTesting === '✓' ? 'Ready' : 'Not Ready'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Plane className="h-4 w-4 text-muted-foreground" />
                  <span>{drone.type}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-muted-foreground" />
                  <span>{drone.batteryType}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CameraIcon className="h-4 w-4 text-muted-foreground" />
                  <span>{renderStatusIcon(drone.camera)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-muted-foreground" />
                  <span>{renderStatusIcon(drone.flightTest)}</span>
                </div>
              </div>
              {drone.notes && drone.notes.trim() !== "" && (
                <div className="mt-3 flex items-start gap-2 p-2 rounded-md bg-yellow-500/10 text-yellow-400 text-xs">
                  <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{drone.notes}</span>
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <div className="col-span-full text-center py-10 text-muted-foreground">
          No drones found.
        </div>
      )}
    </div>
  );
};

export default DroneCards;
