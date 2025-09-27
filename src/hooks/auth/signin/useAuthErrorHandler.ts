
import { toast } from 'sonner';
import { SignInError } from './types';

export const useAuthErrorHandler = (
  setAuthError: (error: SignInError | null) => void,
  setPendingApproval: (pending: boolean) => void
) => {
  const handleAuthError = (error: any) => {
    console.error('Sign in error:', error);
    setAuthError(error);
    
    toast.error('Login failed', {
      description: error.message || 'Check your credentials and try again',
    });
  };

  const handlePendingApproval = () => {
    console.log('Account pending approval');
    setPendingApproval(true);
    toast.info('Account approval pending', {
      description: 'Your account is awaiting administrator approval.',
    });
  };

  return {
    handleAuthError,
    handlePendingApproval
  };
};
