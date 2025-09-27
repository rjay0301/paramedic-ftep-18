
import React, { createContext, useContext, ReactNode } from 'react';
import { Session } from '@supabase/supabase-js';
import { EnhancedUser, Profile } from './types';
import { useAuthContextState } from './hooks/useAuthContextState';
import { useAuthInitializer } from './hooks/useAuthInitializer';

type AuthContextType = {
  user: EnhancedUser | null;
  profile: Profile | null;
  session: Session | null;
  isLoading: boolean;
  error: Error | null;
  refreshProfile: () => Promise<void>;
  signOut: () => Promise<void>;
  loginWithEmailAndPassword: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUpWithEmailAndPassword: (email: string, password: string, fullName: string, role: string) => Promise<{ success: boolean; error?: string }>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const {
    user, setUser,
    profile, setProfile,
    session, setSession,
    isLoading, setIsLoading,
    error, setError,
    refreshProfile,
    signOut,
    loginWithEmailAndPassword,
    signUpWithEmailAndPassword
  } = useAuthContextState();
  
  useAuthInitializer(setUser, setProfile, setSession, setIsLoading, setError);
  
  return (
    <AuthContext.Provider value={{ 
      user, 
      profile, 
      session,
      isLoading,
      error,
      refreshProfile,
      signOut,
      loginWithEmailAndPassword,
      signUpWithEmailAndPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
