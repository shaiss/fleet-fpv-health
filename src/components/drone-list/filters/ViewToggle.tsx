
import React from 'react';
import { Button } from "@/components/ui/button";
import { List, Grid } from 'lucide-react';
import { ViewMode } from '@/hooks/useViewMode';

interface ViewToggleProps {
  viewMode: ViewMode;
  handleViewModeChange: (mode: ViewMode) => void;
}

const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  handleViewModeChange,
}) => {
  return (
    <>
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
    </>
  );
};

export default ViewToggle;
