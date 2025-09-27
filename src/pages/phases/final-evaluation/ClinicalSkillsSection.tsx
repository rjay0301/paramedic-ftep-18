
import React from 'react';
import { ClinicalSkillEvaluation, ClinicalSkillScore } from '@/types/finalEvaluation';
import ScoreOption from './ScoreOption';
import { useIsMobile } from '@/hooks/use-mobile';

interface ClinicalSkillsSectionProps {
  formData: {
    sceneSizeUp: ClinicalSkillEvaluation;
    initialAssessment: ClinicalSkillEvaluation;
    focusedHistory: ClinicalSkillEvaluation;
    physicalExam: ClinicalSkillEvaluation;
    vitalSigns: ClinicalSkillEvaluation;
    problemIdentification: ClinicalSkillEvaluation;
    treatmentProcedures: ClinicalSkillEvaluation;
    ongoingAssessment: ClinicalSkillEvaluation;
    liftingMoving: ClinicalSkillEvaluation;
    informationTransfer: ClinicalSkillEvaluation;
  };
  onChange: (field: string, value: any) => void;
}

const ClinicalSkillsSection: React.FC<ClinicalSkillsSectionProps> = ({
  formData,
  onChange,
}) => {
  const isMobile = useIsMobile();
  
  const handleScoreChange = (field: string, score: ClinicalSkillScore) => {
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

  // Clinical skill descriptions
  const clinicalSkillDescriptions = {
    sceneSizeUp: [
      "Potentially dangerous action",
      "Major action missed",
      "Several minor actions missed",
      "Minor action missed",
      "All actions taken"
    ],
    initialAssessment: [
      "Dangerous assessment or intervention",
      "Major point missed or incorrect",
      "Several minor points missed",
      "Minor point missed",
      "Assessment complete & correct"
    ],
    focusedHistory: [
      "History not attempted",
      "3+ questions not asked",
      "1-2 questions not asked",
      "All questions asked",
      "Complete with additional questions"
    ],
    physicalExam: [
      "No exam performed",
      "Minimal exam",
      "Several areas missed",
      "Not systematic, almost complete",
      "Thorough, complete, systematic"
    ],
    vitalSigns: [
      "1 or no vitals taken",
      "3-4 vitals missed",
      "2 vitals missed",
      "1 vital missed or no confirmation",
      "All vitals taken, confirmation asked"
    ],
    problemIdentification: [
      "Unable to interpret findings",
      "Poor interpretation",
      "Reasonable interpretation",
      "Good interpretation",
      "Excellent interpretation, extra skill"
    ],
    treatmentProcedures: [
      "No treatment when required",
      "Minimal treatment",
      "Additional treatment required",
      "Treatment correct & complete",
      "Correct & extra comfort measures"
    ],
    ongoingAssessment: [
      "No exam performed",
      "Minimal assessment",
      "Several areas missed",
      "Not systematic, almost complete",
      "Thorough, complete, systematic"
    ],
    liftingMoving: [
      "Unsafe lifting/moving",
      "Rough or caused discomfort",
      "Could be better for comfort",
      "Safe but straps not buckled",
      "Safe & straps buckled"
    ],
    informationTransfer: [
      "",
      "Minimum information given",
      "Minimum missed or not systematic",
      "Complete but with hesitation",
      "Thorough, quick, correct"
    ]
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Clinical Skills Evaluation Matrix</h3>
      
      <div className="space-y-4">
        <div className={`${isMobile ? 'flex justify-center' : 'grid grid-cols-3 gap-2'} mb-2`}>
          <div className={`${isMobile ? 'text-center mb-2 w-full' : 'col-span-1'}`}>
            <span className="text-sm font-medium">Skill Category</span>
          </div>
          {!isMobile && (
            <div className="col-span-2">
              <div className="grid grid-cols-5 gap-1">
                <div className="text-center text-xs">1</div>
                <div className="text-center text-xs">2</div>
                <div className="text-center text-xs">3</div>
                <div className="text-center text-xs">4</div>
                <div className="text-center text-xs">5</div>
              </div>
            </div>
          )}
          {isMobile && (
            <div className="flex justify-between w-full px-4 mb-1">
              <div className="text-xs">1</div>
              <div className="text-xs">2</div>
              <div className="text-xs">3</div>
              <div className="text-xs">4</div>
              <div className="text-xs">5</div>
            </div>
          )}
        </div>
        
        <div className="space-y-6">
          {isMobile ? (
            <>
              {/* Mobile view for clinical skills */}
              <div className="space-y-6">
                <div>
                  <div className="text-sm font-medium">1. Scene Size-up/Survey</div>
                  <ScoreOption 
                    id="sceneSizeUp"
                    value={formData.sceneSizeUp.score}
                    practiceLevel={formData.sceneSizeUp.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('sceneSizeUp', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('sceneSizeUp', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">2. Initial Assessment</div>
                  <ScoreOption 
                    id="initialAssessment"
                    value={formData.initialAssessment.score}
                    practiceLevel={formData.initialAssessment.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('initialAssessment', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('initialAssessment', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">3. Focused History</div>
                  <ScoreOption 
                    id="focusedHistory"
                    value={formData.focusedHistory.score}
                    practiceLevel={formData.focusedHistory.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('focusedHistory', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('focusedHistory', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">4. Physical Exam</div>
                  <ScoreOption 
                    id="physicalExam"
                    value={formData.physicalExam.score}
                    practiceLevel={formData.physicalExam.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('physicalExam', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('physicalExam', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">5. Vital Signs</div>
                  <ScoreOption 
                    id="vitalSigns"
                    value={formData.vitalSigns.score}
                    practiceLevel={formData.vitalSigns.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('vitalSigns', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('vitalSigns', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">6. Problem Identification</div>
                  <ScoreOption 
                    id="problemIdentification"
                    value={formData.problemIdentification.score}
                    practiceLevel={formData.problemIdentification.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('problemIdentification', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('problemIdentification', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">7. Treatment Procedures</div>
                  <ScoreOption 
                    id="treatmentProcedures"
                    value={formData.treatmentProcedures.score}
                    practiceLevel={formData.treatmentProcedures.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('treatmentProcedures', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('treatmentProcedures', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">8. Ongoing Assessment</div>
                  <ScoreOption 
                    id="ongoingAssessment"
                    value={formData.ongoingAssessment.score}
                    practiceLevel={formData.ongoingAssessment.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('ongoingAssessment', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('ongoingAssessment', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">9. Lifting and Moving</div>
                  <ScoreOption 
                    id="liftingMoving"
                    value={formData.liftingMoving.score}
                    practiceLevel={formData.liftingMoving.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('liftingMoving', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('liftingMoving', level)}
                    maxScore={5}
                  />
                </div>
                
                <div>
                  <div className="text-sm font-medium">10. Information Transfer</div>
                  <ScoreOption 
                    id="informationTransfer"
                    value={formData.informationTransfer.score}
                    practiceLevel={formData.informationTransfer.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('informationTransfer', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('informationTransfer', level)}
                    maxScore={5}
                  />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Desktop view for clinical skills */}
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">1. Scene Size-up/Survey</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="sceneSizeUp"
                    value={formData.sceneSizeUp.score}
                    practiceLevel={formData.sceneSizeUp.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('sceneSizeUp', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('sceneSizeUp', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">2. Initial Assessment</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="initialAssessment"
                    value={formData.initialAssessment.score}
                    practiceLevel={formData.initialAssessment.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('initialAssessment', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('initialAssessment', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">3. Focused History</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="focusedHistory"
                    value={formData.focusedHistory.score}
                    practiceLevel={formData.focusedHistory.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('focusedHistory', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('focusedHistory', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">4. Physical Exam</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="physicalExam"
                    value={formData.physicalExam.score}
                    practiceLevel={formData.physicalExam.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('physicalExam', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('physicalExam', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">5. Vital Signs</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="vitalSigns"
                    value={formData.vitalSigns.score}
                    practiceLevel={formData.vitalSigns.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('vitalSigns', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('vitalSigns', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">6. Problem Identification</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="problemIdentification"
                    value={formData.problemIdentification.score}
                    practiceLevel={formData.problemIdentification.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('problemIdentification', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('problemIdentification', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">7. Treatment Procedures</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="treatmentProcedures"
                    value={formData.treatmentProcedures.score}
                    practiceLevel={formData.treatmentProcedures.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('treatmentProcedures', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('treatmentProcedures', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">8. Ongoing Assessment</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="ongoingAssessment"
                    value={formData.ongoingAssessment.score}
                    practiceLevel={formData.ongoingAssessment.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('ongoingAssessment', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('ongoingAssessment', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">9. Lifting and Moving</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="liftingMoving"
                    value={formData.liftingMoving.score}
                    practiceLevel={formData.liftingMoving.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('liftingMoving', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('liftingMoving', level)}
                    maxScore={5}
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 items-center">
                <div className="text-sm">10. Information Transfer</div>
                <div className="col-span-2">
                  <ScoreOption 
                    id="informationTransfer"
                    value={formData.informationTransfer.score}
                    practiceLevel={formData.informationTransfer.practiceLevel}
                    onScoreChange={(score) => handleScoreChange('informationTransfer', score as ClinicalSkillScore)}
                    onPracticeLevelChange={(level) => handlePracticeLevelChange('informationTransfer', level)}
                    maxScore={5}
                  />
                </div>
              </div>
            </>
          )}
        </div>
        
        <div className="flex justify-end">
          <div className="bg-gray-100 px-4 py-2 rounded">
            <span className="font-medium">Total Clinical Score:</span> {calculateTotal()}/50
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSkillsSection;
