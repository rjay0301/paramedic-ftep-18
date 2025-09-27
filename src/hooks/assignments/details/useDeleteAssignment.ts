
import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentId } from '@/hooks/assignments/useStudentId';
import { logger } from '@/services/form/utils/loggerService';
import { diagnosticService } from '@/services/form/utils/diagnosticService';
import { supabase } from '@/integrations/supabase/client';

export const useDeleteAssignment = (
  setAssignments: React.Dispatch<React.SetStateAction<any>>,
  setSubmittedAssignments: React.Dispatch<React.SetStateAction<string[]>>,
  navigateCallback: (path: string) => void
) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { getStudentId } = useStudentId();

  const handleDelete = () => {
    setShowDeleteDialog(true);
  };

  const confirmDelete = async (assignmentKey: string | undefined) => {
    if (!assignmentKey) return;
    
    try {
      setIsDeleting(true);
      const studentId = await getStudentId();

      if (!studentId) {
        toast.error('Could not retrieve student information.');
        setIsDeleting(false);
        setShowDeleteDialog(false);
        return;
      }

      const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
      
      // Delete assignment from database if it exists
      await supabase
        .from('assignments')
        .delete()
        .eq('student_id', studentId)
        .eq('assignment_number', assignmentNumber);
        
      // Also delete from form_submissions to maintain consistency
      await supabase
        .from('form_submissions')
        .delete()
        .eq('student_id', studentId)
        .eq('form_type', 'assignments')
        .eq('form_number', assignmentNumber);
        
      // Clear the content in the local state
      setAssignments(prev => ({
        ...prev,
        [assignmentKey]: { content: '' }
      }));
      
      // Remove from submitted assignments if it was submitted
      setSubmittedAssignments(prev => prev.filter(id => id !== assignmentKey));
      
      // Update progress
      await diagnosticService.recalculateAllProgress(studentId);
      
      toast.success('Assignment content erased successfully');
      
      // Go back to assignments list
      navigateCallback('/phases/assignments');
    } catch (error) {
      logger.error('Error deleting assignment', error);
      toast.error('Failed to erase assignment content.');
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteDialog(false);
  };

  return {
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    confirmDelete,
    cancelDelete
  };
};
