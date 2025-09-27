
import { supabase } from '@/integrations/supabase/client';
import { logger } from '../utils/loggerService';

/**
 * Enable realtime subscriptions for form submissions table
 * @param callback Function to call when changes are detected
 * @returns Cleanup function
 */
export const setupFormSubmissionsSubscription = async (callback: () => void) => {
  try {
    logger.info('Setting up form submissions subscription');
    
    const channel = supabase
      .channel('form-submissions-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'form_submissions'
        },
        (payload) => {
          const newRecord = payload.new as Record<string, any> | null;
          logger.info('Form submission updated via realtime', { 
            event: payload.eventType,
            record: newRecord?.id || 'unknown' 
          });
          callback();
        }
      )
      .subscribe();
      
    logger.debug('Form submissions subscription set up successfully');
    
    return () => {
      logger.debug('Removing form submissions subscription');
      supabase.removeChannel(channel);
    };
  } catch (error) {
    logger.error('Error setting up form submissions subscription', error);
    return () => {};
  }
};
