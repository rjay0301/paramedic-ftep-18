
import React, { useState } from 'react';
import { z } from 'zod';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Send } from 'lucide-react';
import { toast } from 'sonner';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FinalEvaluationFormData, CriticalCriteria, ClinicalSkillScore, OperationalSkillScore } from '@/types/finalEvaluation';
import ClinicalSkillsSection from './ClinicalSkillsSection';
import OperationalSkillsSection from './OperationalSkillsSection';
import CriticalCriteriaSection from './CriticalCriteriaSection';
import SignatureField from '@/components/common/SignatureField';

const initialSkillEvaluation = {
  score: 1 as ClinicalSkillScore,
  practiceLevel: 'D' as const,
};

const initialOperationalEvaluation = {
  score: 1 as OperationalSkillScore,
  practiceLevel: 'D' as const,
};

const initialCriticalCriteria: CriticalCriteria = {
  unsafeAct: false,
  lossOfPatientControl: false,
  delegationFailure: false,
  equipmentFailure: false,
  failedToEstablishAirway: false,
  failedToVentilate: false,
  failedToOxygenate: false,
  failedToControlBleeding: false,
  failedToProtectSpine: false,
  failedToAssessPatient: false,
  failedToProvideInterventions: false,
  failedToTransport: false,
};

const formSchema = z.object({
  evaluatorName: z.string().min(1, 'Evaluator name is required'),
  date: z.string().min(1, 'Date is required'),
  patientsManaged: z.number().min(0, 'Cannot be negative').default(0),
  
  // Comments - requires at least comments field
  comments: z.string().min(1, 'Comments are required'),
  additionalComments: z.string().optional(),
  
  // Signatures
  evaluatorSignature: z.string().min(1, 'Evaluator signature is required'),
  evaluatorSignatureDate: z.string().min(1, 'Evaluator signature date is required'),
  studentSignature: z.string().min(1, 'Student signature is required'),
  studentSignatureDate: z.string().min(1, 'Student signature date is required'),
  deltaProductionSignature: z.string().optional(),
});

export interface FinalEvaluationFormProps {
  evaluationNumber: number;
  onSubmit: (data: FinalEvaluationFormData) => void;
  onSaveDraft: (data: FinalEvaluationFormData) => void;
}

const FinalEvaluationForm: React.FC<FinalEvaluationFormProps> = ({
  evaluationNumber,
  onSubmit,
  onSaveDraft,
}) => {
  const [formData, setFormData] = useState<FinalEvaluationFormData>({
    evaluatorName: '',
    date: new Date().toISOString().split('T')[0],
    patientsManaged: 0,
    
    // Clinical Skills Evaluation
    sceneSizeUp: initialSkillEvaluation,
    initialAssessment: initialSkillEvaluation,
    focusedHistory: initialSkillEvaluation,
    physicalExam: initialSkillEvaluation,
    vitalSigns: initialSkillEvaluation,
    problemIdentification: initialSkillEvaluation,
    treatmentProcedures: initialSkillEvaluation,
    ongoingAssessment: initialSkillEvaluation,
    liftingMoving: initialSkillEvaluation,
    informationTransfer: initialSkillEvaluation,
    
    // Operational Skills Evaluation
    standardOperatingProcedures: initialOperationalEvaluation,
    safety: initialOperationalEvaluation,
    startOfShiftProcedures: initialOperationalEvaluation,
    endOfShiftProcedures: initialOperationalEvaluation,
    radioCommunications: initialOperationalEvaluation,
    storesAndRestock: initialOperationalEvaluation,
    systemKnowledge: initialOperationalEvaluation,
    
    // Critical Criteria
    criticalCriteria: initialCriticalCriteria,
    
    // Comments
    comments: '',
    additionalComments: '',
    
    // Signatures
    evaluatorSignature: '',
    evaluatorSignatureDate: new Date().toISOString().split('T')[0],
    studentSignature: '',
    studentSignatureDate: new Date().toISOString().split('T')[0],
    deltaProductionSignature: '',
    
    // Form status
    status: 'draft',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { 
    register, 
    handleSubmit, 
    control, 
    setValue, 
    formState: { errors },
    watch
  } = useForm<FinalEvaluationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: formData
  });
  
  const handleClinicalSkillChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleOperationalSkillChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  const handleCriticalCriteriaChange = (field: keyof CriticalCriteria, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      criticalCriteria: {
        ...prev.criticalCriteria,
        [field]: value
      }
    }));
  };
  
  const handleSaveDraft = () => {
    const updatedData = { ...formData, status: 'draft' as const };
    onSaveDraft(updatedData);
    toast.success(`Evaluation ${evaluationNumber} saved as draft`);
  };
  
  const handleFormSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Combine form data with skill evaluations
    const submissionData: FinalEvaluationFormData = {
      ...data,
      ...formData,
      status: 'submitted' as const
    };
    
    onSubmit(submissionData);
    toast.success(`Evaluation ${evaluationNumber} submitted successfully`);
    setIsSubmitting(false);
  };
  
  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-lg sm:text-xl">
          Final Evaluation Form #{evaluationNumber}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <form id={`evaluation-form-${evaluationNumber}`} onSubmit={handleSubmit(handleFormSubmit)}>
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor={`evaluatorName-${evaluationNumber}`}>FTP Evaluator Name*</Label>
                <Input
                  id={`evaluatorName-${evaluationNumber}`}
                  {...register('evaluatorName')}
                  placeholder="Enter evaluator name"
                  className="mt-1"
                />
                {errors.evaluatorName && (
                  <p className="text-red-500 text-sm mt-1">{errors.evaluatorName.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor={`date-${evaluationNumber}`}>Date*</Label>
                <Input
                  id={`date-${evaluationNumber}`}
                  type="date"
                  {...register('date')}
                  className="mt-1"
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1">{errors.date.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor={`patientsManaged-${evaluationNumber}`}>Patients Managed</Label>
                <Input
                  id={`patientsManaged-${evaluationNumber}`}
                  type="number"
                  min="0"
                  {...register('patientsManaged', { valueAsNumber: true })}
                  className="mt-1"
                />
                {errors.patientsManaged && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientsManaged.message}</p>
                )}
              </div>
            </div>
            
            {/* Clinical Skills Evaluation */}
            <div className="border rounded-md p-4">
              <ClinicalSkillsSection 
                formData={{
                  sceneSizeUp: formData.sceneSizeUp,
                  initialAssessment: formData.initialAssessment,
                  focusedHistory: formData.focusedHistory,
                  physicalExam: formData.physicalExam,
                  vitalSigns: formData.vitalSigns,
                  problemIdentification: formData.problemIdentification,
                  treatmentProcedures: formData.treatmentProcedures,
                  ongoingAssessment: formData.ongoingAssessment,
                  liftingMoving: formData.liftingMoving,
                  informationTransfer: formData.informationTransfer,
                }}
                onChange={handleClinicalSkillChange}
              />
            </div>
            
            {/* Operational Skills Evaluation */}
            <div className="border rounded-md p-4">
              <OperationalSkillsSection 
                formData={{
                  standardOperatingProcedures: formData.standardOperatingProcedures,
                  safety: formData.safety,
                  startOfShiftProcedures: formData.startOfShiftProcedures,
                  endOfShiftProcedures: formData.endOfShiftProcedures,
                  radioCommunications: formData.radioCommunications,
                  storesAndRestock: formData.storesAndRestock,
                  systemKnowledge: formData.systemKnowledge,
                }}
                onChange={handleOperationalSkillChange}
              />
            </div>
            
            {/* Critical Criteria */}
            <div className="border rounded-md p-4">
              <CriticalCriteriaSection 
                criteria={formData.criticalCriteria}
                onChange={handleCriticalCriteriaChange}
              />
            </div>
            
            {/* Comments */}
            <div className="space-y-4">
              <div>
                <Label htmlFor={`comments-${evaluationNumber}`}>
                  Comments* <span className="text-xs text-gray-500">(Required for explanation of any D ratings or low scores)</span>
                </Label>
                <Textarea
                  id={`comments-${evaluationNumber}`}
                  {...register('comments')}
                  placeholder="Enter comments..."
                  className="mt-1 h-24"
                />
                {errors.comments && (
                  <p className="text-red-500 text-sm mt-1">{errors.comments.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor={`additionalComments-${evaluationNumber}`}>Additional Comments</Label>
                <Textarea
                  id={`additionalComments-${evaluationNumber}`}
                  {...register('additionalComments')}
                  placeholder="Enter additional comments..."
                  className="mt-1 h-20"
                />
              </div>
            </div>
            
            {/* Assessment Discussion */}
            <div className="bg-gray-50 p-4 rounded-md text-sm">
              <p className="font-medium mb-2">The evaluation should be discussed with the student after the shift and the student should be made aware of:</p>
              <ol className="list-decimal pl-5 space-y-1">
                <li>The areas in assessment and treatment needing attention</li>
                <li>The grade that was given to him/her and the reason for that specific grade</li>
                <li>Whether he/she has successfully/competently completed that portion of the evaluation</li>
                <li>And the student should be given the opportunity to ask questions pertaining to the call and the grade</li>
              </ol>
            </div>
            
            {/* Signatures */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Controller
                  name="evaluatorSignature"
                  control={control}
                  render={({ field }) => (
                    <SignatureField
                      label="FTP Evaluator Signature*"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.evaluatorSignature?.message}
                      required
                    />
                  )}
                />
                <div className="mt-2">
                  <Label htmlFor={`evaluatorSignatureDate-${evaluationNumber}`}>Date*</Label>
                  <Input
                    id={`evaluatorSignatureDate-${evaluationNumber}`}
                    type="date"
                    {...register('evaluatorSignatureDate')}
                    className="mt-1"
                  />
                  {errors.evaluatorSignatureDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.evaluatorSignatureDate.message}</p>
                  )}
                </div>
              </div>
              
              <div>
                <Controller
                  name="studentSignature"
                  control={control}
                  render={({ field }) => (
                    <SignatureField
                      label="Student Signature*"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.studentSignature?.message}
                      required
                    />
                  )}
                />
                <div className="mt-2">
                  <Label htmlFor={`studentSignatureDate-${evaluationNumber}`}>Date*</Label>
                  <Input
                    id={`studentSignatureDate-${evaluationNumber}`}
                    type="date"
                    {...register('studentSignatureDate')}
                    className="mt-1"
                  />
                  {errors.studentSignatureDate && (
                    <p className="text-red-500 text-sm mt-1">{errors.studentSignatureDate.message}</p>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Controller
                  name="deltaProductionSignature"
                  control={control}
                  render={({ field }) => (
                    <SignatureField
                      label="Delta/Production Signature"
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.deltaProductionSignature?.message}
                    />
                  )}
                />
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      
      <CardFooter className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          className="w-full sm:w-auto"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        
        <Button
          type="submit"
          form={`evaluation-form-${evaluationNumber}`}
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit Evaluation
        </Button>
      </CardFooter>
    </Card>
  );
};

export default FinalEvaluationForm;
