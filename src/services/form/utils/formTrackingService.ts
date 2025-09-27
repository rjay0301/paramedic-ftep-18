
import { logger } from './loggerService';

export const formTrackingService = {
  // Track when a form submission process starts
  trackSubmissionStart(formType: string, formId: string, formNumber: number, studentId: string) {
    logger.info('Form submission started', { formType, formId, formNumber, studentId });
  },
  
  // Track when a form submission succeeds
  trackSubmissionSuccess(formType: string, formId: string, formNumber: number, studentId: string) {
    logger.info('Form submission completed successfully', { formType, formId, formNumber, studentId });
  },
  
  // Track when a form submission fails
  trackSubmissionFailure(
    formType: string, 
    formId: string, 
    formNumber: number, 
    studentId: string, 
    error: any
  ) {
    logger.error('Form submission failed', error, { formType, formId, formNumber, studentId });
  },
  
  // Track when progress update starts
  trackProgressUpdateStart(studentId: string) {
    logger.debug('Progress update started', { studentId });
  },
  
  // Track when progress update succeeds
  trackProgressUpdateSuccess(studentId: string, data: Record<string, any> = {}) {
    logger.debug('Progress update completed successfully', { studentId, ...data });
  },
  
  // Track when progress update fails
  trackProgressUpdateFailure(studentId: string, error: any) {
    logger.error('Progress update failed', error, { studentId });
  },
  
  // Track when an event is dispatched
  trackEventDispatched(eventName: string, studentId: string) {
    logger.debug(`Event dispatched: ${eventName}`, { studentId });
  }
};
