
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName } from '@/types/forms';
import { toast } from 'sonner';

/**
 * Check if a form exists for a student
 * @param formType The type of form
 * @param studentId The student ID
 * @param formNumber The form number
 * @returns Whether the form exists and its ID if it does
 */
export const checkFormExists = async (
  formType: ValidTableName,
  studentId: string,
  formNumber: number
): Promise<{ exists: boolean; formId?: string }> => {
  try {
    // Determine the field name for the form number based on the form type
    let formNumberField = 'form_number';
    
    if (formType === 'assignments') {
      formNumberField = 'assignment_number';
    } else if (
      formType === 'rural_ambulance_orientations' ||
      formType === 'observational_shifts' ||
      formType === 'instructional_shifts' ||
      formType === 'instructional_shift_evaluations' ||
      formType === 'independent_shifts' ||
      formType === 'independent_shift_evaluations' ||
      formType === 'final_evaluations'
    ) {
      formNumberField = 'shift_number';
    } else if (
      formType === 'instructional_case_summaries' || 
      formType === 'independent_case_summaries'
    ) {
      formNumberField = 'summary_number';
    }
    
    // Query to check if form exists
    const { data, error } = await supabase
      .from(formType)
      .select('id')
      .eq('student_id', studentId)
      .eq(formNumberField, formNumber)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') {
      console.error(`Error checking if ${formType} exists:`, error);
      return { exists: false };
    }
    
    return { 
      exists: !!data, 
      formId: data?.id 
    };
  } catch (error) {
    console.error(`Error in checkFormExists for ${formType}:`, error);
    return { exists: false };
  }
};

/**
 * Check if form exists in the form_submissions table
 * @param studentId The student ID
 * @param formType The type of form
 * @param formNumber The form number
 * @returns Whether a submission exists
 */
export const checkFormSubmissionExists = async (
  studentId: string,
  formType: string,
  formNumber: number
): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select('id')
      .eq('student_id', studentId)
      .eq('form_type', formType)
      .eq('form_number', formNumber)
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking form submission:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in checkFormSubmissionExists:', error);
    return false;
  }
};
