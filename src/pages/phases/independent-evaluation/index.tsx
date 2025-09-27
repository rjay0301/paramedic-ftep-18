import React, { useState } from 'react';
import { Lock, Save, CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useIsMobile } from '@/hooks/use-mobile';
import IndependentShiftEvaluationForm from './IndependentShiftEvaluationForm';
import { IndependentShiftEvaluationData, ClinicalAssessment, OperationalAssessment } from '@/types/independentEvaluation';
import { EvaluationScore } from '@/types';
import PageHeader from '@/components/common/PageHeader';

// Initial clinical assessment state
const initialClinicalAssessment = {
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
  patientCommunication: 'N.P.' as EvaluationScore
};

// Initial operational assessment state
const initialOperationalAssessment = {
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
  medicationHandling: 'N.P.' as EvaluationScore
};

// Initial evaluation data state
const initialEvaluationData: IndependentShiftEvaluationData = {
  shift_number: 0,
  date: null,
  clinical_assessment: initialClinicalAssessment,
  operational_assessment: initialOperationalAssessment,
  best_performance: '',
  needs_improvement: '',
  improvement_plan: '',
  discussed_with_ftp: false,
  ftp_signature: '',
  student_signature: '',
  status: 'draft'
};
const IndependentShiftEvaluationPage = () => {
  const [evaluationsData, setEvaluationsData] = useState<IndependentShiftEvaluationData[]>(Array(6).fill(null).map((_, index) => ({
    ...initialEvaluationData,
    shift_number: index + 1
  })));
  const [activeTab, setActiveTab] = useState('shift1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedShifts, setCompletedShifts] = useState<number[]>([]);
  const {
    toast
  } = useToast();
  const isMobile = useIsMobile();

  // Handle shift data changes
  const handleShiftChange = (shiftIndex: number, field: keyof IndependentShiftEvaluationData, value: any) => {
    setEvaluationsData(prev => {
      const newEvaluationsData = [...prev];
      newEvaluationsData[shiftIndex] = {
        ...newEvaluationsData[shiftIndex],
        [field]: value
      };
      return newEvaluationsData;
    });
  };

  // Handle clinical assessment changes
  const handleClinicalAssessmentChange = (shiftIndex: number, field: keyof ClinicalAssessment, value: EvaluationScore) => {
    setEvaluationsData(prev => {
      const newEvaluationsData = [...prev];
      newEvaluationsData[shiftIndex] = {
        ...newEvaluationsData[shiftIndex],
        clinical_assessment: {
          ...newEvaluationsData[shiftIndex].clinical_assessment,
          [field]: value
        }
      };
      return newEvaluationsData;
    });
  };

  // Handle operational assessment changes
  const handleOperationalAssessmentChange = (shiftIndex: number, field: keyof OperationalAssessment, value: EvaluationScore) => {
    setEvaluationsData(prev => {
      const newEvaluationsData = [...prev];
      newEvaluationsData[shiftIndex] = {
        ...newEvaluationsData[shiftIndex],
        operational_assessment: {
          ...newEvaluationsData[shiftIndex].operational_assessment,
          [field]: value
        }
      };
      return newEvaluationsData;
    });
  };

  // Validate evaluation data
  const isShiftValid = (evaluationData: IndependentShiftEvaluationData) => {
    const requiredFields = [evaluationData.date, evaluationData.best_performance, evaluationData.needs_improvement, evaluationData.improvement_plan, evaluationData.ftp_signature, evaluationData.student_signature];
    return requiredFields.every(field => field !== null && field !== '');
  };

  // Handle shift submit
  const handleShiftSubmit = (shiftIndex: number) => {
    const evaluationData = evaluationsData[shiftIndex];
    if (!isShiftValid(evaluationData)) {
      toast({
        title: "Incomplete Form",
        description: "Please complete all required fields including signatures.",
        variant: "destructive"
      });
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setEvaluationsData(prev => {
        const newEvaluationsData = [...prev];
        newEvaluationsData[shiftIndex] = {
          ...newEvaluationsData[shiftIndex],
          status: 'submitted'
        };
        return newEvaluationsData;
      });
      setCompletedShifts(prev => [...prev, shiftIndex]);
      if (shiftIndex < 5) {
        setActiveTab(`shift${shiftIndex + 2}`);
      }
      setIsSubmitting(false);
      toast({
        title: `Shift ${shiftIndex + 1} Evaluation Completed`,
        description: shiftIndex < 5 ? `You can now proceed to Shift ${shiftIndex + 2} Evaluation.` : "All shift evaluations have been completed."
      });
    }, 1000);
  };

  // Handle save draft
  const handleSaveDraft = (shiftIndex: number) => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: `Shift ${shiftIndex + 1} Evaluation Saved as Draft`,
        description: "Your progress has been saved."
      });
    }, 800);
  };

  // Render tabs for shifts
  const renderShiftTabs = () => {
    if (isMobile) {
      return <div className="overflow-x-auto pb-2">
          <div className="flex justify-center mb-2">
            <div className="bg-muted rounded-md py-1 px-3">
              <span className="text-primary-600 font-medium">
                Shift {parseInt(activeTab.replace('shift', ''))} of 6
              </span>
            </div>
          </div>
          <TabsList className="inline-flex h-auto min-w-max space-x-2 px-1">
            {Array(6).fill(null).map((_, index) => {
            const shiftNumber = index + 1;
            const isLocked = shiftNumber > 1 && !completedShifts.includes(shiftNumber - 2);
            return <TabsTrigger key={`shift${shiftNumber}`} value={`shift${shiftNumber}`} disabled={isLocked} className="relative w-10 h-10 flex items-center justify-center rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600">
                  {shiftNumber}
                  {isLocked && <Lock className="absolute right-0 top-0 h-3 w-3" />}
                </TabsTrigger>;
          })}
          </TabsList>
        </div>;
    }
    return <>
        <div className="flex justify-center mb-2">
          <div className="bg-muted rounded-md py-1 px-3">
            <span className="text-primary-600 font-medium">
              Shift {parseInt(activeTab.replace('shift', ''))} of 6
            </span>
          </div>
        </div>
        <TabsList className="grid grid-cols-6 gap-2 h-auto">
          {Array(6).fill(null).map((_, index) => {
          const shiftNumber = index + 1;
          const isLocked = shiftNumber > 1 && !completedShifts.includes(shiftNumber - 2);
          return <TabsTrigger key={`shift${shiftNumber}`} value={`shift${shiftNumber}`} disabled={isLocked} className="relative w-10 h-10 flex items-center justify-center rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600">
                {shiftNumber}
                {isLocked && <Lock className="absolute right-1 top-1 h-3 w-3" />}
              </TabsTrigger>;
        })}
        </TabsList>
      </>;
  };
  const currentShiftNumber = parseInt(activeTab.replace('shift', ''));
  return <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader title="Independent Shift Evaluation" subtitle="Complete 6 shift evaluations to progress" />

        <div className="p-4 md:p-6">
          <p className="text-gray-500 text-xs md:text-sm mb-4">
            Document near the end of shift.
          </p>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {isMobile && <div className="mb-3 flex justify-center">
                
              </div>}
            
            {renderShiftTabs()}
            
            {Array(6).fill(null).map((_, index) => {
            const shiftNumber = index + 1;
            const isLocked = shiftNumber > 1 && !completedShifts.includes(shiftNumber - 2);
            return <TabsContent key={`content-shift${shiftNumber}`} value={`shift${shiftNumber}`} className="mt-4">
                  {isLocked ? <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Lock className="h-10 w-10 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium">Shift {shiftNumber} Evaluation is Locked</h3>
                      <p className="text-gray-500 mt-2 text-sm">
                        Complete Shift {shiftNumber - 1} Evaluation to unlock this shift.
                      </p>
                    </div> : <div className="rounded-lg border p-3 md:p-4">
                      <IndependentShiftEvaluationForm evaluationData={evaluationsData[index]} handleChange={(field, value) => handleShiftChange(index, field, value)} handleClinicalAssessmentChange={(field, value) => handleClinicalAssessmentChange(index, field, value)} handleOperationalAssessmentChange={(field, value) => handleOperationalAssessmentChange(index, field, value)} handleSubmit={() => handleShiftSubmit(index)} handleSaveDraft={() => handleSaveDraft(index)} shiftNumber={shiftNumber} isSubmitting={isSubmitting} />
                    </div>}
                </TabsContent>;
          })}
          </Tabs>
        </div>
      </div>
    </div>;
};
export default IndependentShiftEvaluationPage;