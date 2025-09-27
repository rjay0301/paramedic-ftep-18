
import { useState } from 'react';

// Define TypeScript types
export interface FormData {
  [key: string]: string;
}

export interface FormState {
  [key: string]: FormData;
}

/**
 * Hook for managing assignment state
 */
export const useAssignmentState = () => {
  // State variables
  const [assignments, setAssignments] = useState<FormState>({
    assignment1: { content: '' },
    assignment2: { content: '' },
    assignment3: { content: '' },
    assignment4: { content: '' },
    assignment5: { content: '' },
    assignment6: { content: '' }
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [submittedAssignments, setSubmittedAssignments] = useState<string[]>([]);
  const [fetchAttempted, setFetchAttempted] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [lastRetryTime, setLastRetryTime] = useState<number>(0);

  // Function to handle input changes
  const handleChange = (
    assignmentKey: string, 
    fieldKey: string, 
    value: string
  ) => {
    setAssignments(prevState => ({
      ...prevState,
      [assignmentKey]: {
        ...prevState[assignmentKey],
        [fieldKey]: value
      }
    }));
  };

  // Function to reset errors
  const resetErrors = () => {
    setFetchError(null);
    setLastRetryTime(Date.now());
  };

  return {
    assignments,
    setAssignments,
    isLoading,
    setIsLoading,
    isSaving,
    setIsSaving,
    submittedAssignments,
    setSubmittedAssignments,
    fetchAttempted,
    setFetchAttempted,
    fetchError,
    setFetchError,
    lastRetryTime,
    setLastRetryTime,
    resetErrors,
    handleChange
  };
};
