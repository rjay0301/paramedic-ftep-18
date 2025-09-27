
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useStudentId } from './useStudentId';

/**
 * Hook for setting up real-time updates for assignments
 */
export const useRealtimeUpdates = (
  fetchAssignments: (userId: string | null) => Promise<void>,
  userId: string | null
) => {
  const { getStudentId } = useStudentId();

  useEffect(() => {
    if (!userId) return;

    // Set up real-time subscription for assignment updates
    const setupSubscription = async () => {
      const studentId = await getStudentId();
      if (!studentId) return () => {};
      
      try {
        const channel = supabase
          .channel('assignments-changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'assignments',
              filter: `student_id=eq.${studentId}`
            },
            () => {
              console.log('Assignment updated, refreshing data');
              fetchAssignments(userId);
            }
          )
          .subscribe();
          
        return () => {
          supabase.removeChannel(channel);
        };
      } catch (error) {
        console.error('Error setting up subscription:', error);
        return () => {};
      }
    };
    
    // Set up subscription and clean up
    const subscriptionPromise = setupSubscription();
    return () => {
      subscriptionPromise.then(cleanupFn => {
        if (typeof cleanupFn === 'function') {
          cleanupFn();
        }
      });
    };
  }, [userId, fetchAssignments, getStudentId]);
};
