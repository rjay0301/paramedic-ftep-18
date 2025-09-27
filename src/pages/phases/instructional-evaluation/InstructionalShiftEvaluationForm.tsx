import React from 'react';
import { InstructionalShiftEvaluationData, EvaluationScore } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SignatureField from '@/components/common/SignatureField';
import { Switch } from '@/components/ui/switch';

interface InstructionalShiftEvaluationFormProps {
  evaluationData: InstructionalShiftEvaluationData;
  handleChange: <K extends keyof InstructionalShiftEvaluationData>(field: K, value: InstructionalShiftEvaluationData[K]) => void;
  handleClinicalScoreChange: (field: keyof InstructionalShiftEvaluationData['clinical_performance'], value: EvaluationScore) => void;
  handleOperationalScoreChange: (field: keyof InstructionalShiftEvaluationData['operational_performance'], value: EvaluationScore) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  shiftNumber: number;
  isSubmitting: boolean;
}

const InstructionalShiftEvaluationForm: React.FC<InstructionalShiftEvaluationFormProps> = ({
  evaluationData,
  handleChange,
  handleClinicalScoreChange,
  handleOperationalScoreChange,
  handleSubmit,
  handleSaveDraft,
  shiftNumber,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Shift {shiftNumber} Information</CardTitle>
          <CardDescription>
            Fill in the basic information for this evaluation
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
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
            
            <div className="space-y-2">
              <Label htmlFor={`ftp-name-${shiftNumber}`}>FTP Name *</Label>
              <Input
                id={`ftp-name-${shiftNumber}`}
                placeholder="Enter FTP name"
                value={evaluationData.ftp_name}
                onChange={(e) => handleChange('ftp_name', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`ftp-corp-id-${shiftNumber}`}>FTP Corp ID *</Label>
              <Input
                id={`ftp-corp-id-${shiftNumber}`}
                placeholder="Enter FTP Corp ID"
                value={evaluationData.ftp_corp_id}
                onChange={(e) => handleChange('ftp_corp_id', e.target.value)}
              />
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
          <div className="space-y-4">
            <ScoreItem 
              label="1. Patient Assessment" 
              field="patientAssessment" 
              value={evaluationData.clinical_performance.patientAssessment} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="2. Assessment Skills" 
              field="assessmentSkills" 
              value={evaluationData.clinical_performance.assessmentSkills} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="3. History Taking" 
              field="historyTaking" 
              value={evaluationData.clinical_performance.historyTaking} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="4. NCC and CTL Update" 
              field="nccCtlUpdate" 
              value={evaluationData.clinical_performance.nccCtlUpdate} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="5. Scene Control" 
              field="sceneControl" 
              value={evaluationData.clinical_performance.sceneControl} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="6. Patient Movement" 
              field="patientMovement" 
              value={evaluationData.clinical_performance.patientMovement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <div className="pl-4 border-l-2 border-gray-200 ml-2 space-y-4">
              <h3 className="font-medium text-sm">7. Clinical Decision Making</h3>
              
              <ScoreItem 
                label="a. Provisional Diagnosis" 
                field="provisionalDiagnosis" 
                value={evaluationData.clinical_performance.provisionalDiagnosis} 
                onChange={handleClinicalScoreChange} 
              />
              
              <ScoreItem 
                label="b. Recognizing Severity" 
                field="recognizingSeverity" 
                value={evaluationData.clinical_performance.recognizingSeverity} 
                onChange={handleClinicalScoreChange} 
              />
              
              <ScoreItem 
                label="c. Treatment Plan" 
                field="treatmentPlan" 
                value={evaluationData.clinical_performance.treatmentPlan} 
                onChange={handleClinicalScoreChange} 
              />
              
              <ScoreItem 
                label="d. Priority to Hospital" 
                field="priorityToHospital" 
                value={evaluationData.clinical_performance.priorityToHospital} 
                onChange={handleClinicalScoreChange} 
              />
            </div>
            
            <ScoreItem 
              label="8. Trauma Management" 
              field="traumaManagement" 
              value={evaluationData.clinical_performance.traumaManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="9. Cardiac Management" 
              field="cardiacManagement" 
              value={evaluationData.clinical_performance.cardiacManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="10. Medical Management" 
              field="medicalManagement" 
              value={evaluationData.clinical_performance.medicalManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="11. Pediatric Management" 
              field="pediatricManagement" 
              value={evaluationData.clinical_performance.pediatricManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="12. Airway Management" 
              field="airwayManagement" 
              value={evaluationData.clinical_performance.airwayManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="13. Medication Admin" 
              field="medicationAdmin" 
              value={evaluationData.clinical_performance.medicationAdmin} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="14. Equipment" 
              field="equipment" 
              value={evaluationData.clinical_performance.equipment} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="15. Handover" 
              field="handover" 
              value={evaluationData.clinical_performance.handover} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="16. PCR Documentation" 
              field="pcrDocumentation" 
              value={evaluationData.clinical_performance.pcrDocumentation} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="17. Patient Communication" 
              field="patientCommunication" 
              value={evaluationData.clinical_performance.patientCommunication} 
              onChange={handleClinicalScoreChange} 
            />
          </div>
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
          <div className="space-y-4">
            <ScoreItem 
              label="1. General Appearance" 
              field="generalAppearance" 
              value={evaluationData.operational_performance.generalAppearance} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="2. Acceptance of Feedback" 
              field="acceptanceOfFeedback" 
              value={evaluationData.operational_performance.acceptanceOfFeedback} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="3. Attitude to EMS" 
              field="attitudeToEMS" 
              value={evaluationData.operational_performance.attitudeToEMS} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="4. Downtime Utilization" 
              field="downtimeUtilization" 
              value={evaluationData.operational_performance.downtimeUtilization} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="5. Safety" 
              field="safety" 
              value={evaluationData.operational_performance.safety} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="6. Start of Shift Procedures" 
              field="startOfShiftProcedures" 
              value={evaluationData.operational_performance.startOfShiftProcedures} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="7. End of Shift Procedures" 
              field="endOfShiftProcedures" 
              value={evaluationData.operational_performance.endOfShiftProcedures} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="8. Radio Communications" 
              field="radioCommunications" 
              value={evaluationData.operational_performance.radioCommunications} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="9. MDT Use" 
              field="mdtUse" 
              value={evaluationData.operational_performance.mdtUse} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="10. Stores and Restock" 
              field="storesAndRestock" 
              value={evaluationData.operational_performance.storesAndRestock} 
              onChange={handleOperationalScoreChange} 
            />
            
            <ScoreItem 
              label="11. Medication Handling" 
              field="medicationHandling" 
              value={evaluationData.operational_performance.medicationHandling} 
              onChange={handleOperationalScoreChange} 
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Additional Information</CardTitle>
          <CardDescription>
            Skills performed and medications administered
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`skills-performed-${shiftNumber}`}>Skills Performed by Student</Label>
              <Textarea
                id={`skills-performed-${shiftNumber}`}
                placeholder="List skills performed during this shift"
                value={evaluationData.skills_performed}
                onChange={(e) => handleChange('skills_performed', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`medications-administered-${shiftNumber}`}>Medications Administered by Student</Label>
              <Textarea
                id={`medications-administered-${shiftNumber}`}
                placeholder="List medications administered during this shift"
                value={evaluationData.medications_administered}
                onChange={(e) => handleChange('medications_administered', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>FTP Feedback</CardTitle>
          <CardDescription>
            Document best performance and areas needing improvement
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`best-performance-${shiftNumber}`}>Area(s) of Best Performance</Label>
              <Textarea
                id={`best-performance-${shiftNumber}`}
                placeholder="Document areas where the student performed well"
                value={evaluationData.best_performance}
                onChange={(e) => handleChange('best_performance', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`needs-improvement-${shiftNumber}`}>Area(s) Needing Improvement</Label>
              <Textarea
                id={`needs-improvement-${shiftNumber}`}
                placeholder="Document areas where the student needs to improve"
                value={evaluationData.needs_improvement}
                onChange={(e) => handleChange('needs_improvement', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`improvement-plan-${shiftNumber}`}>Plan for Improvement or Actions Taken</Label>
              <Textarea
                id={`improvement-plan-${shiftNumber}`}
                placeholder="Document plans or actions for improvement"
                value={evaluationData.improvement_plan}
                onChange={(e) => handleChange('improvement_plan', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="flex items-center space-x-2 pt-2">
              <Switch
                id={`discussed-with-ftp-${shiftNumber}`}
                checked={evaluationData.discussed_with_ftp}
                onCheckedChange={(checked) => handleChange('discussed_with_ftp', checked)}
              />
              <Label htmlFor={`discussed-with-ftp-${shiftNumber}`}>
                Discussion with FTP confirmed
              </Label>
            </div>
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
          <div className="pt-2">
            <SignatureField
              label="Delta/Production Signature *"
              value={evaluationData.ftp_signature}
              onChange={(value) => handleChange('ftp_signature', value)}
              required={true}
            />
          </div>
          
          <div className="pt-2">
            <SignatureField
              label="Student Signature *"
              value={evaluationData.student_signature}
              onChange={(value) => handleChange('student_signature', value)}
              required={true}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
          >
            Save Draft
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

interface ScoreItemProps {
  label: string;
  field: string;
  value: EvaluationScore;
  onChange: (field: string, value: EvaluationScore) => void;
}

const ScoreItem: React.FC<ScoreItemProps> = ({ label, field, value, onChange }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-6 gap-2 items-center py-2 border-b border-gray-100">
      <div className="md:col-span-2">
        <Label className="text-sm">{label}</Label>
      </div>
      <div className="md:col-span-4 flex flex-wrap gap-2">
        <ScoreButton score={3} currentValue={value} onClick={() => onChange(field, 3)} />
        <ScoreButton score={2} currentValue={value} onClick={() => onChange(field, 2)} />
        <ScoreButton score={1} currentValue={value} onClick={() => onChange(field, 1)} />
        <ScoreButton score="N.P." currentValue={value} onClick={() => onChange(field, 'N.P.')} />
      </div>
    </div>
  );
};

interface ScoreButtonProps {
  score: EvaluationScore;
  currentValue: EvaluationScore;
  onClick: () => void;
}

const ScoreButton: React.FC<ScoreButtonProps> = ({ score, currentValue, onClick }) => {
  const isSelected = score === currentValue;
  const scoreText = score === 'N.P.' ? 'N.P.' : score.toString();
  
  return (
    <Button
      type="button"
      variant={isSelected ? "default" : "outline"}
      size="sm"
      className={`min-w-[40px] h-8 px-2 ${isSelected ? 'bg-primary-500' : ''}`}
      onClick={onClick}
    >
      <span>{scoreText}</span>
    </Button>
  );
};

export default InstructionalShiftEvaluationForm;
