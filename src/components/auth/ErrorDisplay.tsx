
import React from 'react';

interface ErrorDisplayProps {
  error: any;
  authError: any;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ error, authError }) => {
  if (!error && !authError) return null;
  
  const errorMessage = error?.name === 'PendingApprovalError' 
    ? 'Your account is pending approval. Please contact an administrator.' 
    : (typeof error === 'string' 
      ? error 
      : (error?.message || authError?.message || 'An error occurred. Please try again.'));

  return (
    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm rounded">
      {errorMessage}
    </div>
  );
};

export default ErrorDisplay;
