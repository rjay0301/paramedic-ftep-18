
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { updateStudentProgress } from '@/services/form/progressUpdateService';
import { dispatchFormSubmittedEvent } from '@/services/form/utils/eventUtils';
import { logger } from '@/services/form/utils/loggerService';
import { formTrackingService } from '@/services/form/utils/formTrackingService';
import { updateFormSubmission } from '../utils/submissionUtils';
import { FormState } from '../../useAssignmentState';

/**
 * Core hook functionality for submitting assignments
 */
export const useAssignmentSubmitCore = (
  assignments: FormState,
  setIsSaving: (saving: boolean) => void,
  setSubmittedAssignments: (submitted: string[]) => void,
  studentId: string | null
) => {
  /**
   * Submit an assignment
   * @param assignmentKey The key of the assignment to submit
   */
  const handleSubmit = async (assignmentKey: string) => {
    if (!studentId) {
      logger.error('Student ID missing in assignment submission', { assignmentKey });
      toast.error('Could not retrieve student information');
      return;
    }

    setIsSaving(true);
    
    try {
      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      const formData = assignments[assignmentKey];

      logger.info('Assignment submission started', { 
        assignmentKey, 
        assignmentNumber, 
        studentId 
      });

      // Validate content
      if (!formData.content || formData.content.trim() === '') {
        logger.warn('Empty assignment submission attempt', { assignmentKey, studentId });
        toast.error('Assignment cannot be empty');
        setIsSaving(false);
        return;
      }

      // Check if the assignment already exists
      const { data: existingData, error: checkError } = await supabase
        .from('assignments')
        .select('id')
        .eq('student_id', studentId)
        .eq('assignment_number', assignmentNumber)
        .maybeSingle();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        logger.error('Error checking assignment existence', checkError, { 
          assignmentKey, 
          studentId 
        });
        toast.error('Failed to submit assignment');
        setIsSaving(false);
        return;
      }

      let result;
      let assignmentId;
      
      if (existingData) {
        // Update existing assignment
        logger.debug('Updating existing assignment', { 
          assignmentId: existingData.id, 
          assignmentNumber 
        });
        
        assignmentId = existingData.id;
        result = await supabase
          .from('assignments')
          .update({ 
            content: { content: formData.content },
            status: 'submitted' as 'draft' | 'submitted' | 'approved' | 'rejected',
            submitted_at: new Date().toISOString()
          })
          .eq('id', existingData.id);
      } else {
        // Create new assignment
        logger.debug('Creating new assignment', { assignmentNumber });
        
        const insertResult = await supabase
          .from('assignments')
          .insert([
            { 
              student_id: studentId,
              assignment_number: assignmentNumber,
              content: { content: formData.content },
              status: 'submitted' as 'draft' | 'submitted' | 'approved' | 'rejected',
              submitted_at: new Date().toISOString()
            }
          ])
          .select();
          
        result = insertResult;
        assignmentId = insertResult.data?.[0]?.id;
      }

      if (result.error || !assignmentId) {
        logger.error('Error submitting assignment', result.error, { 
          assignmentKey, 
          studentId 
        });
        toast.error('Failed to submit assignment');
        setIsSaving(false);
        return;
      }

      // Track form submission in our logging system
      formTrackingService.trackSubmissionStart('assignments', assignmentId, assignmentNumber, studentId);

      await updateFormSubmission(studentId, assignmentId, assignmentNumber);
      
      await handleSuccessfulSubmission(studentId, assignmentKey, assignmentId, assignmentNumber);
      
    } catch (error) {
      logger.error('Unexpected error in handleSubmit', error, { 
        assignmentKey, 
        studentId 
      });
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Handle post-submission tasks after a successful submission
   */
  const handleSuccessfulSubmission = async (
    studentId: string,
    assignmentKey: string,
    assignmentId: string,
    assignmentNumber: number
  ) => {
    try {
      // Import the utility function dynamically to avoid circular dependencies
      const { getCurrentSubmittedAssignments } = await import('../utils/submissionUtils');
      
      // Update the submitted assignments list
      const currentSubmissions = await getCurrentSubmittedAssignments(studentId);
      const updatedSubmissions = [...new Set([...currentSubmissions, assignmentKey])];
      setSubmittedAssignments(updatedSubmissions);
      
      toast.success('Assignment submitted successfully');
      logger.info('Assignment submitted successfully', { 
        assignmentId, 
        assignmentNumber, 
        studentId 
      });
      
      // Track submission success
      formTrackingService.trackSubmissionSuccess('assignments', assignmentId, assignmentNumber, studentId);
      
      // Update progress tracking - add a small delay to ensure DB processing
      setTimeout(async () => {
        try {
          formTrackingService.trackProgressUpdateStart(studentId);
          await updateStudentProgress(studentId);
          formTrackingService.trackProgressUpdateSuccess(studentId, { assignmentNumber });
          
          // Dispatch event for dashboard update
          dispatchFormSubmittedEvent(studentId);
          formTrackingService.trackEventDispatched('formSubmitted', studentId);
        } catch (progressError) {
          logger.error('Progress update failed', progressError, { 
            assignmentId, 
            studentId 
          });
          formTrackingService.trackProgressUpdateFailure(studentId, progressError);
        }
      }, 500);
    } catch (error) {
      logger.error('Error in handleSuccessfulSubmission', error, {
        studentId,
        assignmentKey,
        assignmentId
      });
      // Even if post-processing fails, the submission itself succeeded
    }
  };

  return { handleSubmit };
};
