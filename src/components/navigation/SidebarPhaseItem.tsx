
import React from 'react';
import { ChevronRight, Lock, Check } from 'lucide-react';
import { PhaseItem } from '@/types';
import { cn } from '@/lib/utils';

interface SidebarPhaseItemProps {
  phase: PhaseItem;
  onClick: () => void;
}

const SidebarPhaseItem: React.FC<SidebarPhaseItemProps> = ({ phase, onClick }) => {
  const isCompleted = phase.completed === phase.total;
  const isLocked = phase.locked;
  const hasProgress = phase.completed > 0 && !isCompleted;

  const itemClass = cn(
    "flex items-center justify-between w-full px-3 py-2 text-sm rounded-md transition-colors",
    isLocked 
      ? "text-gray-400 cursor-not-allowed" 
      : "text-gray-300 hover:bg-navy/20 hover:text-white cursor-pointer",
    isCompleted && !isLocked && "text-green-400",
    hasProgress && !isLocked && "text-yellow-300"
  );

  return (
    <button 
      className={itemClass}
      onClick={onClick}
      disabled={isLocked}
    >
      <div className="flex items-center">
        <span className="ml-2">{phase.name}</span>
        {isCompleted && !isLocked && (
          <span className="ml-1 text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">
            Complete
          </span>
        )}
        {hasProgress && !isLocked && (
          <span className="ml-1 text-xs bg-yellow-600 text-white px-1.5 py-0.5 rounded">
            {phase.completed}/{phase.total}
          </span>
        )}
      </div>
      {isLocked ? (
        <Lock size={14} />
      ) : isCompleted ? (
        <Check size={14} className="text-green-400" />
      ) : (
        <ChevronRight size={14} />
      )}
    </button>
  );
};

export default SidebarPhaseItem;
