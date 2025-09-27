
import React from 'react';
import { OperationalSkillEvaluation, OperationalSkillScore } from '@/types/finalEvaluation';
import ScoreOption from './ScoreOption';

interface OperationalSkillsSectionProps {
  formData: {
    standardOperatingProcedures: OperationalSkillEvaluation;
    safety: OperationalSkillEvaluation;
    startOfShiftProcedures: OperationalSkillEvaluation;
    endOfShiftProcedures: OperationalSkillEvaluation;
    radioCommunications: OperationalSkillEvaluation;
    storesAndRestock: OperationalSkillEvaluation;
    systemKnowledge: OperationalSkillEvaluation;
  };
  onChange: (field: string, value: any) => void;
}

const OperationalSkillsSection: React.FC<OperationalSkillsSectionProps> = ({
  formData,
  onChange,
}) => {
  const handleScoreChange = (field: string, score: OperationalSkillScore) => {
    onChange(field, {
      ...formData[field as keyof typeof formData],
      score,
    });
  };

  const handlePracticeLevelChange = (field: string, practiceLevel: string) => {
    onChange(field, {
      ...formData[field as keyof typeof formData],
      practiceLevel,
    });
  };

  const calculateTotal = () => {
    return Object.values(formData).reduce((total, skill) => {
      return total + (skill.score || 0);
    }, 0);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Operational Skills Evaluation Matrix</h3>
      
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-2">
          <div className="col-span-1">
            <span className="text-sm font-medium">Skill Category</span>
          </div>
          <div className="col-span-1 md:col-span-2">
            <div className="grid grid-cols-3 gap-1">
              <div className="text-center text-xs">1</div>
              <div className="text-center text-xs">2</div>
              <div className="text-center text-xs">3</div>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">1. Standard Operating Procedures</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="standardOperatingProcedures"
                value={formData.standardOperatingProcedures.score}
                practiceLevel={formData.standardOperatingProcedures.practiceLevel}
                onScoreChange={(score) => handleScoreChange('standardOperatingProcedures', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('standardOperatingProcedures', level)}
                maxScore={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">2. Safety</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="safety"
                value={formData.safety.score}
                practiceLevel={formData.safety.practiceLevel}
                onScoreChange={(score) => handleScoreChange('safety', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('safety', level)}
                maxScore={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">3. Start of Shift Procedures</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="startOfShiftProcedures"
                value={formData.startOfShiftProcedures.score}
                practiceLevel={formData.startOfShiftProcedures.practiceLevel}
                onScoreChange={(score) => handleScoreChange('startOfShiftProcedures', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('startOfShiftProcedures', level)}
                maxScore={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">4. End of Shift Procedures</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="endOfShiftProcedures"
                value={formData.endOfShiftProcedures.score}
                practiceLevel={formData.endOfShiftProcedures.practiceLevel}
                onScoreChange={(score) => handleScoreChange('endOfShiftProcedures', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('endOfShiftProcedures', level)}
                maxScore={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">5. Radio Communications</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="radioCommunications"
                value={formData.radioCommunications.score}
                practiceLevel={formData.radioCommunications.practiceLevel}
                onScoreChange={(score) => handleScoreChange('radioCommunications', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('radioCommunications', level)}
                maxScore={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">6. Stores and Restock</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="storesAndRestock"
                value={formData.storesAndRestock.score}
                practiceLevel={formData.storesAndRestock.practiceLevel}
                onScoreChange={(score) => handleScoreChange('storesAndRestock', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('storesAndRestock', level)}
                maxScore={3}
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 items-center">
            <div className="text-sm">7. System Knowledge</div>
            <div className="col-span-1 md:col-span-2">
              <ScoreOption 
                id="systemKnowledge"
                value={formData.systemKnowledge.score}
                practiceLevel={formData.systemKnowledge.practiceLevel}
                onScoreChange={(score) => handleScoreChange('systemKnowledge', score as OperationalSkillScore)}
                onPracticeLevelChange={(level) => handlePracticeLevelChange('systemKnowledge', level)}
                maxScore={3}
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-end">
          <div className="bg-gray-100 px-4 py-2 rounded">
            <span className="font-medium">Total Operational Score:</span> {calculateTotal()}/21
          </div>
        </div>
      </div>
    </div>
  );
};

export default OperationalSkillsSection;
