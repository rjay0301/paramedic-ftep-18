
import { PhaseItem } from '@/types';

export const formCounts = {
  'assignments': 6,
  'rural-ambulance': 2,
  'observation': 2,
  'instructional': 6,
  'instructional-evaluation': 6,
  'instructional-summaries': 20,
  'independent': 6,
  'independent-evaluation': 6,
  'independent-summaries': 10,
  'reflective': 1,
  'final-evaluation': 1,
  'evaluation-forms': 8,
};

export const calculateTotalFormCount = () => {
  return Object.values(formCounts).reduce((sum, count) => sum + count, 0);
};

export const calculateCompletedForms = (phases: PhaseItem[]) => {
  return phases.reduce((sum, phase) => {
    const phaseTotal = formCounts[phase.id as keyof typeof formCounts] || 0;
    const completionPercentage = phase.completed ? phase.completed / (phase.total || 1) : 0;
    return sum + (phaseTotal * completionPercentage);
  }, 0);
};

export const calculateProgressPercentage = (
  completedForms: number,
  totalForms: number
) => {
  return Math.round((completedForms / totalForms) * 100);
};
