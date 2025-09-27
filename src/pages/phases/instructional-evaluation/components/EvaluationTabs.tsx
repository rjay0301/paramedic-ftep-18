
import React from 'react';
import { Lock } from 'lucide-react';
import { TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';

interface EvaluationTabsProps {
  activeTab: string;
  completedEvaluations: number[];
}

const EvaluationTabs: React.FC<EvaluationTabsProps> = ({ 
  activeTab, 
  completedEvaluations 
}) => {
  const isMobile = useIsMobile();
  
  // For mobile, create a scrollable tab list that shows more tabs at once
  if (isMobile) {
    return (
      <div className="overflow-x-auto pb-2">
        <div className="flex justify-center mb-2">
          <div className="bg-muted rounded-md py-1 px-3">
            <span className="text-primary-600 font-medium">
              Shift Evaluation {parseInt(activeTab.replace('evaluation', ''))} of 6
            </span>
          </div>
        </div>
        <TabsList className="inline-flex h-auto min-w-max space-x-2 px-1">
          {Array(6).fill(null).map((_, index) => {
            const evaluationNumber = index + 1;
            const isLocked = evaluationNumber > 1 && !completedEvaluations.includes(evaluationNumber - 2);
            return (
              <TabsTrigger
                key={`evaluation${evaluationNumber}`}
                value={`evaluation${evaluationNumber}`}
                disabled={isLocked}
                className="relative w-10 h-10 flex items-center justify-center rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600"
              >
                {evaluationNumber}
                {isLocked && (
                  <Lock className="absolute right-0 top-0 h-3 w-3" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>
    );
  }
  
  // For desktop, show all tabs in a grid with better alignment
  return (
    <>
      <div className="flex justify-center mb-2">
        <div className="bg-muted rounded-md py-1 px-3">
          <span className="text-primary-600 font-medium">
            Shift Evaluation {parseInt(activeTab.replace('evaluation', ''))} of 6
          </span>
        </div>
      </div>
      <TabsList className="grid grid-cols-6 gap-2 h-auto">
        {Array(6).fill(null).map((_, index) => {
          const evaluationNumber = index + 1;
          const isLocked = evaluationNumber > 1 && !completedEvaluations.includes(evaluationNumber - 2);
          return (
            <TabsTrigger
              key={`evaluation${evaluationNumber}`}
              value={`evaluation${evaluationNumber}`}
              disabled={isLocked}
              className="relative w-10 h-10 flex items-center justify-center rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600"
            >
              {evaluationNumber}
              {isLocked && (
                <Lock className="absolute right-1 top-1 h-3 w-3" />
              )}
            </TabsTrigger>
          );
        })}
      </TabsList>
    </>
  );
};

export default EvaluationTabs;
