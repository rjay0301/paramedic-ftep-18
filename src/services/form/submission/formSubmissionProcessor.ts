
import { supabase } from '@/integrations/supabase/client';
import { updateStudentProgress } from '../progress';
import { dispatchFormSubmittedEvent } from '../utils/eventUtils';
import { logger } from '../utils/loggerService';
import { formTrackingService } from '../utils/formTrackingService';
import { progressDiagnosticService } from '../utils/progressDiagnosticService';

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
): Promise<boolean> => {
  // Start tracking the submission process
  formTrackingService.trackSubmissionStart(formType, formId, formNumber, studentId);
  
  try {
    logger.info(`Submitting form: ${formType} #${formNumber}`, { 
      formType, 
      formId, 
      studentId, 
      formNumber 
    });
    
    // Update the specific form table
    const formUpdateResponse = await supabase
      .from(formType)
      .update({ 
        status: 'submitted',
        submitted_at: new Date().toISOString()
      })
      .eq('id', formId);
      
    if (formUpdateResponse.error) {
      logger.error('Error updating form status', formUpdateResponse.error, { 
        formType, 
        formId 
      });
      
      formTrackingService.trackSubmissionFailure(
        formType, 
        formId, 
        formNumber, 
        studentId, 
        formUpdateResponse.error
      );
      
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
      }, { 
        onConflict: 'student_id,form_type,form_number',
        ignoreDuplicates: false // Make sure we update existing records
      });
      
    if (submissionResponse.error) {
      logger.error('Error updating form submission', submissionResponse.error, {
        formType, 
        formId, 
        studentId, 
        formNumber
      });
      
      formTrackingService.trackSubmissionFailure(
        formType, 
        formId, 
        formNumber, 
        studentId, 
        submissionResponse.error
      );
      
      return false;
    }
    
    try {
      // Track beginning of progress update
      formTrackingService.trackProgressUpdateStart(studentId);
      
      // Instead of just updating progress, fix progress issues to ensure consistency
      await progressDiagnosticService.fixProgressIssues(studentId);
      
      // Track successful progress update
      formTrackingService.trackProgressUpdateSuccess(studentId, {
        formType,
        formNumber
      });
      
      // Dispatch event for UI updates with a longer delay to ensure DB updates are processed
      setTimeout(() => {
        dispatchFormSubmittedEvent(studentId);
        formTrackingService.trackEventDispatched('formSubmitted', studentId);
      }, 1000);
      
      // Track successful submission
      formTrackingService.trackSubmissionSuccess(formType, formId, formNumber, studentId);
      
      return true;
    } catch (progressError) {
      logger.error('Progress update failed, but form was submitted', progressError, {
        formType,
        formId,
        studentId,
        formNumber
      });
      
      formTrackingService.trackProgressUpdateFailure(studentId, progressError);
      
      // Still return true as the form was submitted successfully
      return true;
    }
  } catch (error) {
    logger.error('Error in submitForm', error, { 
      formType, 
      formId, 
      studentId, 
      formNumber 
    });
    
    formTrackingService.trackSubmissionFailure(
      formType, 
      formId, 
      formNumber, 
      studentId, 
      error
    );
    
    return false;
  }
};
