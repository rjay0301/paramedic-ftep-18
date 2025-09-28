
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { logger } from './loggerService';

/**
 * Updates a student's progress record
 * @param studentId The student ID
 * @param completedPhases Number of completed phases
 * @param completedForms Number of completed forms
 * @param totalForms Total number of forms
 * @returns Success status
 */
export const updateProgressRecord = async (
  studentId: string,
  completedPhases: number,
  completedForms: number,
  totalForms: number
): Promise<boolean> => {
  try {
    // Calculate overall percentage with proper rounding
    const overallPercentage = Math.round((completedForms / totalForms) * 100);
    const isComplete = completedForms >= totalForms;
    
    logger.debug(`Updating overall progress for student ${studentId}: ${completedForms}/${totalForms} = ${overallPercentage}%`);
    
    // Always upsert to avoid selecting non-existent columns on views
    const { error } = await sb
      .from('student_overall_progress')
      .upsert({
        student_id: studentId,
        completed_phases: completedPhases,
        total_phases: 12,  // Hardcoded from custom instructions
        completed_forms: completedForms,
        total_forms: totalForms,
        overall_percentage: overallPercentage,
        is_complete: isComplete,
        updated_at: new Date().toISOString()
      }, { onConflict: 'student_id' });

    if (error && error.code !== 'PGRST116') {
      logger.error('Error updating progress record:', error);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error in updateProgressRecord:', error);
    return false;
  }
};

/**
 * Updates a single form submission status
 * @param studentId The student ID
 * @param formType The form type
 * @param formNumber The form number
 * @param status The new status
 * @returns Success status
 */
export const updateFormSubmissionStatus = async (
  studentId: string,
  formType: string,
  formNumber: number,
  status: 'draft' | 'submitted'
): Promise<boolean> => {
  try {
  const { error } = await sb
    .from('form_submissions')
    .upsert({
      student_id: studentId,
      form_type: formType,
      form_number: formNumber,
      status: status,
      submitted_at: status === 'submitted' ? new Date().toISOString() : null
    }, {
      onConflict: 'student_id,form_type,form_number'
    });
      
    if (error && error.code !== 'PGRST116') {
      logger.error('Error updating form submission status:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in updateFormSubmissionStatus:', error);
    return false;
  }
};
