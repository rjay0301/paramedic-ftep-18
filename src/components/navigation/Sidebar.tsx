
import React, { useState, useEffect } from 'react';
import { PhaseItem } from '@/types';
import { useAuth } from '@/contexts/auth';
import { isPhaseAccessible, isAddendumPhase } from '@/utils/validation';
import SidebarHeader from './SidebarHeader';
import SidebarNavLinks from './SidebarNavLinks';
import SidebarPhaseList from './SidebarPhaseList';
import { useIsMobile } from '@/hooks/use-mobile';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  phases: PhaseItem[];
  phase2Items?: PhaseItem[];
  onPhaseSelect: (phase: PhaseItem) => void;
  completedPhases?: string[];
}

const Sidebar: React.FC<SidebarProps> = ({ 
  isOpen, 
  onClose, 
  phases, 
  phase2Items = [],
  onPhaseSelect,
  completedPhases = []
}) => {
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [isVisible, setIsVisible] = useState(isOpen);
  
  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);
  
  const phasesWithLockState = phases.map(phase => ({
    ...phase,
    locked: !isAddendumPhase(phase.id) && !isPhaseAccessible(phase.id, completedPhases)
  }));
  
  const handleClose = () => {
    setIsVisible(false);
    onClose();
  };
  
  return (
    <>
      {isVisible && !isMobile && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 md:bg-transparent"
          onClick={handleClose}
        />
      )}
      
      {isVisible && isMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={handleClose}
        />
      )}
      
      <aside 
        className={`fixed top-0 left-0 z-50 w-80 h-full bg-navy border-r border-navy/30 pt-16 transform transition-transform duration-300 ease-in-out ${
          isVisible ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <SidebarHeader onClose={handleClose} />
        
        <div className="overflow-y-auto h-full pb-20">
          <nav className="p-4 space-y-1">
            <SidebarNavLinks onClose={handleClose} />
            
            <SidebarPhaseList 
              phases={phasesWithLockState} 
              onPhaseSelect={onPhaseSelect}
              onClose={handleClose}
            />
          </nav>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
