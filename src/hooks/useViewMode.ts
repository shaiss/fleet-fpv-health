
import { useState } from 'react';

export type ViewMode = 'table' | 'cards';

interface UseViewModeResult {
  viewMode: ViewMode;
  handleViewModeChange: (mode: ViewMode) => void;
  showAdvancedFilters: boolean;
  setShowAdvancedFilters: (show: boolean) => void;
}

export const useViewMode = (defaultMode: ViewMode = 'cards'): UseViewModeResult => {
  const [viewMode, setViewMode] = useState<ViewMode>(defaultMode);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  return {
    viewMode,
    handleViewModeChange,
    showAdvancedFilters,
    setShowAdvancedFilters
  };
};
