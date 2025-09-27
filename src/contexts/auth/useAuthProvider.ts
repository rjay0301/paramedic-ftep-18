
import { useState } from 'react';
import { useAuthState, useAuthentication } from './hooks';

export const useAuthProvider = () => {
  const { 
    user, 
    setUser, 
    session, 
    isLoading, 
    setIsLoading,
    retryInitialization
  } = useAuthState();
  
  const {
    loginError,
    signUpError,
    isAuthenticating,
    loginWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
    clearErrors
  } = useAuthentication();

  return {
    user,
    session,
    loginError,
    signUpError,
    isLoading,
    isAuthenticating,
    loginWithEmailAndPassword,
    signUpWithEmailAndPassword,
    signOut,
    clearErrors,
    setUser,
    retryInitialization
  };
};
