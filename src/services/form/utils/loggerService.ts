
/**
 * Simple logger service with different log levels and enhanced error handling
 */
export const logger = {
  info: (message: string, ...data: any[]) => {
    console.info(`info: ${message}`, ...data);
  },
  
  debug: (message: string, ...data: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.debug(`debug: ${message}`, ...data);
    }
  },
  
  warn: (message: string, ...data: any[]) => {
    console.warn(`warning: ${message}`, ...data);
  },
  
  error: (message: string, error?: any, context?: Record<string, any>) => {
    // Format the error message
    const errorMessage = error?.message || error?.toString() || 'Unknown error';
    const errorDetails = error?.details || error?.code || '';
    const errorHint = error?.hint || '';
    
    // Format as object for better console reading
    const errorObj = {
      message: errorMessage,
      details: errorDetails,
      hint: errorHint,
      code: error?.code || ''
    };
    
    // Log the full context
    console.error(`error: ${message}`, errorObj, context || {});
    
    // Return formatted error for use in toast messages etc.
    return { errorMessage, errorDetails, errorHint };
  },

  setUserId: (userId: string) => {
    // For future use, we can store user ID for all log entries
    console.info(`Setting log user context: ${userId}`);
  },
  
  // New method for tracking database consistency issues
  trackDbConsistency: (message: string, data: Record<string, any>) => {
    console.info(`DB consistency: ${message}`, data);
  }
};
