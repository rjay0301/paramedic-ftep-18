
import { useState } from 'react';
import { toast } from 'sonner';
import { InstructionalShiftEvaluationData, EvaluationScore } from '@/types';

// Create initial data for the clinical performance scores
const initialClinicalPerformance = {
  patientAssessment: 'N.P.' as EvaluationScore,
  assessmentSkills: 'N.P.' as EvaluationScore,
  historyTaking: 'N.P.' as EvaluationScore,
  nccCtlUpdate: 'N.P.' as EvaluationScore,
  sceneControl: 'N.P.' as EvaluationScore,
  patientMovement: 'N.P.' as EvaluationScore,
  provisionalDiagnosis: 'N.P.' as EvaluationScore,
  recognizingSeverity: 'N.P.' as EvaluationScore,
  treatmentPlan: 'N.P.' as EvaluationScore,
  priorityToHospital: 'N.P.' as EvaluationScore,
  traumaManagement: 'N.P.' as EvaluationScore,
  cardiacManagement: 'N.P.' as EvaluationScore,
  medicalManagement: 'N.P.' as EvaluationScore,
  pediatricManagement: 'N.P.' as EvaluationScore,
  airwayManagement: 'N.P.' as EvaluationScore,
  medicationAdmin: 'N.P.' as EvaluationScore,
  equipment: 'N.P.' as EvaluationScore,
  handover: 'N.P.' as EvaluationScore,
  pcrDocumentation: 'N.P.' as EvaluationScore,
  patientCommunication: 'N.P.' as EvaluationScore,
};

// Create initial data for the operational performance scores
const initialOperationalPerformance = {
  generalAppearance: 'N.P.' as EvaluationScore,
  acceptanceOfFeedback: 'N.P.' as EvaluationScore,
  attitudeToEMS: 'N.P.' as EvaluationScore,
  downtimeUtilization: 'N.P.' as EvaluationScore,
  safety: 'N.P.' as EvaluationScore,
  startOfShiftProcedures: 'N.P.' as EvaluationScore,
  endOfShiftProcedures: 'N.P.' as EvaluationScore,
  radioCommunications: 'N.P.' as EvaluationScore,
  mdtUse: 'N.P.' as EvaluationScore,
  storesAndRestock: 'N.P.' as EvaluationScore,
  medicationHandling: 'N.P.' as EvaluationScore,
};

// Initial evaluation data state
const initialEvaluationData: InstructionalShiftEvaluationData = {
  shift_number: 0,
  date: null,
  ftp_name: '', // Add this field
  ftp_corp_id: '', // Add this field
  clinical_performance: initialClinicalPerformance,
  operational_performance: initialOperationalPerformance,
  skills_performed: '',
  medications_administered: '',
  best_performance: '',
  needs_improvement: '',
  improvement_plan: '',
  discussed_with_ftp: false,
  ftp_signature: '',
  student_signature: '',
  status: 'draft'
};

export const useEvaluationLogic = () => {
  // Create an array of 6 evaluation data states
  const [evaluationsData, setEvaluationsData] = useState<InstructionalShiftEvaluationData[]>(
    Array(6).fill(null).map((_, index) => ({...initialEvaluationData, shift_number: index + 1}))
  );
  const [activeTab, setActiveTab] = useState('evaluation1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Track which evaluations are completed
  const [completedEvaluations, setCompletedEvaluations] = useState<number[]>([]);
  
  // Handle evaluation data changes
  const handleEvaluationChange = <K extends keyof InstructionalShiftEvaluationData>(
    evaluationIndex: number, 
    field: K, 
    value: InstructionalShiftEvaluationData[K]
  ) => {
    setEvaluationsData(prev => {
      const newEvaluationsData = [...prev];
      newEvaluationsData[evaluationIndex] = {
        ...newEvaluationsData[evaluationIndex],
        [field]: value
      };
      return newEvaluationsData;
    });
  };
  
  // Handle clinical performance score changes
  const handleClinicalScoreChange = (
    evaluationIndex: number,
    field: keyof InstructionalShiftEvaluationData['clinical_performance'],
    value: EvaluationScore
  ) => {
    setEvaluationsData(prev => {
      const newEvaluationsData = [...prev];
      newEvaluationsData[evaluationIndex] = {
        ...newEvaluationsData[evaluationIndex],
        clinical_performance: {
          ...newEvaluationsData[evaluationIndex].clinical_performance,
          [field]: value
        }
      };
      return newEvaluationsData;
    });
  };
  
  // Handle operational performance score changes
  const handleOperationalScoreChange = (
    evaluationIndex: number,
    field: keyof InstructionalShiftEvaluationData['operational_performance'],
    value: EvaluationScore
  ) => {
    setEvaluationsData(prev => {
      const newEvaluationsData = [...prev];
      newEvaluationsData[evaluationIndex] = {
        ...newEvaluationsData[evaluationIndex],
        operational_performance: {
          ...newEvaluationsData[evaluationIndex].operational_performance,
          [field]: value
        }
      };
      return newEvaluationsData;
    });
  };
  
  // Validate if an evaluation is complete with all required fields
  const isEvaluationValid = (evaluationData: InstructionalShiftEvaluationData) => {
    const { 
      date, ftp_name, ftp_corp_id, ftp_signature, student_signature
    } = evaluationData;
    
    const requiredFields = [
      date, ftp_name, ftp_corp_id, ftp_signature, student_signature
    ];
    
    return requiredFields.every(field => field !== null && field !== '');
  };
  
  // Handle evaluation submit
  const handleEvaluationSubmit = (evaluationIndex: number) => {
    const evaluationData = evaluationsData[evaluationIndex];
    
    if (!isEvaluationValid(evaluationData)) {
      toast.error("Incomplete Form", {
        description: "Please complete all required fields including signatures.",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      // Update evaluation status to submitted
      setEvaluationsData(prev => {
        const newEvaluationsData = [...prev];
        newEvaluationsData[evaluationIndex] = {
          ...newEvaluationsData[evaluationIndex],
          status: 'submitted'
        };
        return newEvaluationsData;
      });
      
      // Mark evaluation as completed
      setCompletedEvaluations(prev => [...prev, evaluationIndex]);
      
      // Move to next evaluation if available
      if (evaluationIndex < 5) {
        setActiveTab(`evaluation${evaluationIndex + 2}`);
      }
      
      setIsSubmitting(false);
      
      toast.success(`Shift Evaluation ${evaluationIndex + 1} Completed`, {
        description: evaluationIndex < 5 
          ? `You can now proceed to Shift Evaluation ${evaluationIndex + 2}.` 
          : "All shift evaluations have been completed.",
      });
    }, 1000);
  };
  
  // Handle save draft for evaluations
  const handleSaveDraft = (evaluationIndex: number) => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      
      toast.info(`Shift Evaluation ${evaluationIndex + 1} Saved as Draft`, {
        description: "Your progress has been saved.",
      });
    }, 800);
  };

  return {
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
  };
};
