
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { FormState } from '../../useAssignmentState';
import { logger } from '@/services/form/utils/loggerService';

/**
 * Core hook functionality for saving assignment drafts
 */
export const useAssignmentDraftCore = (
  assignments: FormState,
  setIsSaving: (saving: boolean) => void,
  studentId: string | null
) => {
  /**
   * Save an assignment as a draft
   * @param assignmentKey The key of the assignment to save
   */
  const handleSaveDraft = async (assignmentKey: string) => {
    if (!studentId) {
      logger.error('Student ID missing in assignment draft save', { assignmentKey });
      toast.error('Could not retrieve student information');
      return;
    }

    setIsSaving(true);
    
    try {
      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      const formData = assignments[assignmentKey];

      logger.info('Assignment draft save started', { 
        assignmentKey, 
        assignmentNumber, 
        studentId 
      });

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
        toast.error('Failed to save assignment');
        setIsSaving(false);
        return;
      }

      let result;
      
      if (existingData) {
        // Update existing assignment
        logger.debug('Updating existing draft assignment', { 
          assignmentId: existingData.id, 
          assignmentNumber 
        });
        
        result = await supabase
          .from('assignments')
          .update({ 
            content: { content: formData.content },
            status: 'draft' as 'draft' | 'submitted' | 'approved' | 'rejected'
          })
          .eq('id', existingData.id);
      } else {
        // Create new assignment
        logger.debug('Creating new draft assignment', { assignmentNumber });
        
        result = await supabase
          .from('assignments')
          .insert([
            { 
              student_id: studentId,
              assignment_number: assignmentNumber,
              content: { content: formData.content },
              status: 'draft' as 'draft' | 'submitted' | 'approved' | 'rejected'
            }
          ]);
      }

      if (result.error) {
        logger.error('Error saving assignment draft', result.error, { 
          assignmentKey, 
          studentId 
        });
        toast.error('Failed to save assignment');
        return;
      }

      logger.info('Assignment draft saved successfully', { 
        assignmentKey, 
        assignmentNumber, 
        studentId 
      });
      toast.success('Assignment saved as draft');
    } catch (error) {
      logger.error('Unexpected error in handleSaveDraft', error, { 
        assignmentKey, 
        studentId 
      });
      toast.error('An unexpected error occurred');
    } finally {
      setIsSaving(false);
    }
  };

  return { handleSaveDraft };
};
