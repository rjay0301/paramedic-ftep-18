
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ChevronRight, Lock, CheckCircle } from 'lucide-react';
import { PhaseItem } from '@/types';
import { isPhaseAccessible } from '@/utils/validation';
import { toast } from 'sonner';

interface PhaseNavigationProps {
  phases: PhaseItem[];
  completedPhases: string[];
}

const PhaseNavigation: React.FC<PhaseNavigationProps> = ({ phases, completedPhases }) => {
  const navigate = useNavigate();

  const handlePhaseSelect = (phase: PhaseItem) => {
    const isLocked = !isPhaseAccessible(phase.id, completedPhases);
    
    if (isLocked) {
      toast.error("This phase is locked. Complete the previous phases to unlock it.");
      return;
    }
    
    // Special handling for assignments
    if (phase.id === 'assignments') {
      navigate('/phases/assignments');
      return;
    }
    
    navigate(`/phase/${phase.id}`);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-5 mb-6">
      <h2 className="text-lg font-semibold mb-4">Available Phases</h2>
      <div className="space-y-3">
        {phases.map(phase => {
          const isLocked = !isPhaseAccessible(phase.id, completedPhases);
          
          return (
            <div 
              key={phase.id} 
              className={`flex items-center justify-between p-3 rounded-lg border ${
                isLocked 
                  ? 'border-gray-200 bg-gray-50' 
                  : 'border-primary-100 bg-primary-50 cursor-pointer hover:bg-primary-100'
              }`}
              onClick={() => handlePhaseSelect(phase)}
              data-testid={`phase-card-${phase.id}`}
            >
              <div className="flex items-center">
                {phase.completed === phase.total ? (
                  <CheckCircle size={18} className="text-green-500 mr-2" />
                ) : isLocked ? (
                  <Lock size={18} className="text-yellow-500 mr-2" />
                ) : (
                  <Book size={18} className="text-primary-500 mr-2" />
                )}
                <span className={`font-medium ${isLocked ? 'text-gray-500' : 'text-primary-700'}`}>
                  {phase.name}
                </span>
              </div>
              {!isLocked && <ChevronRight size={16} className="text-primary-500" />}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PhaseNavigation;
