
import { EvaluationScore } from './index';

export interface ClinicalAssessment {
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
}

export interface IndependentCaseSummaryData {
  summary_number: number;
  cfs_number: string;
  date: Date | null;
  chief_complaint: string;
  priority: 'P1' | 'P2';
  clinical_assessment: ClinicalAssessment;
  skills_performed: string;
  medications_administered: string;
  best_performance: string;
  needs_improvement: string;
  improvement_plan: string;
  discussed_with_ftp: boolean;
  ftp_signature: string;
  student_signature: string;
  status: 'draft' | 'submitted';
}
