
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wrench } from 'lucide-react';

interface ActionButtonsProps {
  isFixing: boolean;
  isRefreshing: boolean;
  onFixProgress: () => void;
  onRefreshProgress: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  isFixing, 
  isRefreshing, 
  onFixProgress, 
  onRefreshProgress 
}) => {
  return (
    <div className="flex space-x-2">
      <Button 
        variant="outline"
        size="sm"
        onClick={onFixProgress}
        disabled={isFixing}
      >
        <Wrench className={`h-4 w-4 mr-2 ${isFixing ? 'animate-spin' : ''}`} />
        {isFixing ? 'Fixing...' : 'Fix Progress'}
      </Button>
      <Button 
        variant="outline"
        size="sm"
        onClick={onRefreshProgress}
        disabled={isRefreshing}
      >
        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
        {isRefreshing ? 'Refreshing...' : 'Refresh Progress'}
      </Button>
    </div>
  );
};

export default ActionButtons;
