
import { useState } from 'react';
import { supabase } from '../../../integrations/supabase/client';
import { enhanceUser } from '../authUtils';
import { EnhancedUser } from '../types';
import { toast } from 'sonner';

export const useLogin = () => {
  const [loginError, setLoginError] = useState<string>("");
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      setIsAuthenticating(true);
      setLoginError("");
      
      const instanceId = Math.random().toString(36).substring(2, 8);
      console.log(`[Login ${instanceId}] Starting login for: ${email}`);
      
      // Ensure clean state before login attempt
      await supabase.auth.signOut();
      
      // Use Promise.race with enhanced error handling
      const loginPromise = supabase.auth.signInWithPassword({
        email,
        password
      });
      
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error('Login request timed out. Please try again.'));
        }, 15000); // 15 seconds timeout, more generous for poor connections
      });
      
      // @ts-ignore - Types don't match perfectly but this is a valid race
      const { data, error } = await Promise.race([loginPromise, timeoutPromise]);

      if (error) {
        console.error(`[Login ${instanceId}] Error:`, error.message);
        setLoginError(error.message);
        return { success: false, error: error.message };
      }

      if (!data || !data.user) {
        console.error(`[Login ${instanceId}] Missing user data in response`);
        setLoginError("Missing user data in response");
        return { success: false, error: "Missing user data in response" };
      }

      console.log(`[Login ${instanceId}] Success for: ${email}`);
      
      // Enhanced logging for debugging
      console.log(`[Login ${instanceId}] Auth State:`, {
        sessionExists: !!data.session,
        userRole: data.user.user_metadata?.role || 'none',
        userEmail: data.user.email
      });
      
      // Create an EnhancedUser with additional data
      const enhancedUser = await enhanceUser(data.user);
      
      // After successful login, trigger progress recalculation
      try {
        console.log(`[Login ${instanceId}] Triggering progress recalculation...`);
        
        // Get the student ID
        const { data: studentData } = await supabase
          .from('students')
          .select('id')
          .eq('profile_id', data.user.id)
          .maybeSingle();
          
        if (studentData?.id) {
          // Import the progress service and update progress
          const progressService = await import('../../../services/form/progressUpdateService');
          await progressService.updateStudentProgress(studentData.id);
          console.log(`[Login ${instanceId}] Progress recalculation completed`);
        }
      } catch (progressError) {
        console.error(`[Login ${instanceId}] Error recalculating progress:`, progressError);
        // Don't fail the login due to progress calculation errors
      }
      
      return { success: true, user: enhancedUser };
    } catch (err: any) {
      const errorMessage = err.message || "An unexpected error occurred";
      console.error("Unexpected login error:", err);
      setLoginError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsAuthenticating(false);
    }
  };

  const clearErrors = () => {
    setLoginError("");
  };

  return {
    loginError,
    isAuthenticating,
    loginWithEmailAndPassword,
    clearErrors,
  };
};
