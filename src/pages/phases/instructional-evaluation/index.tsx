
import React from 'react';
import { Tabs } from "@/components/ui/tabs";
import PageHeader from '@/components/common/PageHeader';
import EvaluationTabs from './components/EvaluationTabs';
import EvaluationContent from './components/EvaluationContent';
import { useEvaluationLogic } from './hooks/useEvaluationLogic';

const InstructionalShiftEvaluationPhase = () => {
  const {
    evaluationsData,
    activeTab,
    setActiveTab,
    isSubmitting,
    completedEvaluations,
    handleEvaluationChange,
    handleClinicalScoreChange,
    handleOperationalScoreChange,
    handleEvaluationSubmit,
    handleSaveDraft
  } = useEvaluationLogic();

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader 
          title="Instructional Shift Evaluation" 
          subtitle="Complete 6 shift evaluations. Document near the end of shift to evaluate student performance." 
        />
        
        <div className="p-4 md:p-6">
          <div className="mb-4">
            <p className="text-gray-500 text-xs md:text-sm">
              Guidelines: The shift performance evaluation must be completed before the end of the shift. 
              It is not an average score; the lowest performance must be recorded.
            </p>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <EvaluationTabs 
              activeTab={activeTab}
              completedEvaluations={completedEvaluations}
            />
            
            {Array(6).fill(null).map((_, index) => (
              <EvaluationContent
                key={`evaluation-content-${index}`}
                evaluationIndex={index}
                evaluationData={evaluationsData[index]}
                completedEvaluations={completedEvaluations}
                isSubmitting={isSubmitting}
                handleChange={(field, value) => handleEvaluationChange(index, field, value)}
                handleClinicalScoreChange={(field, value) => handleClinicalScoreChange(index, field, value)}
                handleOperationalScoreChange={(field, value) => handleOperationalScoreChange(index, field, value)}
                handleSubmit={() => handleEvaluationSubmit(index)}
                handleSaveDraft={() => handleSaveDraft(index)}
              />
            ))}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InstructionalShiftEvaluationPhase;
