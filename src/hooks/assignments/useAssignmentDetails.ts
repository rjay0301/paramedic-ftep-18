
import { useState, useEffect } from 'react';
import { useFetchAssignmentData } from './details/useFetchAssignmentData';
import { useAssignmentOperations } from './details/useAssignmentOperations';
import { useDeleteAssignment } from './details/useDeleteAssignment';

interface Assignment {
  content: string;
}

interface FormState {
  [key: string]: Assignment;
}

export const useAssignmentDetails = (assignmentKey: string | undefined, navigateCallback: (path: string) => void) => {
  const [assignments, setAssignments] = useState<FormState>({});
  const [submittedAssignments, setSubmittedAssignments] = useState<string[]>([]);

  // Initialize assignments state
  useEffect(() => {
    const initialAssignments: FormState = {};
    for (let i = 1; i <= 6; i++) {
      const key = `assignment${i}`;
      initialAssignments[key] = { content: '' };
    }
    setAssignments(initialAssignments);
  }, []);

  // Use our smaller hooks
  const { fetchAssignmentData } = useFetchAssignmentData();

  const {
    isSaving,
    isSubmitting,
    handleInputChange,
    handleSave,
    handleSubmit
  } = useAssignmentOperations(
    assignments, 
    setAssignments, 
    setSubmittedAssignments, 
    navigateCallback
  );

  const {
    isDeleting,
    showDeleteDialog,
    setShowDeleteDialog,
    handleDelete,
    confirmDelete,
    cancelDelete
  } = useDeleteAssignment(setAssignments, setSubmittedAssignments, navigateCallback);

  // Wrapper functions to pass the assignment key
  const fetchAssignmentDataWrapper = async () => {
    await fetchAssignmentData(assignmentKey, setAssignments, setSubmittedAssignments);
  };

  const handleSaveWrapper = async () => {
    if (assignmentKey) {
      await handleSave(assignmentKey);
    }
  };

  const handleSubmitWrapper = async () => {
    if (assignmentKey) {
      await handleSubmit(assignmentKey);
    }
  };

  const confirmDeleteWrapper = async () => {
    await confirmDelete(assignmentKey);
  };

  return {
    assignments,
    isSaving,
    isSubmitting,
    isDisabled: !assignments[assignmentKey]?.content || assignments[assignmentKey]?.content.trim() === '',
    isDeleting,
    showDeleteDialog,
    submittedAssignments,
    fetchAssignmentData: fetchAssignmentDataWrapper,
    handleInputChange,
    handleSave: handleSaveWrapper,
    handleSubmit: handleSubmitWrapper,
    handleDelete,
    confirmDelete: confirmDeleteWrapper,
    cancelDelete,
    setShowDeleteDialog
  };
};
