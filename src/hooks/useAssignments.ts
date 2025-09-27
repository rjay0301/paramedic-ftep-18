
import { useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useAssignmentState } from './assignments/useAssignmentState';
import { useFetchAssignments } from './assignments/useFetchAssignments';
import { useAssignmentSubmission } from './assignments/useAssignmentSubmission';
import { useRealtimeUpdates } from './assignments/useRealtimeUpdates';
import { logger } from '@/services/form/utils/loggerService';

export const useAssignments = () => {
  // Get current user
  const { user } = useAuth();
  
  // Use the assignment state hook
  const { 
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
    resetErrors,
    handleChange
  } = useAssignmentState();
  
  // Use the fetch assignments hook
  const { fetchAssignments } = useFetchAssignments(
    setIsLoading,
    setFetchError,
    setFetchAttempted,
    setAssignments,
    setSubmittedAssignments,
    assignments
  );
  
  // Use the assignment submission hook
  const { handleSaveDraft, handleSubmit } = useAssignmentSubmission(
    assignments,
    setIsSaving,
    setSubmittedAssignments
  );

  // Enhanced fetchAssignments with error handling
  const fetchAssignmentsWithErrorHandling = useCallback(async () => {
    if (!user) {
      logger.warn("Attempted to fetch assignments without a logged-in user");
      return;
    }
    
    setIsLoading(true);
    try {
      await fetchAssignments(user.id);
    } catch (error) {
      logger.error("Unexpected error in fetchAssignmentsWithErrorHandling", error);
      setFetchError("Failed to load assignments. Please check your connection and try again.");
      setIsLoading(false);
    }
  }, [user, fetchAssignments, setIsLoading, setFetchError]);

  // Load assignments on component mount
  useEffect(() => {
    if (!user) return;
    
    // Add logging to track assignment fetch attempts
    logger.debug("Attempting to fetch assignments for user", { userId: user.id });
    fetchAssignmentsWithErrorHandling();
  }, [user, fetchAssignmentsWithErrorHandling]);
  
  // Set up real-time updates
  useRealtimeUpdates(fetchAssignmentsWithErrorHandling, user?.id || null);

  return {
    assignments,
    isLoading,
    isSaving,
    submittedAssignments,
    fetchAttempted,
    fetchError,
    handleChange,
    handleSaveDraft,
    handleSubmit,
    fetchAssignments: fetchAssignmentsWithErrorHandling,
    resetErrors
  };
};
