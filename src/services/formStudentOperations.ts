
import { PostgrestSingleResponse } from '@supabase/postgrest-js';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/form/utils/loggerService';
import { submitForm } from '@/services/form/formSubmissionService';
import { updateStudentProgress } from '@/services/form/progress';

/**
 * Get all records for a student
 * @param table The table name
 * @param studentId The student ID
 * @returns The records
 */
export async function getRecordsByStudentId<T extends Record<string, any>>(
  table: string,
  studentId: string
): Promise<PostgrestSingleResponse<T[]>> {
  return supabase
    .from(table as any)
    .select('*')
    .eq('student_id', studentId) as unknown as Promise<PostgrestSingleResponse<T[]>>;
}

/**
 * Get a record by student ID and form number
 * @param table The table name
 * @param studentId The student ID
 * @param formNumberField The form number field name
 * @param formNumber The form number
 * @returns The record
 */
export async function getRecordByStudentIdAndFormNumber<T extends Record<string, any>>(
  table: string,
  studentId: string,
  formNumberField: string,
  formNumber: number
): Promise<PostgrestSingleResponse<T>> {
  return supabase
    .from(table as any)
    .select('*')
    .eq('student_id', studentId)
    .eq(formNumberField, formNumber)
    .single() as unknown as Promise<PostgrestSingleResponse<T>>;
}

/**
 * Submit an assignment with the given content
 * @param studentId The student ID
 * @param content The assignment content
 * @param assignmentNumber The assignment number
 * @returns Success response with recalculated progress if successful
 */
export const submitAssignment = async (
  studentId: string, 
  content: string,
  assignmentNumber: number
) => {
  try {
    logger.info('Submitting assignment', { studentId, assignmentNumber });
    
    // Create the assignment record
    const { data, error } = await supabase
      .from('assignments')
      .insert({
        student_id: studentId,
        assignment_number: assignmentNumber,
        content: { content }, // Wrap in object for jsonb column
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      logger.error('Error creating assignment', error, { 
        studentId, 
        assignmentNumber 
      });
      return { success: false, error: error.message };
    }

    // Submit the form to update progress
    const formSubmitResult = await submitForm(
      'assignments',
      data.id,
      studentId,
      assignmentNumber
    );

    if (!formSubmitResult) {
      logger.error('Error submitting assignment form', null, { 
        studentId, 
        assignmentNumber,
        formId: data.id
      });
      return { success: false, error: 'Failed to update progress tracking' };
    }

    // Force a progress recalculation to ensure dashboard is updated
    let recalculated = null;
    try {
      recalculated = await updateStudentProgress(studentId);
      logger.info('Progress recalculated after assignment submission', { 
        studentId,
        recalculated
      });
    } catch (recalcError) {
      logger.error('Failed to recalculate progress', recalcError, { studentId });
      // Continue despite recalculation error
    }

    return { 
      success: true, 
      assignmentId: data.id,
      recalculated
    };
  } catch (error: any) {
    logger.error('Exception in submitAssignment', error, { 
      studentId, 
      assignmentNumber 
    });
    return { success: false, error: error.message || 'Unknown error' };
  }
};
