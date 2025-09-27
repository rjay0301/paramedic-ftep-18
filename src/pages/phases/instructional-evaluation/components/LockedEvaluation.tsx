
import React from 'react';
import { Lock } from 'lucide-react';

interface LockedEvaluationProps {
  evaluationNumber: number;
}

const LockedEvaluation: React.FC<LockedEvaluationProps> = ({ evaluationNumber }) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center">
      <Lock className="h-10 w-10 text-gray-400 mb-3" />
      <h3 className="text-lg font-medium">Shift Evaluation {evaluationNumber} is Locked</h3>
      <p className="text-gray-500 mt-2 text-sm">
        You need to complete Shift Evaluation {evaluationNumber - 1} before you can access Shift Evaluation {evaluationNumber}.
      </p>
    </div>
  );
};

export default LockedEvaluation;
