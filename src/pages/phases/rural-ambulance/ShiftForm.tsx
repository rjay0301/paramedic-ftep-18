
import React from 'react';
import { Lock } from 'lucide-react';
import ShiftInfoSection from './ShiftInfoSection';
import AssessmentSection from './AssessmentSection';
import VerificationSection from './VerificationSection';
import { ShiftFormProps } from './types';

const ShiftForm: React.FC<ShiftFormProps> = ({
  shiftData,
  handleChange,
  handleAssessmentChange,
  handleSubmit,
  handleSaveDraft,
  shiftNumber,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <ShiftInfoSection 
        shiftData={shiftData}
        handleChange={handleChange}
        shiftNumber={shiftNumber}
      />
      
      <AssessmentSection 
        shiftData={shiftData}
        handleChange={handleChange}
        handleAssessmentChange={handleAssessmentChange}
        shiftNumber={shiftNumber}
      />
      
      <VerificationSection 
        shiftData={shiftData}
        handleChange={handleChange}
        shiftNumber={shiftNumber}
        handleSubmit={handleSubmit}
        handleSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export const LockedShiftForm: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <Lock className="h-12 w-12 text-gray-400 mb-4" />
      <h3 className="text-lg font-medium">Shift 2 is Locked</h3>
      <p className="text-gray-500 mt-2">
        You need to complete Shift 1 before you can access Shift 2.
      </p>
    </div>
  );
};

export default ShiftForm;
