
import React from 'react';
import { BarChart, AlertCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { PhaseItem } from '@/types';

interface ProgressOverviewProps {
  isUpdatingProgress: boolean;
  progressPercentage: number;
  completedForms: number;
  totalForms: number;
  error?: string | null;
}

const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  isUpdatingProgress,
  progressPercentage,
  completedForms,
  totalForms,
  error
}) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-5 card-hover">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Overall Progress</h2>
        {isUpdatingProgress ? (
          <div className="animate-spin w-5 h-5 border-2 border-primary border-t-transparent rounded-full"></div>
        ) : (
          <BarChart size={20} className="text-primary-500" />
        )}
      </div>
      
      {error ? (
        <div className="bg-red-50 p-3 rounded-md flex items-center text-sm text-red-800 mb-3">
          <AlertCircle size={16} className="text-red-500 mr-2 flex-shrink-0" />
          {error}
        </div>
      ) : (
        <>
          <Progress value={progressPercentage} className="h-4 mb-3" />
          <div className="flex justify-between text-sm text-gray-600">
            <span className="font-medium">{progressPercentage}% complete</span>
            <span>{Math.round(completedForms)}/{totalForms} forms</span>
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressOverview;
