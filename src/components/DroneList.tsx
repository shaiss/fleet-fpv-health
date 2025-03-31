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
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { DroneData } from '@/utils/csvParser';
import { Check, X, ChevronDown, Search, Filter, AlertTriangle, Grid, List, ChevronUp, Plane, Battery, Camera as CameraIcon, Activity } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

interface DroneListProps {
  drones: DroneData[];
}

type ViewMode = 'table' | 'cards';
type SortKey = keyof DroneData | null;
type SortDirection = 'asc' | 'desc';

const DroneList: React.FC<DroneListProps> = ({ drones }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: SortDirection } | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [droneType, setDroneType] = useState<string | null>(null);
  const [batteryFilter, setBatteryFilter] = useState<string | null>(null);
  const [selectedDrones, setSelectedDrones] = useState<Set<number>>(new Set());

  const uniqueTypes = React.useMemo(() => {
    const types = new Set<string>();
    drones.forEach(drone => {
      if (drone.type) types.add(drone.type);
    });
    return Array.from(types).sort();
  }, [drones]);

  const uniqueBatteries = React.useMemo(() => {
    const batteries = new Set<string>();
    drones.forEach(drone => {
      if (drone.batteryType) batteries.add(drone.batteryType);
    });
    return Array.from(batteries).sort();
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

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleSelectDrone = (id: number) => {
    const newSelected = new Set(selectedDrones);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedDrones(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedDrones.size === filteredDrones.length) {
      setSelectedDrones(new Set());
    } else {
      setSelectedDrones(new Set(filteredDrones.map(drone => drone.id)));
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilterStatus(null);
    setDroneType(null);
    setBatteryFilter(null);
    setShowAdvancedFilters(false);
  };

  const filteredDrones = React.useMemo(() => {
    return drones.filter(drone => {
      const matchesSearch = drone.quadName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        drone.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (drone.notes && drone.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
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
      
      const matchesType = !droneType || drone.type === droneType;
      
      const matchesBattery = !batteryFilter || drone.batteryType === batteryFilter;
      
      return matchesSearch && matchesStatus && matchesType && matchesBattery;
    });
  }, [drones, searchTerm, filterStatus, droneType, batteryFilter]);

  const sortedDrones = React.useMemo(() => {
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Filter By Status</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleFilterChange(null)}>
                  All Drones
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('ready')}>
                  Ready for Field
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('not-ready')}>
                  Not Ready
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('needs-repair')}>
                  Needs Repair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('camera-issues')}>
                  Camera Issues
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleFilterChange('flight-test-passed')}>
                  Flight Test Passed
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
                  {showAdvancedFilters ? 'Hide' : 'Show'} Advanced Filters
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => handleViewModeChange('table')}
              className={viewMode === 'table' ? 'bg-muted' : ''}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button 
              variant="ghost"
              size="icon"
              onClick={() => handleViewModeChange('cards')}
              className={viewMode === 'cards' ? 'bg-muted' : ''}
            >
              <Grid className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {showAdvancedFilters && (
          <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
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
            <div className="flex items-center justify-end">
              <Button variant="outline" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent className="p-0">
        {viewMode === 'table' ? (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox 
                      checked={selectedDrones.size > 0 && selectedDrones.size === sortedDrones.length}
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all drones"
                    />
                  </TableHead>
                  <TableHead className="w-12">ID</TableHead>
                  <TableHead className="cursor-pointer" onClick={() => handleSort('quadName')}>
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
                  <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>
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
                {sortedDrones.length > 0 ? (
                  sortedDrones.map((drone) => (
                    <TableRow key={drone.id}>
                      <TableCell>
                        <Checkbox 
                          checked={selectedDrones.has(drone.id)}
                          onCheckedChange={() => handleSelectDrone(drone.id)}
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
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
            {sortedDrones.length > 0 ? (
              sortedDrones.map((drone) => (
                <Card key={drone.id} className={`overflow-hidden transition-all hover:shadow-md ${getStatusColor(drone)}`}>
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <Checkbox 
                            checked={selectedDrones.has(drone.id)}
                            onCheckedChange={() => handleSelectDrone(drone.id)}
                            aria-label={`Select drone ${drone.quadName}`}
                          />
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
        )}
      </CardContent>
      <CardFooter className="flex justify-between p-4 border-t">
        <div>
          {selectedDrones.size > 0 && (
            <span className="text-sm text-muted-foreground">
              {selectedDrones.size} drone{selectedDrones.size !== 1 ? 's' : ''} selected
            </span>
          )}
        </div>
        <div className="text-sm text-muted-foreground">
          Showing {sortedDrones.length} of {drones.length} drones
        </div>
      </CardFooter>
    </Card>
  );
};

export default DroneList;
