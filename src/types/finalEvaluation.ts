
export type PracticeLevel = 'I' | 'MS' | 'D';

export type ClinicalSkillScore = 1 | 2 | 3 | 4 | 5;
export type OperationalSkillScore = 1 | 2 | 3;

export interface ClinicalSkillEvaluation {
  score: ClinicalSkillScore;
  practiceLevel: PracticeLevel;
}

export interface OperationalSkillEvaluation {
  score: OperationalSkillScore;
  practiceLevel: PracticeLevel;
}

export interface CriticalCriteria {
  unsafeAct: boolean;
  lossOfPatientControl: boolean;
  delegationFailure: boolean;
  equipmentFailure: boolean;
  failedToEstablishAirway: boolean;
  failedToVentilate: boolean;
  failedToOxygenate: boolean;
  failedToControlBleeding: boolean;
  failedToProtectSpine: boolean;
  failedToAssessPatient: boolean;
  failedToProvideInterventions: boolean;
  failedToTransport: boolean;
}

export interface FinalEvaluationFormData {
  id?: string;
  evaluatorName: string;
  date: string | null;
  patientsManaged: number;
  
  // Clinical Skills Evaluation (10 categories)
  sceneSizeUp: ClinicalSkillEvaluation;
  initialAssessment: ClinicalSkillEvaluation;
  focusedHistory: ClinicalSkillEvaluation;
  physicalExam: ClinicalSkillEvaluation;
  vitalSigns: ClinicalSkillEvaluation;
  problemIdentification: ClinicalSkillEvaluation;
  treatmentProcedures: ClinicalSkillEvaluation;
  ongoingAssessment: ClinicalSkillEvaluation;
  liftingMoving: ClinicalSkillEvaluation;
  informationTransfer: ClinicalSkillEvaluation;
  
  // Operational Skills Evaluation (7 categories)
  standardOperatingProcedures: OperationalSkillEvaluation;
  safety: OperationalSkillEvaluation;
  startOfShiftProcedures: OperationalSkillEvaluation;
  endOfShiftProcedures: OperationalSkillEvaluation;
  radioCommunications: OperationalSkillEvaluation;
  storesAndRestock: OperationalSkillEvaluation;
  systemKnowledge: OperationalSkillEvaluation;
  
  // Critical Criteria
  criticalCriteria: CriticalCriteria;
  
  // Comments
  comments: string;
  additionalComments: string;
  
  // Signatures
  evaluatorSignature: string;
  evaluatorSignatureDate: string | null;
  studentSignature: string;
  studentSignatureDate: string | null;
  deltaProductionSignature: string;
  
  // Form status
  status: 'draft' | 'submitted';
}
