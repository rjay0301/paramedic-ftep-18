import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Lock } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import IndependentShiftForm from './IndependentShiftForm';
import { IndependentPhaseData, TeamLeadershipAssessment } from '@/types';

const IndependentPhaseForm: React.FC = () => {
  const { phaseId } = useParams();
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const isAddendum = phaseId?.startsWith('independent-copy-');
  const addendumNumber = isAddendum ? parseInt(phaseId.split('-').pop() || '1') : null;

  const [activeTab, setActiveTab] = useState('shift1');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedShifts, setCompletedShifts] = useState<number[]>([]);
  const [shiftsData, setShiftsData] = useState<IndependentPhaseData[]>(
    Array(6).fill(null).map((_, index) => ({
      shift_number: index + 1,
      shift_date: null,
      number_of_patients: 0,
      ftp_name: '',
      ftp_corp_id: '',
      ftp_role: '',
      crew_name: '',
      crew_corp_id: '',
      alpha_unit: '',
      hub: '',
      student_objective: '',
      ftp_objective: '',
      team_leadership: {
        isTeamLeader: false,
        providedClearDirection: false,
        diagnosisAndTreatmentCorrect: false,
        actionsTimely: false,
        actionsSafe: false,
        actionsAlignedWithSOPs: false,
        comments: '',
        // Keep backward compatibility
        performed_as_team_leader: false,
        provided_clear_direction: false,
        diagnosis_and_plan_correct: false,
        actions_timely: false,
        actions_safe: false,
        actions_within_guidelines: false,
        explanation: ''
      },
      production_name: '',
      production_corp_id: '',
      production_date: null,
      signature: '',
      status: 'draft'
    }))
  );

  const handleShiftChange = (shiftIndex: number, field: keyof IndependentPhaseData, value: any) => {
    setShiftsData(prev => {
      const newShiftsData = [...prev];
      newShiftsData[shiftIndex] = {
        ...newShiftsData[shiftIndex],
        [field]: value
      };
      return newShiftsData;
    });
  };

  const handleTeamLeadershipChange = (shiftIndex: number, field: keyof TeamLeadershipAssessment, value: boolean | string) => {
    setShiftsData(prev => {
      const newShiftsData = [...prev];
      newShiftsData[shiftIndex] = {
        ...newShiftsData[shiftIndex],
        team_leadership: {
          ...newShiftsData[shiftIndex].team_leadership,
          [field]: value
        }
      };
      return newShiftsData;
    });
  };

  const handleShiftSubmit = async (shiftIndex: number) => {
    setIsSubmitting(true);
    try {
      // Submit logic would go here
      setCompletedShifts(prev => [...prev, shiftIndex]);
      if (shiftIndex < 5) {
        setActiveTab(`shift${shiftIndex + 2}`);
      }
      toast({
        title: `Shift ${shiftIndex + 1} Evaluation Completed`,
        description: shiftIndex < 5 ? `You can now proceed to Shift ${shiftIndex + 2}.` : "All shifts have been completed."
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit shift evaluation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveDraft = async (shiftIndex: number) => {
    setIsSubmitting(true);
    try {
      // Save draft logic would go here
      toast({
        title: "Draft Saved",
        description: `Shift ${shiftIndex + 1} evaluation has been saved as draft.`
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save draft",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-center mb-4">
          <TabsList className="grid grid-cols-6 gap-2">
            {Array(6).fill(null).map((_, index) => {
              const shiftNumber = index + 1;
              const isLocked = shiftNumber > 1 && !completedShifts.includes(shiftNumber - 2);
              
              return (
                <TabsTrigger
                  key={`shift${shiftNumber}`}
                  value={`shift${shiftNumber}`}
                  disabled={isLocked}
                  className="relative w-12 h-12"
                >
                  {shiftNumber}
                  {isLocked && <Lock className="absolute -top-1 -right-1 h-4 w-4 text-gray-400" />}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>

        {Array(6).fill(null).map((_, index) => {
          const shiftNumber = index + 1;
          const isLocked = shiftNumber > 1 && !completedShifts.includes(shiftNumber - 2);
          
          return (
            <TabsContent key={`content-shift${shiftNumber}`} value={`shift${shiftNumber}`}>
              {isLocked ? (
                <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                  <Lock className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900">This shift is locked</h3>
                  <p className="text-gray-500 text-center mt-2">
                    Complete the previous shift to unlock this one
                  </p>
                </div>
              ) : (
                <IndependentShiftForm
                  shiftData={shiftsData[index]}
                  handleChange={(field, value) => handleShiftChange(index, field, value)}
                  handleTeamLeadershipChange={(field, value) => handleTeamLeadershipChange(index, field, value)}
                  handleSubmit={() => handleShiftSubmit(index)}
                  handleSaveDraft={() => handleSaveDraft(index)}
                  shiftNumber={shiftNumber}
                  isSubmitting={isSubmitting}
                />
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default IndependentPhaseForm;
