
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { updateProgressRecord } from '../utils/dbUpdateUtils';
import { phaseFormCounts, totalFormCount, formTypeToPhase } from '../constants/phaseConstants';
import { logger } from '../utils/loggerService';

/**
 * Update student progress based on submitted forms
 * @param studentId The student ID
 */
export const updateStudentProgress = async (studentId: string): Promise<void> => {
  try {
    logger.info(`Updating progress for student: ${studentId}`);
    
    // Get all form submissions for this student
    const { data: submissions, error: submissionsError } = await supabase
      .from('form_submissions')
      .select('id, form_type, form_number, status, submitted_at')
      .eq('student_id', studentId);

    if (submissionsError) {
      if (submissionsError.code === 'PGRST116') {
        // Table doesn't exist - we're in offline/demo mode
        logger.info('Form submissions table not found - offline mode detected');
        return;
      }
      
      logger.error('Error fetching submissions for progress update', submissionsError, { studentId });
      throw new Error(`Failed to fetch submissions: ${submissionsError.message}`);
    }

    // Log and filter submissions to only include those with 'submitted' status
    logger.debug(`Found ${submissions?.length || 0} total form records`);
    const submittedForms = submissions?.filter(sub => sub.status === 'submitted') || [];
    logger.debug(`Found ${submittedForms.length} submitted forms with status 'submitted'`);

    // Create phase tracking objects
    const phaseCounters: Record<string, Set<number>> = {};
    
    // Initialize counter sets for each phase 
    Object.keys(phaseFormCounts).forEach(phase => {
      phaseCounters[phase] = new Set<number>();
    });
    
    // Count submitted forms for each phase 
    for (const submission of submittedForms) {
      const phase = formTypeToPhase[submission.form_type];
      
      if (!phase) {
        logger.warn(`Unknown form type: ${submission.form_type}`, { submission });
        continue;
      }
      
      // Add form number to the set (prevents duplicate counting)
      phaseCounters[phase].add(submission.form_number);
      logger.debug(`Added ${submission.form_type} #${submission.form_number} to phase ${phase}`);
    }
    
    logger.debug('Form counts per phase:', 
      Object.fromEntries(Object.entries(phaseCounters).map(
        ([phase, set]) => [phase, Array.from(set)]
      ))
    );
    
    // Calculate phase completion and total forms
    let totalCompletedForms = 0;
    const completedPhases = [];
    
    // Update phase progress for each phase
    for (const phase of Object.keys(phaseFormCounts)) {
      const completedItems = phaseCounters[phase]?.size || 0;
      const totalItems = phaseFormCounts[phase];
      
      totalCompletedForms += completedItems;
      
      if (completedItems >= totalItems) {
        completedPhases.push(phase);
      }
      
      logger.debug(`Phase ${phase}: ${completedItems}/${totalItems}`);
      await updatePhaseProgress(studentId, phase, completedItems, totalItems);
    }
    
    // Update overall progress
    await updateProgressRecord(studentId, completedPhases.length, totalCompletedForms, totalFormCount);
    
    logger.info(`Progress updated for student ${studentId}: ${totalCompletedForms}/${totalFormCount} forms completed, ${completedPhases.length} phases completed`);
    
  } catch (error) {
    logger.error('Error in updateStudentProgress', error, { studentId });
    toast.error('Failed to update progress. Please refresh and try again.');
  }
};

/**
 * Update progress for a specific phase
 * @param studentId The student ID
 * @param phase The phase name
 * @param completedItems Number of completed items
 * @param totalItems Total items in phase
 */
const updatePhaseProgress = async (
  studentId: string,
  phase: string,
  completedItems: number,
  totalItems: number
): Promise<void> => {
  try {
    // Calculate completion percentage
    const completionPercentage = Math.round((completedItems / totalItems) * 100);
    const isComplete = completedItems >= totalItems;
    
    // Check if phase progress record exists
    const { data: existingProgress, error: checkError } = await supabase
      .from('student_phase_progress')
      .select('id')
      .eq('student_id', studentId)
      .eq('phase_name', phase)
      .maybeSingle();
      
    if (checkError && checkError.code === 'PGRST116') {
      // Table doesn't exist - silently return in offline mode
      logger.debug(`Phase progress table not found - offline mode`);
      return;
    }

    if (existingProgress) {
      // Update existing phase progress
      const { error } = await supabase
        .from('student_phase_progress')
        .update({
          total_items: totalItems,
          completed_items: completedItems,
          is_complete: isComplete,
          completion_percentage: completionPercentage,
          updated_at: new Date().toISOString()
        })
        .eq('student_id', studentId)
        .eq('phase_name', phase);
        
      if (error) {
        logger.error(`Error updating phase ${phase} progress:`, error, { studentId, phase });
        throw error;
      }
    } else {
      // Insert new phase progress
      const { error } = await supabase
        .from('student_phase_progress')
        .insert({
          student_id: studentId,
          phase_name: phase,
          total_items: totalItems,
          completed_items: completedItems,
          is_complete: isComplete,
          completion_percentage: completionPercentage
        });
        
      if (error && error.code !== 'PGRST116') {
        logger.error(`Error creating phase ${phase} progress:`, error, { studentId, phase });
        throw error;
      }
    }
    
    logger.debug(`Updated phase ${phase} progress: ${completedItems}/${totalItems} (${completionPercentage}%)`, { studentId });
  } catch (error) {
    logger.error(`Exception updating phase ${phase} progress:`, error, { studentId, phase });
    // Don't rethrow the error - we want to continue with other phases even if one fails
  }
};
