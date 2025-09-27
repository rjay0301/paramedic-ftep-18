import React from 'react';
import { InstructionalCaseSummaryData, EvaluationScore } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SignatureField from '@/components/common/SignatureField';

interface InstructionalCaseSummaryFormProps {
  summaryData: InstructionalCaseSummaryData;
  handleChange: <K extends keyof InstructionalCaseSummaryData>(field: K, value: InstructionalCaseSummaryData[K]) => void;
  handleClinicalScoreChange: (field: keyof InstructionalCaseSummaryData['clinical_performance'], value: EvaluationScore) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  summaryNumber: number;
  isSubmitting: boolean;
}

const InstructionalCaseSummaryForm: React.FC<InstructionalCaseSummaryFormProps> = ({
  summaryData,
  handleChange,
  handleClinicalScoreChange,
  handleSubmit,
  handleSaveDraft,
  summaryNumber,
  isSubmitting,
}) => {
  return (
    <div className="space-y-2">
      <Card>
        <CardHeader>
          <CardTitle>Case Summary {summaryNumber} Information</CardTitle>
          <CardDescription>
            Enter the basic information for this case summary
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`cfs-number-${summaryNumber}`}>CFS Number *</Label>
              <Input
                id={`cfs-number-${summaryNumber}`}
                placeholder="Enter CFS Number"
                value={summaryData.cfs_number}
                onChange={(e) => handleChange('cfs_number', e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !summaryData.date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {summaryData.date ? format(new Date(summaryData.date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={summaryData.date ? new Date(summaryData.date) : undefined}
                    onSelect={(date) => handleChange('date', date?.toISOString() || null)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`chief-complaint-${summaryNumber}`}>Chief Complaint</Label>
            <Textarea
              id={`chief-complaint-${summaryNumber}`}
              placeholder="Enter patient's chief complaint"
              value={summaryData.chief_complaint}
              onChange={(e) => handleChange('chief_complaint', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Priority to Hospital</Label>
            <RadioGroup 
              value={summaryData.priority} 
              onValueChange={(value) => handleChange('priority', value as 'P1' | 'P2')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P1" id={`p1-${summaryNumber}`} />
                <Label htmlFor={`p1-${summaryNumber}`}>P1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="P2" id={`p2-${summaryNumber}`} />
                <Label htmlFor={`p2-${summaryNumber}`}>P2</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>
      
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
              value={summaryData.clinical_performance.patientAssessment} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="2. Assessment Skills" 
              field="assessmentSkills" 
              value={summaryData.clinical_performance.assessmentSkills} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="3. History Taking" 
              field="historyTaking" 
              value={summaryData.clinical_performance.historyTaking} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="4. NCC and CTL Update" 
              field="nccCtlUpdate" 
              value={summaryData.clinical_performance.nccCtlUpdate} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="5. Scene Control" 
              field="sceneControl" 
              value={summaryData.clinical_performance.sceneControl} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="6. Patient Movement" 
              field="patientMovement" 
              value={summaryData.clinical_performance.patientMovement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <div className="pl-4 border-l-2 border-gray-200 ml-2 space-y-4">
              <h3 className="font-medium text-sm">7. Clinical Decision Making</h3>
              
              <ScoreItem 
                label="a. Provisional Diagnosis" 
                field="provisionalDiagnosis" 
                value={summaryData.clinical_performance.provisionalDiagnosis} 
                onChange={handleClinicalScoreChange} 
              />
              
              <ScoreItem 
                label="b. Recognizing Severity" 
                field="recognizingSeverity" 
                value={summaryData.clinical_performance.recognizingSeverity} 
                onChange={handleClinicalScoreChange} 
              />
              
              <ScoreItem 
                label="c. Treatment Plan" 
                field="treatmentPlan" 
                value={summaryData.clinical_performance.treatmentPlan} 
                onChange={handleClinicalScoreChange} 
              />
              
              <ScoreItem 
                label="d. Priority to Hospital" 
                field="priorityToHospital" 
                value={summaryData.clinical_performance.priorityToHospital} 
                onChange={handleClinicalScoreChange} 
              />
            </div>
            
            <ScoreItem 
              label="8. Trauma Management" 
              field="traumaManagement" 
              value={summaryData.clinical_performance.traumaManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="9. Cardiac Management" 
              field="cardiacManagement" 
              value={summaryData.clinical_performance.cardiacManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="10. Medical Management" 
              field="medicalManagement" 
              value={summaryData.clinical_performance.medicalManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="11. Pediatric Management" 
              field="pediatricManagement" 
              value={summaryData.clinical_performance.pediatricManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="12. Airway Management" 
              field="airwayManagement" 
              value={summaryData.clinical_performance.airwayManagement} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="13. Medication Admin" 
              field="medicationAdmin" 
              value={summaryData.clinical_performance.medicationAdmin} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="14. Equipment" 
              field="equipment" 
              value={summaryData.clinical_performance.equipment} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="15. Handover" 
              field="handover" 
              value={summaryData.clinical_performance.handover} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="16. PCR Documentation" 
              field="pcrDocumentation" 
              value={summaryData.clinical_performance.pcrDocumentation} 
              onChange={handleClinicalScoreChange} 
            />
            
            <ScoreItem 
              label="17. Patient Communication" 
              field="patientCommunication" 
              value={summaryData.clinical_performance.patientCommunication} 
              onChange={handleClinicalScoreChange} 
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
              <Label htmlFor={`skills-performed-${summaryNumber}`}>Skills Performed by Student</Label>
              <Textarea
                id={`skills-performed-${summaryNumber}`}
                placeholder="List skills performed during this case"
                value={summaryData.skills_performed}
                onChange={(e) => handleChange('skills_performed', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`medications-administered-${summaryNumber}`}>Medications Administered by Student</Label>
              <Textarea
                id={`medications-administered-${summaryNumber}`}
                placeholder="List medications administered during this case"
                value={summaryData.medications_administered}
                onChange={(e) => handleChange('medications_administered', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Self Reflection and Feedback</CardTitle>
          <CardDescription>
            Document self-assessment and feedback received
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor={`performed-well-${summaryNumber}`}>What was performed well</Label>
              <Textarea
                id={`performed-well-${summaryNumber}`}
                value={summaryData.performed_well || ''}
                onChange={(e) => handleChange('performed_well', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`areas-to-improve-${summaryNumber}`}>Areas to improve</Label>
              <Textarea
                id={`areas-to-improve-${summaryNumber}`}
                value={summaryData.areas_to_improve || ''}
                onChange={(e) => handleChange('areas_to_improve', e.target.value)}
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`ftp-feedback-${summaryNumber}`}>FTP Feedback</Label>
              <Textarea
                id={`ftp-feedback-${summaryNumber}`}
                value={summaryData.ftp_feedback || ''}
                onChange={(e) => handleChange('ftp_feedback', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Signatures</CardTitle>
          <CardDescription>
            By signing below I am attesting that the information on this case summary is true and correct to the best of my knowledge.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="pt-2">
            <SignatureField
              label="FTP Signature *"
              value={summaryData.ftp_signature}
              onChange={(value) => handleChange('ftp_signature', value)}
              required={true}
            />
          </div>
          
          <div className="pt-2">
            <SignatureField
              label="Student Signature *"
              value={summaryData.student_signature}
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
  field: keyof InstructionalCaseSummaryData['clinical_performance'];
  value: EvaluationScore;
  onChange: (field: keyof InstructionalCaseSummaryData['clinical_performance'], value: EvaluationScore) => void;
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

export default InstructionalCaseSummaryForm;
