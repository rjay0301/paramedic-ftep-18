
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook for setting up realtime updates from Supabase
 * @param userId The user ID
 * @param fetchData Function to fetch updated data when changes occur
 */
export const useRealtimeUpdates = (userId: string | undefined, fetchData: () => Promise<void>) => {
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel('dashboard-updates')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'student_submissions',
          filter: `student_id=eq.${userId}`
        }, 
        () => {
          console.log('Received realtime update for student submissions');
          fetchData();
        })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchData]);
};
