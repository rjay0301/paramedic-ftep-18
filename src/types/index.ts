
// Define FormStatus type directly in index.ts
export type FormStatus = 'draft' | 'submitted' | 'completed';

export interface Assignment {
  id: string;
  assignment_number: number;
  title: string;
  description: string;
  content: string;
  status: FormStatus;
}

export interface PhaseItem {
  id: string;
  name: string;
  completed: number;
  total: number;
  locked?: boolean;
  percentage?: number;
}

export type EvaluationScore = 1 | 2 | 3 | "N.P.";

export interface FormDataValue {
  [key: string]: string | number | boolean | null | undefined | string[] | number[] | Record<string, string | number | boolean | null | undefined>;
}

export interface InstructionalPhaseData {
  id?: string;
  shift_number: number;
  shift_date: string | null;
  number_of_patients: number;
  ftp_name: string;
  ftp_corp_id: string;
  ftp_role: string;
  crew_name: string;
  crew_corp_id: string;
  alpha_unit: string;
  hub: string;
  student_objective: string;
  ftp_objective: string;
  feedback: string;
  production_date: string | null;
  production_name: string;
  production_corp_id: string;
  signature: string;
  status: 'draft' | 'submitted';
}

export interface TeamLeadershipAssessment {
  isTeamLeader: boolean;
  providedClearDirection: boolean;
  diagnosisAndTreatmentCorrect: boolean;
  actionsTimely: boolean;
  actionsSafe: boolean;
  actionsAlignedWithSOPs: boolean;
  comments: string;
  // Add field for explanation that's being used
  explanation?: string;
  // Map old field names to new ones for backward compatibility
  performed_as_team_leader?: boolean;
  provided_clear_direction?: boolean;
  diagnosis_and_plan_correct?: boolean;
  actions_timely?: boolean;
  actions_safe?: boolean;
  actions_within_guidelines?: boolean;
  negativeEventsDescription?: string;
}

export interface IndependentPhaseData {
  id?: string;
  shift_number: number;
  shift_date: string | null;
  number_of_patients: number;
  ftp_name: string;
  ftp_corp_id: string;
  ftp_role: string;
  crew_name: string;
  crew_corp_id: string;
  alpha_unit: string;
  hub: string;
  student_objective: string;
  ftp_objective: string;
  team_leadership: TeamLeadershipAssessment;
  production_date: string | null;
  production_name: string;
  production_corp_id: string;
  signature: string;
  status: 'draft' | 'submitted';
}

export interface InstructionalShiftEvaluationData {
  id?: string;
  user_id?: string;
  shift_number: number;
  date: string | null;
  ftp_name: string; 
  ftp_corp_id: string;
  clinical_performance: Record<string, EvaluationScore>;
  operational_performance: Record<string, EvaluationScore>;
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

export interface InstructionalCaseSummaryData {
  id?: string;
  summary_number: number;
  cfs_number: string;
  date: string | null;
  chief_complaint: string;
  priority: 'P1' | 'P2';
  clinical_performance: Record<string, EvaluationScore>;
  skills_performed: string;
  medications_administered: string;
  // Add the missing fields with proper types
  performed_well?: string;
  areas_to_improve?: string;
  ftp_feedback?: string;
  student_signature: string;
  ftp_signature: string;
  status: 'draft' | 'submitted';
}
