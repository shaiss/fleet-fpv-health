
import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DroneData } from '@/utils/csvParser';
import { Check, X, ChevronDown, Search, Filter, AlertTriangle } from 'lucide-react';

interface DroneListProps {
  drones: DroneData[];
}

const DroneList: React.FC<DroneListProps> = ({ drones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: keyof DroneData; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (key: keyof DroneData) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const filteredDrones = drones.filter(drone => {
    const matchesSearch = drone.quadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      drone.notes.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!filterStatus) return matchesSearch;
    
    if (filterStatus === 'ready') {
      return matchesSearch && drone.readyForFieldTesting === '✓';
    } else if (filterStatus === 'not-ready') {
      return matchesSearch && drone.readyForFieldTesting !== '✓';
    } else if (filterStatus === 'needs-repair') {
      return matchesSearch && drone.notes && drone.notes.trim() !== '';
    } else if (filterStatus === 'camera-issues') {
      return matchesSearch && drone.camera === 'X';
    }
    
    return matchesSearch;
  });

  const sortedDrones = React.useMemo(() => {
    if (!sortConfig) return filteredDrones;
    
    return [...filteredDrones].sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      
      if (aValue === bValue) return 0;
      
      const comparison = aValue < bValue ? -1 : 1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [filteredDrones, sortConfig]);

  const renderStatusIcon = (value: string) => {
    if (value === '✓') return <Check className="h-5 w-5 text-green-400" />;
    if (value === '✗') return <X className="h-5 w-5 text-red-400" />;
    if (value === '-') return <span className="text-yellow-400">-</span>;
    return value;
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <CardTitle>Drone Fleet</CardTitle>
          <div className="flex w-full sm:w-auto gap-2">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search drones..."
                className="pl-8 w-full sm:w-[240px]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1">
                  <Filter className="h-4 w-4" />
                  Filter
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setFilterStatus(null)}>
                  All Drones
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('ready')}>
                  Ready for Field
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('not-ready')}>
                  Not Ready
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('needs-repair')}>
                  Needs Repair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('camera-issues')}>
                  Camera Issues
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">ID</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('quadName')}>
                  Quad Name {sortConfig?.key === 'quadName' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead>Camera</TableHead>
                <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
                  Type {sortConfig?.key === 'type' && (sortConfig.direction === 'asc' ? '↑' : '↓')}
                </TableHead>
                <TableHead className="text-center">Battery</TableHead>
                <TableHead className="text-center">Flight Test</TableHead>
                <TableHead className="text-center">Field Ready</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedDrones.length > 0 ? (
                sortedDrones.map((drone) => (
                  <TableRow key={drone.id}>
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
                  <TableCell colSpan={8} className="h-24 text-center">
                    No drones found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DroneList;
