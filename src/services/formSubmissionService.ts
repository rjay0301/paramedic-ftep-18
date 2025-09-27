
import { supabase } from '@/integrations/supabase/client';
import { updateStudentProgress } from '@/services/form/progress';
import { dispatchFormSubmittedEvent } from '@/services/form/utils/eventUtils';

/**
 * Gets all form submissions for a student 
 * @param studentId The student ID
 * @returns Array of form submissions or empty array if error
 */
export const getStudentFormSubmissions = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        *,
        form_revisions(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching form submissions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getStudentFormSubmissions:', error);
    return [];
  }
};

/**
 * Gets form revisions for a specific form submission
 * @param formSubmissionId The form submission ID
 * @returns Array of form revisions or empty array if error
 */
export const getFormRevisions = async (formSubmissionId: string) => {
  try {
    const { data, error } = await supabase
      .from('form_revisions')
      .select('*')
      .eq('form_submission_id', formSubmissionId)
      .order('revision_number', { ascending: true });

    if (error) {
      console.error('Error fetching form revisions:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getFormRevisions:', error);
    return [];
  }
};

/**
 * Submits a form and updates progress tracking
 * @param formType The form type
 * @param formId The form ID
 * @param studentId The student ID
 * @param formNumber The form number
 * @returns Success status
 */
export const submitForm = async (
  formType: string, 
  formId: string, 
  studentId: string, 
  formNumber: number
) => {
  try {
    console.log(`Submitting form: ${formType} #${formNumber} for student ${studentId}`);
    
    // Update the specific form table
    const formUpdateResponse = await supabase
      .from(formType)
      .update({ 
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', formId);
      
    if (formUpdateResponse.error) {
      console.error('Error updating form status:', formUpdateResponse.error);
      return false;
    }
    
    // Update the form_submissions table
    const submissionResponse = await supabase
      .from('form_submissions')
      .upsert({
        student_id: studentId,
        form_id: formId,
        form_type: formType,
        form_number: formNumber,
        status: 'submitted',
        submitted_at: new Date().toISOString()
      }, { onConflict: 'student_id,form_type,form_number' });
      
    if (submissionResponse.error) {
      console.error('Error updating form submission:', submissionResponse.error);
      return false;
    }
    
    try {
      // Update progress metrics
      await updateStudentProgress(studentId);
      
      // Dispatch event for UI updates - wait a bit to ensure DB updates are processed
      setTimeout(() => {
        dispatchFormSubmittedEvent(studentId);
      }, 500);
      
      return true;
    } catch (progressError) {
      console.error('Progress update failed, but form was submitted:', progressError);
      // Still return true as the form was submitted successfully
      return true;
    }
  } catch (error) {
    console.error('Error in submitForm:', error);
    return false;
  }
};

// Enable realtime subscriptions for form submissions table
export const setupFormSubmissionsSubscription = async (callback: () => void) => {
  try {
    const channel = supabase
      .channel('form-submissions-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_submissions'
        },
        () => {
          console.log('Form submission updated');
          callback();
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  } catch (error) {
    console.error('Error setting up form submissions subscription:', error);
    return () => {};
  }
};
