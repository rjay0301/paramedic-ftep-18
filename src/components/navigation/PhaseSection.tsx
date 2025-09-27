
import React from 'react';
import { ChevronDown, ChevronRight, FileText } from 'lucide-react';
import { PhaseItem } from '@/types';
import SidebarPhaseItem from './SidebarPhaseItem';

interface PhaseSectionProps {
  title: string;
  phases: PhaseItem[];
  expanded: boolean;
  toggleExpansion: () => void;
  onPhaseClick: (phase: PhaseItem) => void;
  icon?: React.ReactNode;
}

const PhaseSection: React.FC<PhaseSectionProps> = ({ 
  title,
  phases,
  expanded,
  toggleExpansion,
  onPhaseClick,
  icon = <FileText size={18} className="mr-2" />
}) => {
  return (
    <>
      <button
        onClick={toggleExpansion}
        className="flex items-center justify-between w-full px-3 py-2 text-left text-gray-300 hover:bg-navy/30 hover:text-white rounded-md"
      >
        <div className="flex items-center">
          {icon}
          <span className="font-medium">{title}</span>
        </div>
        {expanded ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>
      
      {expanded && (
        <div className="mt-1 ml-2 space-y-1">
          {phases.map((phase) => (
            <SidebarPhaseItem 
              key={phase.id} 
              phase={phase} 
              onClick={() => onPhaseClick(phase)}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default PhaseSection;
