
import { Dispatch, SetStateAction } from 'react';

export type AssessmentStatus = 'competent' | 'not_competent' | null;

export type ShiftData = {
  ftpName: string;
  ftpCorpId: string;
  ftpRole: 'driver' | 'attendant' | '';
  crewName: string;
  crewCorpId: string;
  date: Date | null;
  alphaUnit: string;
  hub: string;
  numberOfPatients: string;
  assessments: {
    loadingStretcher: AssessmentStatus;
    unloadingStretcher: AssessmentStatus;
    safetyFeatures: AssessmentStatus;
    cabinFamiliarization: AssessmentStatus;
  };
  comments: string;
  productionName: string;
  productionCorpId: string;
  productionDate: Date | null;
  signature: string;
  isComplete: boolean;
};

export interface ShiftFormProps {
  shiftData: ShiftData;
  handleChange: (field: keyof ShiftData, value: any) => void;
  handleAssessmentChange: (assessment: keyof ShiftData['assessments'], value: AssessmentStatus) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  shiftNumber: number;
  isSubmitting: boolean;
}
