
import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { PhaseItem } from '@/types';
import { isPhaseAccessible } from '@/utils/validation';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import PhaseCard from './PhaseCard';
import { Button } from '@/components/ui/button';

interface PhaseGridProps {
  phases: PhaseItem[];
  completedPhases: string[];
  onPhaseSelect: (phase: PhaseItem) => void;
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
}

const PhaseGrid: React.FC<PhaseGridProps> = ({ 
  phases, 
  completedPhases,
  onPhaseSelect,
  loading = false,
  error = null,
  onRetry
}) => {
  const navigate = useNavigate();

  const handlePhaseSelect = (phase: PhaseItem) => {
    const isLocked = !isPhaseAccessible(phase.id, completedPhases);
    
    if (isLocked) {
      toast.error("This phase is locked. Complete the previous phases to unlock it.");
      return;
    }
    
    // Special handling for assignments phase
    if (phase.id === 'assignments') {
      navigate('/phases/assignments');
      return;
    }
    
    onPhaseSelect(phase);
  };

  // Filter out addendum phases for the dashboard view
  const dashboardPhases = phases.filter(phase => 
    !phase.id.includes('copy-') && 
    !phase.id.startsWith('instructional-copy-') && 
    !phase.id.startsWith('independent-copy-')
  );

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center my-4">
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-3" />
        <h3 className="font-medium text-red-800 mb-2">Error Loading Phases</h3>
        <p className="text-red-700 mb-4">{error}</p>
        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="bg-white">
            <RefreshCw className="mr-2 h-4 w-4" /> Try Again
          </Button>
        )}
      </div>
    );
  }

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="bg-gray-100 animate-pulse rounded-xl h-24"></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {dashboardPhases.map(phase => {
        const isLocked = !isPhaseAccessible(phase.id, completedPhases);
        const isComplete = phase.completed === phase.total && phase.total > 0;
        
        return (
          <PhaseCard
            key={phase.id}
            phase={phase}
            isLocked={isLocked}
            isComplete={isComplete}
            onClick={() => handlePhaseSelect(phase)}
          />
        );
      })}
      
      {dashboardPhases.length === 0 && (
        <div className="col-span-2 p-6 text-center bg-gray-50 rounded-xl">
          <p className="text-gray-500">No phases available</p>
        </div>
      )}
    </div>
  );
};

export default PhaseGrid;
