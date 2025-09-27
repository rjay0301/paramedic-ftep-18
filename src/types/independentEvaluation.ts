
import { EvaluationScore } from './index';

export type ClinicalAssessment = {
  patientAssessment: EvaluationScore;
  assessmentSkills: EvaluationScore;
  historyTaking: EvaluationScore;
  nccCtlUpdate: EvaluationScore;
  sceneControl: EvaluationScore;
  patientMovement: EvaluationScore;
  provisionalDiagnosis: EvaluationScore;
  recognizingSeverity: EvaluationScore;
  treatmentPlan: EvaluationScore;
  priorityToHospital: EvaluationScore;
  traumaManagement: EvaluationScore;
  cardiacManagement: EvaluationScore;
  medicalManagement: EvaluationScore;
  pediatricManagement: EvaluationScore;
  airwayManagement: EvaluationScore;
  medicationAdmin: EvaluationScore;
  equipment: EvaluationScore;
  handover: EvaluationScore;
  pcrDocumentation: EvaluationScore;
  patientCommunication: EvaluationScore;
};

export type OperationalAssessment = {
  generalAppearance: EvaluationScore;
  acceptanceOfFeedback: EvaluationScore;
  attitudeToEMS: EvaluationScore;
  downtimeUtilization: EvaluationScore;
  safety: EvaluationScore;
  startOfShiftProcedures: EvaluationScore;
  endOfShiftProcedures: EvaluationScore;
  radioCommunications: EvaluationScore;
  mdtUse: EvaluationScore;
  storesAndRestock: EvaluationScore;
  medicationHandling: EvaluationScore;
};

export type IndependentShiftEvaluationData = {
  id?: string;
  user_id?: string;
  shift_number: number;
  date: string | null;
  clinical_assessment: ClinicalAssessment;
  operational_assessment: OperationalAssessment;
  best_performance: string;
  needs_improvement: string;
  improvement_plan: string;
  discussed_with_ftp: boolean;
  ftp_signature: string;
  student_signature: string;
  status: 'draft' | 'submitted';
  created_at?: string;
  updated_at?: string;
};
