
import { supabase } from '@/integrations/supabase/client';
import { PhaseItem } from '@/types';
import { isPhaseAccessible } from '@/utils/validation';

/**
 * Retrieves all available phases for the application
 * @returns Array of phase items with their details
 */
export const getPhases = async (): Promise<PhaseItem[]> => {
  try {
    // For demonstration purposes - in production, this would come from the database
    const phases: PhaseItem[] = [
      { id: 'assignments', name: 'Assignments', completed: 0, total: 6, locked: false },
      { id: 'rural-ambulance', name: 'Rural Ambulance', completed: 0, total: 2, locked: false },
      { id: 'observation', name: 'Observation Phase', completed: 0, total: 2, locked: false },
      { id: 'instructional', name: 'Instructional Phase', completed: 0, total: 6, locked: false },
      { id: 'instructional-evaluation', name: 'Instructional Shift Evaluation', completed: 0, total: 6, locked: false },
      { id: 'instructional-summaries', name: 'Instructional Case Summaries', completed: 0, total: 20, locked: false },
      { id: 'independent', name: 'Independent Phase', completed: 0, total: 6, locked: false },
      { id: 'independent-evaluation', name: 'Independent Shift Evaluation', completed: 0, total: 6, locked: false },
      { id: 'independent-summaries', name: 'Independent Case Summaries', completed: 0, total: 10, locked: false },
      { id: 'reflective', name: 'Reflective Practice', completed: 0, total: 1, locked: false },
      { id: 'final-evaluation', name: 'Declaration of Readiness', completed: 0, total: 1, locked: false },
      { id: 'evaluation-forms', name: 'Final Evaluation', completed: 0, total: 4, locked: false },
      
      // Addendum forms - one copy of each form type
      { id: 'instructional-copy-1', name: 'Instructional Phase', completed: 0, total: 1, locked: false },
      { id: 'instructional-evaluation-copy-1', name: 'Instructional Shift Evaluation', completed: 0, total: 1, locked: false },
      { id: 'independent-copy-1', name: 'Independent Phase', completed: 0, total: 1, locked: false },
      { id: 'independent-evaluation-copy-1', name: 'Independent Shift Evaluation', completed: 0, total: 1, locked: false },
      { id: 'final-evaluation-copy-1', name: 'Final Evaluation', completed: 0, total: 1, locked: false },
    ];
    
    // In a real app, we would fetch completion data from the database
    // and update the phases with actual completion information
    
    return phases;
  } catch (error) {
    console.error('Error fetching phases:', error);
    return [];
  }
};

/**
 * Retrieves the list of completed phase IDs for the current user
 * @returns Array of completed phase IDs
 */
export const getCompletedPhases = async (): Promise<string[]> => {
  try {
    // In production, this would query the database for the current user's completed phases
    // For now, we'll return some mock data
    
    // This would fetch from a table like student_phase_progress where is_complete = true
    return ['assignments', 'rural-ambulance', 'observation']; // Mock data
  } catch (error) {
    console.error('Error fetching completed phases:', error);
    return [];
  }
};

/**
 * Updates the completion status of a phase
 * @param phaseId ID of the phase to update
 * @param completed Whether the phase is completed
 */
export const updatePhaseCompletion = async (phaseId: string, completed: boolean): Promise<void> => {
  try {
    // In production, this would update the database
    console.log(`Phase ${phaseId} completion updated to ${completed}`);
  } catch (error) {
    console.error('Error updating phase completion:', error);
  }
};
