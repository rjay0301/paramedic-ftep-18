
import { useState } from 'react';
import { FormState } from './useAssignmentState';
import { useSaveSubmission, useUpdateSubmission } from '@/hooks/useSubmissions';
import { useAuth } from '@/contexts/auth/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/services/form/utils/loggerService';

/**
 * Hook for handling assignment submission
 */
export const useAssignmentSubmission = (
  assignments: FormState,
  setIsSaving: (saving: boolean) => void,
  setSubmittedAssignments: (assignments: string[]) => void
) => {
  const { user } = useAuth();
  const [currentSubmissions, setCurrentSubmissions] = useState<Record<string, string>>({});
  const saveSubmission = useSaveSubmission();
  const updateSubmission = useUpdateSubmission();

  /**
   * Save the current state as a draft
   */
  const handleSaveDraft = async (assignmentKey: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to save drafts');
      return;
    }

    setIsSaving(true);
    try {
      const assignmentData = assignments[assignmentKey];
      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      
      // Check if we already have a submission ID for this assignment
      if (currentSubmissions[assignmentKey]) {
        await updateSubmission.mutateAsync({
          submissionId: currentSubmissions[assignmentKey],
          formData: {
            content: assignmentData.content,
            assignmentNumber
          },
          status: 'draft'
        });
      } else {
        // Get the assignment phase ID (this would come from your training_phases table)
        // For now, let's use a placeholder
        const { data: phaseData } = await supabase
          .from('training_phases')
          .select('id')
          .eq('name', 'Assignments')
          .maybeSingle();
          
        const phaseId = phaseData?.id || '00000000-0000-0000-0000-000000000000'; // Placeholder
        
        const result = await saveSubmission.mutateAsync({
          studentId: user.id,
          phaseId: phaseId,
          formData: {
            content: assignmentData.content,
            assignmentNumber
          },
          status: 'draft'
        });
        
        setCurrentSubmissions(prev => ({
          ...prev,
          [assignmentKey]: result.id
        }));
      }
      
      toast.success('Draft saved successfully');
      logger.info(`Assignment ${assignmentKey} draft saved`);
    } catch (error) {
      logger.error(`Error saving assignment draft for ${assignmentKey}:`, error);
      toast.error('Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  /**
   * Submit the assignment for review
   */
  const handleSubmit = async (assignmentKey: string) => {
    if (!user?.id) {
      toast.error('You must be logged in to submit assignments');
      return;
    }

    setIsSaving(true);
    try {
      const assignmentData = assignments[assignmentKey];
      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      
      // Check if we already have a submission ID for this assignment
      if (currentSubmissions[assignmentKey]) {
        await updateSubmission.mutateAsync({
          submissionId: currentSubmissions[assignmentKey],
          formData: {
            content: assignmentData.content,
            assignmentNumber
          },
          status: 'submitted'
        });
      } else {
        // Get the assignment phase ID
        const { data: phaseData } = await supabase
          .from('training_phases')
          .select('id')
          .eq('name', 'Assignments')
          .maybeSingle();
          
        const phaseId = phaseData?.id || '00000000-0000-0000-0000-000000000000'; // Placeholder
        
        await saveSubmission.mutateAsync({
          studentId: user.id,
          phaseId: phaseId,
          formData: {
            content: assignmentData.content,
            assignmentNumber
          },
          status: 'submitted'
        });
      }
      
      // Fix TypeScript error by providing an explicit string array
      const updatedAssignments = [...(Array.isArray(assignments) ? assignments : [])];
      if (!updatedAssignments.includes(assignmentKey)) {
        updatedAssignments.push(assignmentKey);
      }
      setSubmittedAssignments(updatedAssignments);
      
      toast.success('Assignment submitted successfully');
      logger.info(`Assignment ${assignmentKey} submitted`);
    } catch (error) {
      logger.error(`Error submitting assignment ${assignmentKey}:`, error);
      toast.error('Failed to submit assignment');
    } finally {
      setIsSaving(false);
    }
  };

  return {
    handleSaveDraft,
    handleSubmit
  };
};
