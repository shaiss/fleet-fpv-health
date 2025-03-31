
import React from 'react';
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronDown } from 'lucide-react';

interface StatusFilterProps {
  filterStatus: string | null;
  handleFilterChange: (filterType: string | null) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
}

const StatusFilter: React.FC<StatusFilterProps> = ({
  filterStatus,
  handleFilterChange,
  showAdvancedFilters,
  setShowAdvancedFilters,
}) => {
  return (
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
  );
};

export default StatusFilter;
