
import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentId } from '@/hooks/assignments/useStudentId';
import { logger } from '@/services/form/utils/loggerService';
import { submitAssignment } from '@/services/formService';
import { diagnosticService } from '@/services/form/utils/diagnosticService';
import { dispatchFormSubmittedEvent } from '@/services/form/utils/eventUtils';
import { supabase } from '@/integrations/supabase/client';

interface FormState {
  [key: string]: {
    content: string;
  }
}

export const useAssignmentOperations = (
  assignments: FormState,
  setAssignments: React.Dispatch<React.SetStateAction<FormState>>, 
  setSubmittedAssignments: React.Dispatch<React.SetStateAction<string[]>>,
  navigateCallback: (path: string) => void
) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { getStudentId } = useStudentId();

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setAssignments(prevAssignments => ({
      ...prevAssignments,
      [name]: { content: value }
    }));
  };

  const handleSave = async (assignmentKey: string) => {
    if (isSaving || !assignmentKey) return;

    try {
      setIsSaving(true);
      
      const studentId = await getStudentId();
      if (!studentId) {
        toast.error('Could not retrieve student information.');
        setIsSaving(false);
        return;
      }

      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      
      // Check if assignment exists
      const { data: existingAssignment } = await supabase
        .from('assignments')
        .select('id')
        .eq('student_id', studentId)
        .eq('assignment_number', assignmentNumber)
        .maybeSingle();
        
      if (existingAssignment) {
        // Update existing assignment
        await supabase
          .from('assignments')
          .update({
            content: { content: assignments[assignmentKey].content },
            updated_at: new Date().toISOString()
          })
          .eq('id', existingAssignment.id);
      } else {
        // Create new draft assignment
        await supabase
          .from('assignments')
          .insert({
            student_id: studentId,
            assignment_number: assignmentNumber,
            content: { content: assignments[assignmentKey].content },
            status: 'draft'
          });
      }
      
      toast.success('Assignment saved as draft!');
    } catch (error) {
      logger.error('Error saving assignment draft', error);
      toast.error('Failed to save assignment.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmit = async (assignmentKey: string) => {
    if (isSubmitting || !assignmentKey) return;

    try {
      // Validate content before submission
      if (!assignments[assignmentKey]?.content || assignments[assignmentKey].content.trim() === '') {
        toast.error("Assignment cannot be empty. Please provide content before submitting.");
        return;
      }

      setIsSubmitting(true);
      const studentId = await getStudentId();

      if (!studentId) {
        toast.error('Could not retrieve student information.');
        setIsSubmitting(false);
        return;
      }

      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      const result = await submitAssignment(
        studentId,
        assignments[assignmentKey].content,
        assignmentNumber
      );

      if (result.success) {
        logger.info(`Assignment ${assignmentNumber} submitted successfully`, { 
          studentId,
          assignmentNumber
        });
        
        // Fix the missing property error - result may have recalculated property
        if (result.recalculated) {
          logger.debug('Progress recalculated after submission', { 
            progress: result.recalculated
          });
        }
        
        // Trigger progress update - using recalculateAllProgress instead of forceProgressRecalculation
        await diagnosticService.recalculateAllProgress(studentId);
        
        setSubmittedAssignments(prev => [...prev, assignmentKey]);
        toast.success('Assignment submitted successfully!');
        
        // Dispatch the event manually to trigger dashboard updates
        dispatchFormSubmittedEvent(studentId);
        navigateCallback('/phases/assignments');
      } else {
        logger.error(`Failed to submit assignment ${assignmentNumber}`, {
          studentId,
          assignmentNumber,
          error: result.error
        });
        toast.error('Failed to submit assignment. Please try again.');
      }
    } catch (error) {
      logger.error('Exception during assignment submission', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSaving,
    isSubmitting,
    isDeleting,
    handleInputChange,
    handleSave,
    handleSubmit
  };
};
