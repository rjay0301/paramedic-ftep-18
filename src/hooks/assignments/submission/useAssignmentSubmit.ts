
import { useAssignmentSubmitCore } from './core/useAssignmentSubmitCore';
import { getCurrentSubmittedAssignments } from './utils/submissionUtils';
import { FormState } from '../useAssignmentState';

/**
 * Hook functionality for submitting assignments
 */
export const useAssignmentSubmit = (
  assignments: FormState,
  setIsSaving: (saving: boolean) => void,
  setSubmittedAssignments: (submitted: string[]) => void,
  studentId: string | null
) => {
  const { handleSubmit } = useAssignmentSubmitCore(
    assignments,
    setIsSaving,
    setSubmittedAssignments,
    studentId
  );

  return { handleSubmit };
};

// Re-export utility function for external use
export { getCurrentSubmittedAssignments };
