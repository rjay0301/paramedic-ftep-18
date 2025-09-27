
import { supabase } from '@/integrations/supabase/client';
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
    
    // Check if a progress record exists
    const { data: existingRecord, error: checkError } = await supabase
      .from('student_overall_progress')
      .select('id')
      .eq('student_id', studentId)
      .maybeSingle();
      
    if (checkError && checkError.code === 'PGRST116') {
      // Table doesn't exist - offline mode
      logger.debug(`Overall progress table not found - offline mode`);
      return false;
    }
      
    let result;
    
    if (existingRecord) {
      // Update existing record
      result = await supabase
        .from('student_overall_progress')
        .update({
          completed_phases: completedPhases,
          total_phases: 12,  // Hardcoded from custom instructions
          completed_forms: completedForms,
          total_forms: totalForms,
          overall_percentage: overallPercentage,
          is_complete: isComplete,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingRecord.id);
    } else {
      // Create new record
      result = await supabase
        .from('student_overall_progress')
        .insert({
          student_id: studentId,
          completed_phases: completedPhases,
          total_phases: 12,  // Hardcoded from custom instructions
          completed_forms: completedForms,
          total_forms: totalForms,
          overall_percentage: overallPercentage,
          is_complete: isComplete
        });
    }
    
    if (result.error && result.error.code !== 'PGRST116') {
      logger.error('Error updating progress record:', result.error);
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
    const { error } = await supabase
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
