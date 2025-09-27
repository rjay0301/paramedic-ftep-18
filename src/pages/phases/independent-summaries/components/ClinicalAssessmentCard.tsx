
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { ScoreItem } from './ScoreComponents';
import { ClinicalAssessment } from '@/types/independentSummaries';
import { EvaluationScore } from '@/types';

interface ClinicalAssessmentCardProps {
  clinicalAssessment: ClinicalAssessment;
  handleClinicalAssessmentChange: (field: keyof ClinicalAssessment, value: EvaluationScore) => void;
}

const ClinicalAssessmentCard: React.FC<ClinicalAssessmentCardProps> = ({
  clinicalAssessment,
  handleClinicalAssessmentChange,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Clinical Self Assessment</CardTitle>
        <CardDescription>
          3 = Always Meets Standards | 2 = Usually Meets Standards - Not Harmful | 1 = Does Not Meet Standards - Potential or Actual Harm | N.P. = Not Performed During the Shift
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <ScoreItem 
            label="1. Patient Assessment" 
            field="patientAssessment" 
            value={clinicalAssessment.patientAssessment} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="2. Assessment Skills" 
            field="assessmentSkills" 
            value={clinicalAssessment.assessmentSkills} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="3. History Taking" 
            field="historyTaking" 
            value={clinicalAssessment.historyTaking} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="4. NCC and CTL Update" 
            field="nccCtlUpdate" 
            value={clinicalAssessment.nccCtlUpdate} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="5. Scene Control" 
            field="sceneControl" 
            value={clinicalAssessment.sceneControl} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="6. Patient Movement" 
            field="patientMovement" 
            value={clinicalAssessment.patientMovement} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <div className="pl-4 border-l-2 border-gray-200 ml-2 space-y-4">
            <h3 className="font-medium text-sm">7. Clinical Decision Making</h3>
            
            <ScoreItem 
              label="a. Provisional Diagnosis" 
              field="provisionalDiagnosis" 
              value={clinicalAssessment.provisionalDiagnosis} 
              onChange={handleClinicalAssessmentChange} 
            />
            
            <ScoreItem 
              label="b. Recognizing Severity" 
              field="recognizingSeverity" 
              value={clinicalAssessment.recognizingSeverity} 
              onChange={handleClinicalAssessmentChange} 
            />
            
            <ScoreItem 
              label="c. Treatment Plan" 
              field="treatmentPlan" 
              value={clinicalAssessment.treatmentPlan} 
              onChange={handleClinicalAssessmentChange} 
            />
            
            <ScoreItem 
              label="d. Priority to Hospital" 
              field="priorityToHospital" 
              value={clinicalAssessment.priorityToHospital} 
              onChange={handleClinicalAssessmentChange} 
            />
          </div>
          
          <ScoreItem 
            label="8. Trauma Management" 
            field="traumaManagement" 
            value={clinicalAssessment.traumaManagement} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="9. Cardiac Management" 
            field="cardiacManagement" 
            value={clinicalAssessment.cardiacManagement} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="10. Medical Management" 
            field="medicalManagement" 
            value={clinicalAssessment.medicalManagement} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="11. Pediatric Management" 
            field="pediatricManagement" 
            value={clinicalAssessment.pediatricManagement} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="12. Airway Management" 
            field="airwayManagement" 
            value={clinicalAssessment.airwayManagement} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="13. Medication Admin" 
            field="medicationAdmin" 
            value={clinicalAssessment.medicationAdmin} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="14. Equipment" 
            field="equipment" 
            value={clinicalAssessment.equipment} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="15. Handover" 
            field="handover" 
            value={clinicalAssessment.handover} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="16. PCR Documentation" 
            field="pcrDocumentation" 
            value={clinicalAssessment.pcrDocumentation} 
            onChange={handleClinicalAssessmentChange} 
          />
          
          <ScoreItem 
            label="17. Patient Communication" 
            field="patientCommunication" 
            value={clinicalAssessment.patientCommunication} 
            onChange={handleClinicalAssessmentChange} 
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default ClinicalAssessmentCard;
