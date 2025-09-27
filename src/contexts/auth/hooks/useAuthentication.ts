
import { useLogin } from './useLogin';
import { useSignup } from './useSignup';
import { useSignout } from './useSignout';

export const useAuthentication = () => {
  const { 
    loginError, 
    isAuthenticating: isLoginAuthenticating, 
    loginWithEmailAndPassword, 
    clearErrors: clearLoginErrors 
  } = useLogin();
  
  const { 
    signUpError, 
    isAuthenticating: isSignupAuthenticating, 
    signUpWithEmailAndPassword, 
    clearErrors: clearSignupErrors 
  } = useSignup();
  
  const { signOut } = useSignout();

  const isAuthenticating = isLoginAuthenticating || isSignupAuthenticating;

  const clearErrors = () => {
    clearLoginErrors();
    clearSignupErrors();
  };

  return {
    loginError,
    signUpError,
    isAuthenticating,
    loginWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
    clearErrors,
  };
};
