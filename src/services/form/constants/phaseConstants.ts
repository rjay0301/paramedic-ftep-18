
// Define form count constants for each phase
export const phaseFormCounts = {
  'assignments': 6,
  'rural_ambulance': 2,
  'observation': 2,
  'instructional': 6,
  'instructional_evaluation': 6,
  'instructional_summaries': 20,
  'independent': 6,
  'independent_evaluation': 6,
  'independent_summaries': 10,
  'reflective': 1,
  'declaration': 1,
  'final_evaluation': 4
};

// Total form count
export const totalFormCount = Object.values(phaseFormCounts).reduce((sum, count) => sum + count, 0);

// Mapping from form type to phase
export const formTypeToPhase: Record<string, string> = {
  'assignments': 'assignments',
  'rural_ambulance_orientations': 'rural_ambulance',
  'observational_shifts': 'observation',
  'instructional_shifts': 'instructional',
  'instructional_shift_evaluations': 'instructional_evaluation',
  'instructional_case_summaries': 'instructional_summaries',
  'independent_shifts': 'independent',
  'independent_shift_evaluations': 'independent_evaluation',
  'independent_case_summaries': 'independent_summaries',
  'reflective_practice_reports': 'reflective',
  'declarations_of_readiness': 'declaration',
  'final_evaluations': 'final_evaluation'
};
