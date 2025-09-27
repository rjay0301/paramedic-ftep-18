
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a phase is accessible based on completed phases
 * @param phaseId The ID of the phase to check
 * @param completedPhases Array of completed phase IDs
 * @returns True if the phase is accessible, false otherwise
 */
export const isPhaseAccessible = (phaseId: string, completedPhases: string[]): boolean => {
  // Always accessible phases
  const alwaysAccessible = ['assignments', 'rural-ambulance'];
  
  if (alwaysAccessible.includes(phaseId)) {
    return true;
  }

  // Phase dependencies
  const phaseDependencies: Record<string, string[]> = {
    'observation': [],
    'instructional': ['observation'],
    'instructional-evaluation': ['observation'],
    'instructional-summaries': ['observation'],
    'independent': ['observation', 'instructional', 'instructional-evaluation', 'instructional-summaries'],
    'independent-evaluation': ['observation', 'instructional', 'instructional-evaluation', 'instructional-summaries'],
    'independent-summaries': ['observation', 'instructional', 'instructional-evaluation', 'instructional-summaries'],
    'reflective': ['observation', 'instructional', 'instructional-evaluation', 'instructional-summaries', 'independent', 'independent-evaluation', 'independent-summaries'],
    'final-evaluation': ['observation', 'instructional', 'instructional-evaluation', 'instructional-summaries', 'independent', 'independent-evaluation', 'independent-summaries'],
    'evaluation-forms': ['observation', 'instructional', 'instructional-evaluation', 'instructional-summaries', 'independent', 'independent-evaluation', 'independent-summaries', 'final-evaluation']
  };

  // Phase 2 (addendum) forms are always accessible
  if (phaseId.includes('-2')) {
    return true;
  }

  // Check if all dependencies are completed
  const dependencies = phaseDependencies[phaseId] || [];
  return dependencies.every(dep => completedPhases.includes(dep));
};

/**
 * Gets the completed phases for a student from the database
 * @param studentId The student ID
 * @returns Array of completed phase IDs
 */
export const getCompletedPhases = async (studentId: string): Promise<string[]> => {
  try {
    const { data, error } = await supabase
      .from('student_phase_progress')
      .select('phase_name, is_complete')
      .eq('student_id', studentId);

    if (error) {
      console.error('Error fetching completed phases:', error);
      return [];
    }

    // Return phase names that are marked as complete
    return data
      .filter(phase => phase.is_complete)
      .map(phase => {
        // Convert database phase names to frontend route IDs
        switch(phase.phase_name) {
          case 'assignments': return 'assignments';
          case 'rural_ambulance': return 'rural-ambulance';
          case 'observation': return 'observation';
          case 'instructional': return 'instructional';
          case 'instructional_evaluation': return 'instructional-evaluation';
          case 'instructional_summaries': return 'instructional-summaries';
          case 'independent': return 'independent';
          case 'independent_evaluation': return 'independent-evaluation';
          case 'independent_summaries': return 'independent-summaries';
          case 'reflective': return 'reflective';
          case 'declaration': return 'final-evaluation';
          case 'final_evaluation': return 'evaluation-forms';
          default: return phase.phase_name.replace('_', '-');
        }
      });
  } catch (error) {
    console.error('Error in getCompletedPhases:', error);
    return [];
  }
};

/**
 * Gets the phase progress for a student
 * @param studentId The student ID
 * @returns Object with phase progress data
 */
export const getPhaseProgress = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('student_phase_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('phase_name', { ascending: true });

    if (error) {
      console.error('Error fetching phase progress:', error);
      return [];
    }

    return data.map(phase => ({
      id: convertPhaseNameToId(phase.phase_name),
      name: formatPhaseName(phase.phase_name),
      completed: phase.completed_items,
      total: phase.total_items,
      isComplete: phase.is_complete,
      percentage: phase.completion_percentage,
    }));
  } catch (error) {
    console.error('Error in getPhaseProgress:', error);
    return [];
  }
};

/**
 * Converts a phase name from the database to a frontend route ID
 */
const convertPhaseNameToId = (phaseName: string): string => {
  switch(phaseName) {
    case 'assignments': return 'assignments';
    case 'rural_ambulance': return 'rural-ambulance';
    case 'observation': return 'observation';
    case 'instructional': return 'instructional';
    case 'instructional_evaluation': return 'instructional-evaluation';
    case 'instructional_summaries': return 'instructional-summaries';
    case 'independent': return 'independent';
    case 'independent_evaluation': return 'independent-evaluation';
    case 'independent_summaries': return 'independent-summaries';
    case 'reflective': return 'reflective';
    case 'declaration': return 'final-evaluation';
    case 'final_evaluation': return 'evaluation-forms';
    default: return phaseName.replace('_', '-');
  }
};

/**
 * Formats a phase name for display
 */
const formatPhaseName = (phaseName: string): string => {
  switch(phaseName) {
    case 'assignments': return 'Assignments';
    case 'rural_ambulance': return 'Rural Ambulance';
    case 'observation': return 'Observation';
    case 'instructional': return 'Instructional Phase';
    case 'instructional_evaluation': return 'Instructional Shift Evaluation';
    case 'instructional_summaries': return 'Instructional Case Summaries';
    case 'independent': return 'Independent Phase';
    case 'independent_evaluation': return 'Independent Shift Evaluation';
    case 'independent_summaries': return 'Independent Case Summaries';
    case 'reflective': return 'Reflective Practice Report';
    case 'declaration': return 'Declaration for Final Evaluation';
    case 'final_evaluation': return 'Final Evaluation';
    default: return phaseName.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }
};
