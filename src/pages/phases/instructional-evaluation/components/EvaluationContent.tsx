
import React from 'react';
import { TabsContent } from "@/components/ui/tabs";
import { InstructionalShiftEvaluationData } from '@/types';
import LockedEvaluation from './LockedEvaluation';
import InstructionalShiftEvaluationForm from '../InstructionalShiftEvaluationForm';

interface EvaluationContentProps {
  evaluationIndex: number;
  evaluationData: InstructionalShiftEvaluationData;
  completedEvaluations: number[];
  isSubmitting: boolean;
  handleChange: <K extends keyof InstructionalShiftEvaluationData>(
    field: K, 
    value: InstructionalShiftEvaluationData[K]
  ) => void;
  handleClinicalScoreChange: (
    field: keyof InstructionalShiftEvaluationData['clinical_performance'],
    value: any
  ) => void;
  handleOperationalScoreChange: (
    field: keyof InstructionalShiftEvaluationData['operational_performance'],
    value: any
  ) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
}

const EvaluationContent: React.FC<EvaluationContentProps> = ({
  evaluationIndex,
  evaluationData,
  completedEvaluations,
  isSubmitting,
  handleChange,
  handleClinicalScoreChange,
  handleOperationalScoreChange,
  handleSubmit,
  handleSaveDraft
}) => {
  const evaluationNumber = evaluationIndex + 1;
  const isLocked = evaluationNumber > 1 && !completedEvaluations.includes(evaluationNumber - 2);
  
  return (
    <TabsContent key={`content-evaluation${evaluationNumber}`} value={`evaluation${evaluationNumber}`} className="mt-4">
      {isLocked ? (
        <LockedEvaluation evaluationNumber={evaluationNumber} />
      ) : (
        <div className="rounded-lg border p-3 md:p-4">
          <h3 className="font-medium mb-3 text-primary-700">Shift Evaluation {evaluationNumber}</h3>
          <p className="text-sm text-gray-600 mb-4">Complete the evaluation for Shift {evaluationNumber}</p>
          <InstructionalShiftEvaluationForm
            evaluationData={evaluationData}
            handleChange={(field, value) => handleChange(field, value)}
            handleClinicalScoreChange={(field, value) => handleClinicalScoreChange(field, value)}
            handleOperationalScoreChange={(field, value) => handleOperationalScoreChange(field, value)}
            handleSubmit={handleSubmit}
            handleSaveDraft={handleSaveDraft}
            shiftNumber={evaluationNumber}
            isSubmitting={isSubmitting}
          />
        </div>
      )}
    </TabsContent>
  );
};

export default EvaluationContent;
