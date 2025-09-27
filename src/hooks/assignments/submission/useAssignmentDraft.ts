
import { FormState } from '../useAssignmentState';
import { useAssignmentDraftCore } from './core/useAssignmentDraftCore';

/**
 * Hook functionality for saving assignment drafts
 */
export const useAssignmentDraft = (
  assignments: FormState,
  setIsSaving: (saving: boolean) => void,
  studentId: string | null
) => {
  return useAssignmentDraftCore(assignments, setIsSaving, studentId);
};
