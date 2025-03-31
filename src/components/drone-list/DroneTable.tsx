
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Check, X, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { DroneData } from '@/utils/csvParser';

interface DroneTableProps {
  drones: DroneData[];
  selectedDrones: Set<number>;
  sortConfig: { key: keyof DroneData | null; direction: 'asc' | 'desc' } | null;
  onSort: (key: keyof DroneData) => void;
  onSelectDrone: (id: number) => void;
  onSelectAll: () => void;
}

const DroneTable: React.FC<DroneTableProps> = ({
  drones,
  selectedDrones,
  sortConfig,
  onSort,
  onSelectDrone,
  onSelectAll,
}) => {
  const renderStatusIcon = (value: string) => {
    if (value === '✓') return <Check className="h-5 w-5 text-green-400" />;
    if (value === 'X' || value === '✗') return <X className="h-5 w-5 text-red-400" />;
    if (value === '-') return <span className="text-yellow-400">-</span>;
    return value;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <Checkbox 
                checked={selectedDrones.size > 0 && selectedDrones.size === drones.length}
                onCheckedChange={onSelectAll}
                aria-label="Select all drones"
              />
            </TableHead>
            <TableHead className="w-12">ID</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('quadName')}>
              <div className="flex items-center gap-1">
                Quad Name 
                {sortConfig?.key === 'quadName' && (
                  sortConfig.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead>Camera</TableHead>
            <TableHead className="cursor-pointer" onClick={() => onSort('type')}>
              <div className="flex items-center gap-1">
                Type
                {sortConfig?.key === 'type' && (
                  sortConfig.direction === 'asc' ? 
                    <ChevronUp className="h-4 w-4" /> : 
                    <ChevronDown className="h-4 w-4" />
                )}
              </div>
            </TableHead>
            <TableHead className="text-center">Battery</TableHead>
            <TableHead className="text-center">Flight Test</TableHead>
            <TableHead className="text-center">Field Ready</TableHead>
            <TableHead>Notes</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drones.length > 0 ? (
            drones.map((drone) => (
              <TableRow key={drone.id}>
                <TableCell>
                  <Checkbox 
                    checked={selectedDrones.has(drone.id)}
                    onCheckedChange={() => onSelectDrone(drone.id)}
                    aria-label={`Select drone ${drone.quadName}`}
                  />
                </TableCell>
                <TableCell className="font-medium">{drone.id}</TableCell>
                <TableCell>{drone.quadName}</TableCell>
                <TableCell>
                  {renderStatusIcon(drone.camera)}
                </TableCell>
                <TableCell>{drone.type}</TableCell>
                <TableCell className="text-center">{drone.batteryType}</TableCell>
                <TableCell className="text-center">
                  {renderStatusIcon(drone.flightTest)}
                </TableCell>
                <TableCell className="text-center">
                  {renderStatusIcon(drone.readyForFieldTesting)}
                </TableCell>
                <TableCell>
                  {drone.notes && (
                    <div className="flex items-center gap-1">
                      {drone.notes.trim() !== "" && (
                        <AlertTriangle className="h-4 w-4 text-yellow-400" />
                      )}
                      <span className="text-sm">{drone.notes}</span>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No drones found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DroneTable;
