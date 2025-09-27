import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Save, CheckSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import SignatureField from '@/components/common/SignatureField';
import { IndependentShiftEvaluationData, ClinicalAssessment, OperationalAssessment } from '@/types/independentEvaluation';
import { EvaluationScore } from '@/types';
import ScoreSelector from './ScoreSelector';

interface IndependentShiftEvaluationFormProps {
  evaluationData: IndependentShiftEvaluationData;
  handleChange: (field: keyof IndependentShiftEvaluationData, value: any) => void;
  handleClinicalAssessmentChange: (field: keyof ClinicalAssessment, value: EvaluationScore) => void;
  handleOperationalAssessmentChange: (field: keyof OperationalAssessment, value: EvaluationScore) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  shiftNumber: number;
  isSubmitting: boolean;
}

const IndependentShiftEvaluationForm: React.FC<IndependentShiftEvaluationFormProps> = ({
  evaluationData,
  handleChange,
  handleClinicalAssessmentChange,
  handleOperationalAssessmentChange,
  handleSubmit,
  handleSaveDraft,
  shiftNumber,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shift {shiftNumber} Evaluation</CardTitle>
          <CardDescription>
            Document performance evaluation at the end of shift
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 mb-4">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !evaluationData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {evaluationData.date ? format(new Date(evaluationData.date), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={evaluationData.date ? new Date(evaluationData.date) : undefined}
                  onSelect={(date) => handleChange('date', date?.toISOString() || null)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="p-3 bg-blue-50 rounded-md text-sm mb-6">
            <p><strong>Guidelines for Use:</strong> The shift performance evaluation must be completed before the end of the shift. Please refer to the Performance Anchors (Appendix A) in order to objectively score the student. It is not an average score, the lowest performance must be recorded.</p>
            <p className="mt-2"><strong>Example:</strong> If a student has good communication with three patients and then is aggressive and rude to the last patient of the day, the score for "Patient Communication" would be a '1' for the day. The good performance on the first three patients can be noted in the FTP feedback section below. Poor performance from a past shift should not be considered in this shift's ratings.</p>
            <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="text-center p-1 bg-green-100 rounded">
                <p className="font-bold">3</p>
                <p className="text-xs">Always Meets Standards</p>
              </div>
              <div className="text-center p-1 bg-yellow-100 rounded">
                <p className="font-bold">2</p>
                <p className="text-xs">Usually Meets Standards - Not Harmful</p>
              </div>
              <div className="text-center p-1 bg-red-100 rounded">
                <p className="font-bold">1</p>
                <p className="text-xs">Does Not Meet Standards - Potential or Actual Harm</p>
              </div>
              <div className="text-center p-1 bg-gray-100 rounded">
                <p className="font-bold">N.P.</p>
                <p className="text-xs">Not Performed During the Shift</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Clinical Performance Assessment</CardTitle>
          <CardDescription>
            3 = Always Meets Standards | 2 = Usually Meets Standards - Not Harmful | 1 = Does Not Meet Standards - Potential or Actual Harm | N.P. = Not Performed During the Shift
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreSelector
            label="1. Patient Assessment"
            value={evaluationData.clinical_assessment.patientAssessment}
            onChange={(value) => handleClinicalAssessmentChange('patientAssessment', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="2. Assessment Skills"
            value={evaluationData.clinical_assessment.assessmentSkills}
            onChange={(value) => handleClinicalAssessmentChange('assessmentSkills', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="3. History Taking"
            value={evaluationData.clinical_assessment.historyTaking}
            onChange={(value) => handleClinicalAssessmentChange('historyTaking', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="4. NCC and CTL Update"
            value={evaluationData.clinical_assessment.nccCtlUpdate}
            onChange={(value) => handleClinicalAssessmentChange('nccCtlUpdate', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="5. Scene Control / Size Up"
            value={evaluationData.clinical_assessment.sceneControl}
            onChange={(value) => handleClinicalAssessmentChange('sceneControl', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="6. Patient Movement"
            value={evaluationData.clinical_assessment.patientMovement}
            onChange={(value) => handleClinicalAssessmentChange('patientMovement', value as EvaluationScore)}
          />
          
          <div className="py-2">
            <h3 className="font-medium mb-2">7. Clinical Decision Making</h3>
            
            <div className="pl-4 border-l-2 border-gray-200 space-y-3">
              <ScoreSelector
                label="a. Provisional Diagnosis"
                value={evaluationData.clinical_assessment.provisionalDiagnosis}
                onChange={(value) => handleClinicalAssessmentChange('provisionalDiagnosis', value as EvaluationScore)}
              />
              
              <ScoreSelector
                label="b. Recognizing Severity"
                value={evaluationData.clinical_assessment.recognizingSeverity}
                onChange={(value) => handleClinicalAssessmentChange('recognizingSeverity', value as EvaluationScore)}
              />
              
              <ScoreSelector
                label="c. Treatment Plan"
                value={evaluationData.clinical_assessment.treatmentPlan}
                onChange={(value) => handleClinicalAssessmentChange('treatmentPlan', value as EvaluationScore)}
              />
              
              <ScoreSelector
                label="d. Priority to Hospital"
                value={evaluationData.clinical_assessment.priorityToHospital}
                onChange={(value) => handleClinicalAssessmentChange('priorityToHospital', value as EvaluationScore)}
              />
            </div>
          </div>
          
          <ScoreSelector
            label="8. Trauma Management"
            value={evaluationData.clinical_assessment.traumaManagement}
            onChange={(value) => handleClinicalAssessmentChange('traumaManagement', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="9. Cardiac Management"
            value={evaluationData.clinical_assessment.cardiacManagement}
            onChange={(value) => handleClinicalAssessmentChange('cardiacManagement', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="10. Medical Management"
            value={evaluationData.clinical_assessment.medicalManagement}
            onChange={(value) => handleClinicalAssessmentChange('medicalManagement', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="11. Pediatric Management"
            value={evaluationData.clinical_assessment.pediatricManagement}
            onChange={(value) => handleClinicalAssessmentChange('pediatricManagement', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="12. Airway Management"
            value={evaluationData.clinical_assessment.airwayManagement}
            onChange={(value) => handleClinicalAssessmentChange('airwayManagement', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="13. Medication Admin"
            value={evaluationData.clinical_assessment.medicationAdmin}
            onChange={(value) => handleClinicalAssessmentChange('medicationAdmin', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="14. Equipment"
            value={evaluationData.clinical_assessment.equipment}
            onChange={(value) => handleClinicalAssessmentChange('equipment', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="15. Handover"
            value={evaluationData.clinical_assessment.handover}
            onChange={(value) => handleClinicalAssessmentChange('handover', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="16. PCR Documentation"
            value={evaluationData.clinical_assessment.pcrDocumentation}
            onChange={(value) => handleClinicalAssessmentChange('pcrDocumentation', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="17. Patient Communication"
            value={evaluationData.clinical_assessment.patientCommunication}
            onChange={(value) => handleClinicalAssessmentChange('patientCommunication', value as EvaluationScore)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Operational Performance Assessment</CardTitle>
          <CardDescription>
            3 = Always Meets Standards | 2 = Usually Meets Standards - Not Harmful | 1 = Does Not Meet Standards - Potential or Actual Harm | N.P. = Not Performed During the Shift
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <ScoreSelector
            label="1. General Appearance"
            value={evaluationData.operational_assessment.generalAppearance}
            onChange={(value) => handleOperationalAssessmentChange('generalAppearance', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="2. Acceptance of Feedback"
            value={evaluationData.operational_assessment.acceptanceOfFeedback}
            onChange={(value) => handleOperationalAssessmentChange('acceptanceOfFeedback', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="3. Attitude to EMS"
            value={evaluationData.operational_assessment.attitudeToEMS}
            onChange={(value) => handleOperationalAssessmentChange('attitudeToEMS', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="4. Downtime Utilization"
            value={evaluationData.operational_assessment.downtimeUtilization}
            onChange={(value) => handleOperationalAssessmentChange('downtimeUtilization', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="5. Safety"
            value={evaluationData.operational_assessment.safety}
            onChange={(value) => handleOperationalAssessmentChange('safety', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="6. Start of Shift Procedures"
            value={evaluationData.operational_assessment.startOfShiftProcedures}
            onChange={(value) => handleOperationalAssessmentChange('startOfShiftProcedures', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="7. End of Shift Procedures"
            value={evaluationData.operational_assessment.endOfShiftProcedures}
            onChange={(value) => handleOperationalAssessmentChange('endOfShiftProcedures', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="8. Radio Communications"
            value={evaluationData.operational_assessment.radioCommunications}
            onChange={(value) => handleOperationalAssessmentChange('radioCommunications', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="9. MDT Use"
            value={evaluationData.operational_assessment.mdtUse}
            onChange={(value) => handleOperationalAssessmentChange('mdtUse', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="10. Stores and Restock"
            value={evaluationData.operational_assessment.storesAndRestock}
            onChange={(value) => handleOperationalAssessmentChange('storesAndRestock', value as EvaluationScore)}
          />
          
          <ScoreSelector
            label="11. Medication Handling"
            value={evaluationData.operational_assessment.medicationHandling}
            onChange={(value) => handleOperationalAssessmentChange('medicationHandling', value as EvaluationScore)}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>FTP Feedback</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="best-performance">Area(s) of Best Performance *</Label>
            <Textarea
              id="best-performance"
              value={evaluationData.best_performance}
              onChange={(e) => handleChange('best_performance', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="needs-improvement">Area(s) Needing Improvement *</Label>
            <Textarea
              id="needs-improvement"
              value={evaluationData.needs_improvement}
              onChange={(e) => handleChange('needs_improvement', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-3">
            <Label htmlFor="improvement-plan">Plan for Improvement or Actions Taken *</Label>
            <Textarea
              id="improvement-plan"
              value={evaluationData.improvement_plan}
              onChange={(e) => handleChange('improvement_plan', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="discussed-with-ftp"
              checked={evaluationData.discussed_with_ftp}
              onCheckedChange={(checked) => 
                handleChange('discussed_with_ftp', Boolean(checked))
              }
            />
            <Label htmlFor="discussed-with-ftp">
              Discussed with FTP
            </Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Signatures</CardTitle>
          <CardDescription>
            By signing below I am attesting that the information on this shift summary is true and correct to the best of my knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <SignatureField
            label="FTP Signature *"
            value={evaluationData.ftp_signature}
            onChange={(value) => handleChange('ftp_signature', value)}
            required
          />
          
          <SignatureField
            label="Student Signature *"
            value={evaluationData.student_signature}
            onChange={(value) => handleChange('student_signature', value)}
            required
          />
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="gap-2"
          >
            <Save size={16} />
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gap-2"
          >
            <CheckSquare size={16} />
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IndependentShiftEvaluationForm;
