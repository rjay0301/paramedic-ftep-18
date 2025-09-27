
import { useState } from 'react';

export interface LoginFormState {
  isLogin: boolean;
  isLoading: boolean;
  authError: any;
  pendingApproval: boolean;
}

/**
 * Hook for managing login/signup form state
 */
export const useLoginFormState = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [pendingApproval, setPendingApproval] = useState(false);

  const resetError = () => setAuthError(null);
  const toggleForm = () => {
    setIsLogin(!isLogin);
    resetError();
  };

  return {
    isLogin,
    isLoading,
    authError,
    pendingApproval,
    setIsLogin,
    setIsLoading,
    setAuthError,
    setPendingApproval,
    resetError,
    toggleForm
  };
};
