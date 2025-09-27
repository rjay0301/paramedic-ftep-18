
import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { FormState } from './useAssignmentState';
import { useStudentId } from './useStudentId';
import { logger } from '@/services/form/utils/loggerService';
import { toast } from 'sonner';
import { getStudentAssignmentDrafts } from './submission/utils/draftUtils';
import { useStudentSubmissions } from '@/hooks/useSubmissions';
import { useAuth } from '@/contexts/auth/AuthContext';

/**
 * Hook for fetching assignments from the database
 */
export const useFetchAssignments = (
  setIsLoading: (loading: boolean) => void,
  setFetchError: (error: string | null) => void,
  setFetchAttempted: (attempted: boolean) => void,
  setAssignments: (assignments: FormState) => void,
  setSubmittedAssignments: (submitted: string[]) => void,
  assignments: FormState
) => {
  const { user } = useAuth();
  const { getStudentId } = useStudentId();

  const fetchAssignments = useCallback(async (userId: string | null) => {
    if (!userId) {
      setFetchError('No user is currently logged in.');
      setFetchAttempted(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setFetchError(null);

    try {
      // Initialize assignment structure if not exists
      const newAssignments: FormState = { ...assignments };
      for (let i = 1; i <= 6; i++) {
        const assignmentKey = `assignment${i}`;
        if (!newAssignments[assignmentKey]) {
          newAssignments[assignmentKey] = { content: '' };
        }
      }

      const studentId = await getStudentId();
      
      if (!studentId) {
        logger.error('Could not retrieve student information', { userId });
        setFetchError('Could not retrieve student information. Please refresh the page or contact support.');
        setFetchAttempted(true);
        setIsLoading(false);
        return;
      }

      logger.info('Fetching assignments for student', { studentId });

      // Fetch from student_submissions table for this student
      const { data: submissionData, error: submissionError } = await supabase
        .from('student_submissions')
        .select('*')
        .eq('student_id', studentId)
        .order('created_at', { ascending: false });

      if (submissionError) {
        logger.error('Error fetching submissions:', submissionError, { studentId });
        setFetchError('Failed to load assignments data');
        setIsLoading(false);
        return;
      }

      // Also fetch drafts using the existing method
      const draftAssignments = await getStudentAssignmentDrafts(studentId);
      
      // Update assignments with fetched data
      const submitted: string[] = [];
      
      if (submissionData && submissionData.length > 0) {
        // Filter for assignment submissions
        const assignmentSubmissions = submissionData.filter(
          (item: any) => item.form_data && typeof item.form_data === 'object' && 'assignmentNumber' in item.form_data
        );
        
        assignmentSubmissions.forEach((item: any) => {
          try {
            const assignmentNumber = item.form_data.assignmentNumber;
            if (!assignmentNumber) return;
            
            const assignmentKey = `assignment${assignmentNumber}`;
            
            // Use the content from form_data
            if (typeof item.form_data === 'object' && item.form_data.content) {
              newAssignments[assignmentKey] = {
                content: item.form_data.content
              };
            }
            
            // Mark as submitted if status is 'submitted'
            if (item.status === 'submitted' && !submitted.includes(assignmentKey)) {
              submitted.push(assignmentKey);
            }
          } catch (err) {
            logger.error('Error processing assignment data:', err);
          }
        });
      }

      // Mark drafts in the UI
      draftAssignments.forEach((assignmentNumber: number) => {
        const assignmentKey = `assignment${assignmentNumber}`;
        if (newAssignments[assignmentKey] && !submitted.includes(assignmentKey)) {
          // If it's a draft and not submitted, add a flag to indicate it's a draft
          toast.info(`Assignment ${assignmentNumber} has a saved draft`);
        }
      });

      setAssignments(newAssignments);
      setSubmittedAssignments(submitted);
      setFetchAttempted(true);
      logger.info('Successfully loaded assignments', { 
        studentId, 
        count: submissionData?.length || 0,
        submittedCount: submitted.length 
      });
      
    } catch (error: any) {
      logger.error('Error in fetchAssignments:', error);
      setFetchError(error.message || 'An unexpected error occurred while loading assignments');
    } finally {
      setIsLoading(false);
    }
  }, [assignments, getStudentId, setAssignments, setFetchAttempted, setFetchError, setIsLoading, setSubmittedAssignments]);

  return { fetchAssignments };
};
