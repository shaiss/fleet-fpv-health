
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SlidersHorizontal, ChevronDown, RotateCcw } from 'lucide-react';
import { DroneData } from '@/utils/csvParser';
import { ColumnFilter } from '@/hooks/useDroneFilter';

interface ColumnFiltersProps {
  columnFilters: ColumnFilter[];
  setColumnFilters: (filters: ColumnFilter[]) => void;
  uniqueValues: Record<string, string[]>;
  resetFilters: () => void;
  filtersActive: boolean;
}

const ColumnFilters: React.FC<ColumnFiltersProps> = ({
  columnFilters,
  setColumnFilters,
  uniqueValues,
  resetFilters,
  filtersActive,
}) => {
  const getColumnFilterValue = (column: keyof DroneData | 'all') => {
    const filter = columnFilters.find(f => f.column === column);
    return filter ? filter.value : '';
  };

  const handleColumnFilterChange = (column: keyof DroneData | 'all', value: string) => {
    if (value === 'all-values') {
      setColumnFilters(columnFilters.filter(f => f.column !== column));
    } else {
      const newFilters = columnFilters.filter(f => f.column !== column);
      newFilters.push({ column, value });
      setColumnFilters(newFilters);
    }
  };

  const filterColumns: (keyof DroneData)[] = [
    'type', 'batteryType', 'camera', 'flightTest', 'readyForFieldTesting'
  ];

  const getColumnLabel = (column: keyof DroneData): string => {
    const columnLabels: Partial<Record<keyof DroneData, string>> = {
      id: 'ID',
      quadName: 'Quad Name',
      camera: 'Camera',
      type: 'Type',
      batteryType: 'Battery Type',
      flightTest: 'Flight Test',
      readyForFieldTesting: 'Field Ready',
      notes: 'Notes',
      propSize: 'Prop Size',
      vtx: 'VTX',
      rcReceiver: 'RC Receiver',
      transmitter: 'Transmitter',
      externalTransmitter: 'External Transmitter',
      txModelNum: 'TX Model Number',
      videoChannel: 'Video Channel'
    };
    
    return columnLabels[column] || String(column);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-1">
          <SlidersHorizontal className="h-4 w-4" />
          Columns
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Filter By Column</DropdownMenuLabel>
        <div className="max-h-[70vh] overflow-auto">
          {filterColumns.map((column) => (
            <div key={column} className="px-2 py-1.5">
              <div className="mb-1 text-xs font-semibold">{getColumnLabel(column)}</div>
              <Select
                value={getColumnFilterValue(column) || 'all-values'}
                onValueChange={(value) => handleColumnFilterChange(column, value)}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue placeholder={`All ${getColumnLabel(column)}s`} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-values">All Values</SelectItem>
                  {uniqueValues[column]?.map((value) => (
                    <SelectItem key={`${column}-${value}`} value={value || 'empty'}>
                      {value || '(Empty)'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
        {filtersActive && (
          <div className="mt-2 px-2 pb-2">
            <Button variant="outline" size="sm" onClick={resetFilters} className="w-full gap-2">
              <RotateCcw className="h-3 w-3" />
              Reset All Filters
            </Button>
          </div>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ColumnFilters;
