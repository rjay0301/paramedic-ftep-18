
import { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import { RegistrationData } from '@/hooks/auth/registration/types';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook for managing login state and authentication flow
 */
export function useLoginState() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [authError, setAuthError] = useState<any>(null);
  const [pendingApproval, setPendingApproval] = useState(false);
  
  const { 
    loginWithEmailAndPassword, 
    signUpWithEmailAndPassword 
  } = useAuth();

  /**
   * Handle sign in form submission
   */
  const handleSignIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      console.time('login-request');
      const result = await loginWithEmailAndPassword(email, password);
      console.timeEnd('login-request');
      
      if (!result.success) {
        setAuthError({ message: result.error });
        
        // Check if the error is about pending approval
        if (result.error?.toLowerCase().includes('pending approval') || 
            result.error === 'pending_approval') {
          setPendingApproval(true);
        }
      } else if (result.error === 'pending_approval') {
        // Special case: login succeeded but user needs approval
        setPendingApproval(true);
      } else {
        toast.success("Login successful!");
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setAuthError({ message: err.message || 'An error occurred during sign in' });
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handle sign up form submission
   */
  const handleSignUp = async (data: RegistrationData) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      // Use the registration utility which handles the full signup process
      const { email, password, fullName } = data;
      
      // First check if user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        setAuthError({ message: 'An account with this email already exists' });
        toast.error('Registration failed', {
          description: 'An account with this email already exists. Please try logging in instead.',
        });
        return;
      }
      
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            corp_id: data.corporationNumber,
            apc_batch: data.apcBatch,
            contact_number: data.contactNumber,
            role: 'pending'
          }
        }
      });
      
      if (authError) {
        console.error('Auth error during signup:', authError);
        setAuthError({ message: authError.message });
        toast.error('Registration failed', {
          description: authError.message,
        });
        return;
      }
      
      // Show pending approval message
      setPendingApproval(true);
      
      toast.success('Registration successful!', {
        description: 'Your account is pending administrator approval.',
        duration: 5000,
      });
    } catch (err: any) {
      console.error('Registration error:', err);
      setAuthError({ message: err.message || 'An error occurred during registration' });
    } finally {
      setIsLoading(false);
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setAuthError(null);
  };

  return {
    isLogin,
    isLoading,
    authError,
    pendingApproval,
    handleSignIn,
    handleSignUp,
    toggleForm,
    setIsLogin
  };
}
