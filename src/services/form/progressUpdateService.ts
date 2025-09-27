
import { updateStudentProgress, recalculateAllStudentProgress, enableRealtimeForProgressTables } from './progress';
import { dispatchFormSubmittedEvent } from './utils/eventUtils';

// Re-export all progress functions
export {
  updateStudentProgress,
  recalculateAllStudentProgress,
  enableRealtimeForProgressTables,
  dispatchFormSubmittedEvent
};

// Create a progressService for direct usage
export const progressService = {
  updateStudentProgress,
  recalculateAllStudentProgress,
  enableRealtimeForProgressTables,
  dispatchFormSubmittedEvent
};
