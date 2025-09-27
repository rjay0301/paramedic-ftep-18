
import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { enhanceUser, clearAuthData } from '../authUtils';
import { toast } from 'sonner';

export const useSignup = () => {
  const [signUpError, setSignUpError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const signUpWithEmailAndPassword = async (email: string, password: string, fullName: string, role: string) => {
    try {
      setIsAuthenticating(true);
      setSignUpError("");
      
      const signupAttemptId = Math.random().toString(36).substring(2, 8);
      console.log(`[Signup ${signupAttemptId}] Starting signup for: ${email}`);
      
      // Clear existing session
      await supabase.auth.signOut();
      clearAuthData();
      
      // Modified signup to use simpler approach and avoid timing out
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName,
            role: role,
          },
        },
      });

      if (error) {
        console.error(`[Signup ${signupAttemptId}] Error:`, error.message);
        setSignUpError(error.message);
        return { success: false, error: error.message };
      }

      if (!data?.user) {
        const errorMsg = 'No user returned from signup';
        console.error(`[Signup ${signupAttemptId}] ${errorMsg}`);
        setSignUpError(errorMsg);
        return { success: false, error: errorMsg };
      }

      console.log(`[Signup ${signupAttemptId}] Success for: ${email}`);
      
      // Create an EnhancedUser with additional data
      const enhancedUser = await enhanceUser(data.user);
      
      toast.success('Signup successful!', {
        description: 'Your account has been created and is pending approval.'
      });
      
      return { success: true, user: enhancedUser };
    } catch (err: any) {
      console.error("Unexpected signup error:", err);
      const errorMessage = err.message || "An unexpected error occurred";
      setSignUpError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const clearErrors = () => {
    setSignUpError("");
  };

  return {
    signUpError,
    isAuthenticating,
    signUpWithEmailAndPassword,
    clearErrors,
  };
};
