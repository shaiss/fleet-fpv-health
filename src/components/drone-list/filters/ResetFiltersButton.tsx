
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw } from 'lucide-react';

interface ResetFiltersButtonProps {
  resetFilters: () => void;
  title?: string;
}

const ResetFiltersButton: React.FC<ResetFiltersButtonProps> = ({
  resetFilters,
  title = "Reset all filters",
}) => {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={resetFilters} 
      title={title}
    >
      <RotateCcw className="h-4 w-4" />
    </Button>
  );
};

export default ResetFiltersButton;
