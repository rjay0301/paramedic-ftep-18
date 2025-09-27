
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import PageHeader from '@/components/common/PageHeader';
import ShiftForm, { LockedShiftForm } from './ShiftForm';
import { ShiftData, AssessmentStatus } from './types';
import { toast } from 'sonner';

const RuralAmbulanceForm = () => {
  const navigate = useNavigate();
  const [activeShift, setActiveShift] = useState(1);
  const [shifts, setShifts] = useState<ShiftData[]>([
    {
      ftpName: '',
      ftpCorpId: '',
      ftpRole: '',
      crewName: '',
      crewCorpId: '',
      date: null,
      alphaUnit: '',
      hub: '',
      numberOfPatients: '',
      assessments: {
        loadingStretcher: null,
        unloadingStretcher: null,
        safetyFeatures: null,
        cabinFamiliarization: null,
      },
      comments: '',
      productionName: '',
      productionCorpId: '',
      productionDate: null,
      signature: '',
      isComplete: false
    },
    {
      ftpName: '',
      ftpCorpId: '',
      ftpRole: '',
      crewName: '',
      crewCorpId: '',
      date: null,
      alphaUnit: '',
      hub: '',
      numberOfPatients: '',
      assessments: {
        loadingStretcher: null,
        unloadingStretcher: null,
        safetyFeatures: null,
        cabinFamiliarization: null,
      },
      comments: '',
      productionName: '',
      productionCorpId: '',
      productionDate: null,
      signature: '',
      isComplete: false
    }
  ]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field: keyof ShiftData, value: any) => {
    setShifts(prev => {
      const newShifts = [...prev];
      newShifts[activeShift - 1] = {
        ...newShifts[activeShift - 1],
        [field]: value
      };
      return newShifts;
    });
  };

  const handleAssessmentChange = (assessment: keyof ShiftData['assessments'], value: AssessmentStatus) => {
    setShifts(prev => {
      const newShifts = [...prev];
      newShifts[activeShift - 1] = {
        ...newShifts[activeShift - 1],
        assessments: {
          ...newShifts[activeShift - 1].assessments,
          [assessment]: value
        }
      };
      return newShifts;
    });
  };

  const handleSubmit = () => {
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setShifts(prev => {
        const newShifts = [...prev];
        newShifts[activeShift - 1] = {
          ...newShifts[activeShift - 1],
          isComplete: true
        };
        return newShifts;
      });
      toast.success(`Shift ${activeShift} submitted successfully!`);
      console.log('Submitting shift data:', shifts[activeShift - 1]);
    }, 1000);
  };

  const handleSaveDraft = () => {
    setIsSubmitting(true);
    // Simulate saving draft
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Shift ${activeShift} draft saved!`);
      console.log('Saving draft:', shifts[activeShift - 1]);
    }, 1000);
  };

  const isShiftUnlocked = (shiftNumber: number) => {
    if (shiftNumber === 1) return true;
    return shifts[shiftNumber - 2].isComplete;
  };

  const navigateToShift = (shiftNumber: number) => {
    if (isShiftUnlocked(shiftNumber)) {
      setActiveShift(shiftNumber);
    } else {
      toast.error(`You need to complete Shift ${shiftNumber - 1} first!`);
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader 
          title="Rural Ambulance Orientation" 
          subtitle="2 shifts focusing on Rural Ambulance Operations" 
        />
        
        <div className="p-4 md:p-6">
          <div className="flex justify-center mb-6">
            <div className="flex space-x-2">
              {shifts.map((_, index) => (
                <Button
                  key={index}
                  variant={activeShift === index + 1 ? "default" : "outline"}
                  size="sm"
                  onClick={() => navigateToShift(index + 1)}
                  disabled={!isShiftUnlocked(index + 1)}
                  className={!isShiftUnlocked(index + 1) ? "opacity-50 cursor-not-allowed" : ""}
                >
                  Shift {index + 1}
                </Button>
              ))}
            </div>
          </div>
          
          {isShiftUnlocked(activeShift) ? (
            <ShiftForm 
              shiftData={shifts[activeShift - 1]}
              handleChange={handleChange}
              handleAssessmentChange={handleAssessmentChange}
              handleSubmit={handleSubmit}
              handleSaveDraft={handleSaveDraft}
              shiftNumber={activeShift}
              isSubmitting={isSubmitting}
            />
          ) : (
            <LockedShiftForm />
          )}
        </div>
      </div>
    </div>
  );
};

export default RuralAmbulanceForm;
