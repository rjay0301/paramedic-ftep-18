
/**
 * Dispatch a form submitted event to notify listeners of form submission
 * @param studentId The student ID
 */
export const dispatchFormSubmittedEvent = (studentId: string) => {
  const event = new CustomEvent('formSubmitted', { 
    detail: { studentId } 
  });
  window.dispatchEvent(event);
};

/**
 * Dispatch a loading event to notify listeners of loading state change
 * @param isLoading The loading state
 */
export const dispatchLoadingEvent = (isLoading: boolean) => {
  const event = new CustomEvent('loadingStateChanged', { 
    detail: { isLoading } 
  });
  window.dispatchEvent(event);
};

/**
 * Dispatch a progress event to notify listeners of progress update
 * @param studentId The student ID
 */
export const dispatchProgressEvent = (studentId: string) => {
  const event = new CustomEvent('progressUpdated', { 
    detail: { studentId } 
  });
  window.dispatchEvent(event);
};
