
import { supabase } from '@/integrations/supabase/client';

/**
 * Enable realtime subscriptions for progress tables
 * @param callback Function to call when data changes
 * @returns Cleanup function
 */
export const enableRealtimeForProgressTables = (callback: () => void) => {
  try {
    // Channel for phase progress updates
    const phaseProgressChannel = supabase
      .channel('phase-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_phase_progress'
        },
        () => {
          callback();
        }
      )
      .subscribe();

    // Channel for overall progress updates
    const overallProgressChannel = supabase
      .channel('overall-progress-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'student_overall_progress'
        },
        () => {
          callback();
        }
      )
      .subscribe();
      
    // Return cleanup function
    return () => {
      supabase.removeChannel(phaseProgressChannel);
      supabase.removeChannel(overallProgressChannel);
    };
  } catch (error) {
    console.error('Error setting up realtime subscriptions for progress tables:', error);
    return () => {};
  }
};
