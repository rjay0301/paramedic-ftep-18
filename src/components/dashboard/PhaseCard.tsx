
import React from 'react';
import { ChevronRight, Lock, CheckCircle, FileText } from 'lucide-react';
import { PhaseItem } from '@/types';
import { isPhaseAccessible } from '@/utils/validation';
import { Progress } from '@/components/ui/progress';

interface PhaseCardProps {
  phase: PhaseItem;
  isLocked: boolean;
  isComplete: boolean;
  onClick: () => void;
}

const PhaseCard: React.FC<PhaseCardProps> = ({ 
  phase,
  isLocked, 
  isComplete,
  onClick
}) => {
  const progressValue = phase.total ? ((phase.completed || 0) / phase.total) * 100 : 0;
  
  return (
    <div 
      className={`bg-white rounded-xl shadow-md p-5 transition-all duration-200 ${isLocked ? 'opacity-80' : 'card-hover cursor-pointer hover:border-primary-300 hover:shadow-lg'}`}
      onClick={onClick}
      data-testid={`phase-card-${phase.id}`}
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center">
          {isComplete ? (
            <CheckCircle size={20} className="text-green-500 mr-2" />
          ) : isLocked ? (
            <Lock size={20} className="text-yellow-500 mr-2" />
          ) : (
            <FileText size={20} className="text-primary-500 mr-2" />
          )}
          <h3 className={`font-medium ${isLocked ? 'text-gray-500' : 'text-primary-700'}`}>
            {phase.name}
          </h3>
        </div>
        {!isLocked && <ChevronRight size={18} className="text-gray-400" />}
      </div>
      <Progress 
        value={progressValue} 
        className={`h-3 mb-2 ${isComplete ? 'bg-green-500' : ''}`}
      />
      <div className="flex justify-between text-sm text-gray-600">
        <span>{phase.completed || 0}/{phase.total || 0} completed</span>
        <span>{Math.round(progressValue)}%</span>
      </div>
    </div>
  );
};

export default PhaseCard;
