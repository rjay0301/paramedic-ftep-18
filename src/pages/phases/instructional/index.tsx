
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from 'sonner';
import { Lock } from 'lucide-react';
import InstructionalShiftForm from './InstructionalShiftForm';
import PageHeader from '@/components/common/PageHeader';
import { InstructionalPhaseData } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

const InstructionalPhase = () => {
  const isMobile = useIsMobile();
  const [activeTab, setActiveTab] = useState('shift1');
  const [completedShifts, setCompletedShifts] = useState<number[]>([]);
  const [shiftsData, setShiftsData] = useState<InstructionalPhaseData[]>(
    Array(6).fill(null).map((_, index) => ({
      shift_number: index + 1,
      ftp_name: '',
      ftp_corp_id: '',
      ftp_role: '',
      crew_name: '',
      crew_corp_id: '',
      shift_date: null, // Changed from date to shift_date
      alpha_unit: '',
      hub: '',
      number_of_patients: 0,
      student_objective: '',
      ftp_objective: '',
      feedback: '',
      production_name: '',
      production_corp_id: '',
      production_date: null, // Added this field
      signature: '',
      status: 'draft'
    }))
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (shiftIndex: number, field: keyof InstructionalPhaseData, value: any) => {
    setShiftsData(prev => {
      const newShiftsData = [...prev];
      newShiftsData[shiftIndex] = {
        ...newShiftsData[shiftIndex],
        [field]: value
      };
      return newShiftsData;
    });
  };

  const handleSubmit = (shiftIndex: number) => {
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      // Update completed shifts
      setCompletedShifts(prev => {
        if (!prev.includes(shiftIndex)) {
          return [...prev, shiftIndex];
        }
        return prev;
      });
      
      // Update shift status
      setShiftsData(prev => {
        const newShiftsData = [...prev];
        newShiftsData[shiftIndex] = {
          ...newShiftsData[shiftIndex],
          status: 'submitted'
        };
        return newShiftsData;
      });
      
      setIsSubmitting(false);
      toast.success(`Shift ${shiftIndex + 1} submitted successfully!`);
      
      // Move to next shift if available
      if (shiftIndex < 5) {
        setActiveTab(`shift${shiftIndex + 2}`);
      }
    }, 1000);
  };

  const handleSaveDraft = (shiftIndex: number) => {
    setIsSubmitting(true);
    // Simulate saving draft
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success(`Shift ${shiftIndex + 1} draft saved!`);
    }, 1000);
  };

  const isShiftUnlocked = (shiftNumber: number) => {
    if (shiftNumber === 1) return true;
    return completedShifts.includes(shiftNumber - 2) || shiftsData[shiftNumber - 2].status === 'submitted';
  };

  // Generate tabs for shifts
  const renderShiftTabs = () => {
    // For mobile, create a scrollable tab list
    if (isMobile) {
      return (
        <div className="overflow-x-auto pb-2">
          <div className="flex justify-center mb-2">
            <div className="bg-muted rounded-md py-1 px-3">
              <span className="text-primary-600 font-medium">Shift {parseInt(activeTab.replace('shift', ''))} of 6</span>
            </div>
          </div>
          <TabsList className="inline-flex h-auto min-w-max space-x-2 px-1">
            {Array(6).fill(null).map((_, index) => {
              const shiftNumber = index + 1;
              const isLocked = !isShiftUnlocked(shiftNumber);
              return (
                <TabsTrigger
                  key={`shift${shiftNumber}`}
                  value={`shift${shiftNumber}`}
                  disabled={isLocked}
                  className="relative w-10 h-10 flex items-center justify-center rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600"
                >
                  {shiftNumber}
                  {isLocked && (
                    <Lock className="absolute right-0 top-0 h-3 w-3" />
                  )}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </div>
      );
    }
    
    // For desktop, show all tabs in a grid with better alignment
    return (
      <>
        <div className="flex justify-center mb-2">
          <div className="bg-muted rounded-md py-1 px-3">
            <span className="text-primary-600 font-medium">Shift {parseInt(activeTab.replace('shift', ''))} of 6</span>
          </div>
        </div>
        <TabsList className="grid grid-cols-6 gap-2 h-auto">
          {Array(6).fill(null).map((_, index) => {
            const shiftNumber = index + 1;
            const isLocked = !isShiftUnlocked(shiftNumber);
            return (
              <TabsTrigger
                key={`shift${shiftNumber}`}
                value={`shift${shiftNumber}`}
                disabled={isLocked}
                className="relative w-10 h-10 flex items-center justify-center rounded-md data-[state=active]:bg-primary-50 data-[state=active]:text-primary-600"
              >
                {shiftNumber}
                {isLocked && (
                  <Lock className="absolute right-1 top-1 h-3 w-3" />
                )}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </>
    );
  };

  return (
    <div className="animate-fade-in">
      <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
        <PageHeader 
          title="Instructional Phase" 
          subtitle="6 shifts focused on patient contact with FTP guidance" 
        />
        
        <div className="p-4 md:p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {renderShiftTabs()}
            
            {Array(6).fill(null).map((_, index) => {
              const shiftNumber = index + 1;
              const isLocked = !isShiftUnlocked(shiftNumber);
              
              return (
                <TabsContent key={`content-shift${shiftNumber}`} value={`shift${shiftNumber}`} className="mt-4">
                  {isLocked ? (
                    <div className="flex flex-col items-center justify-center p-6 text-center">
                      <Lock className="h-10 w-10 text-gray-400 mb-3" />
                      <h3 className="text-lg font-medium">Shift {shiftNumber} is Locked</h3>
                      <p className="text-gray-500 mt-2 text-sm">
                        You need to complete Shift {shiftNumber - 1} before you can access Shift {shiftNumber}.
                      </p>
                    </div>
                  ) : (
                    <div className="rounded-lg border p-3 md:p-4">
                      <h3 className="font-medium mb-3 text-primary-700">Shift {shiftNumber}</h3>
                      <p className="text-sm text-gray-600 mb-4">Complete the form for Shift {shiftNumber}</p>
                      <InstructionalShiftForm
                        shiftData={shiftsData[index]}
                        handleChange={(field, value) => handleChange(index, field, value)}
                        handleSubmit={() => handleSubmit(index)}
                        handleSaveDraft={() => handleSaveDraft(index)}
                        shiftNumber={shiftNumber}
                        isSubmitting={isSubmitting}
                      />
                    </div>
                  )}
                </TabsContent>
              );
            })}
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default InstructionalPhase;
