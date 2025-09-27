
import { useState } from 'react';
import { Session } from '@supabase/supabase-js';
import { EnhancedUser, Profile } from '../types';
import { supabase } from '@/integrations/supabase/client';
import { useProfileFetcher } from './useProfileFetcher';
import { toast } from 'sonner';

export const useAuthContextState = () => {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const { fetchProfile } = useProfileFetcher();
  
  const refreshProfile = async () => {
    if (user?.id) {
      console.log("Refreshing profile for user:", user.id);
      try {
        const updatedUser = await fetchProfile(user.id);
        if (updatedUser) {
          setUser(updatedUser);
          
          // Update profile state
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
            
          if (profileData) {
            setProfile(profileData as Profile);
          }
        }
      } catch (err) {
        console.error("Error refreshing profile:", err);
        toast.error('Failed to refresh profile');
      }
    }
  };

  const signOut = async () => {
    try {
      console.log("Signing out user");
      await supabase.auth.signOut();
      setUser(null);
      setProfile(null);
      setSession(null);
      return Promise.resolve();
    } catch (err) {
      console.error('Error signing out:', err);
      return Promise.reject(err);
    }
  };
  
  const loginWithEmailAndPassword = async (email: string, password: string) => {
    try {
      console.log("Login attempt for:", email);
      const startTime = Date.now();
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      const endTime = Date.now();
      console.log(`Login request took: ${endTime - startTime}ms`);
      
      if (error) {
        console.error("Login error:", error.message);
        return { success: false, error: error.message };
      }
      
      if (!data.user) {
        console.error("Login error: No user returned");
        return { success: false, error: 'No user data returned' };
      }
      
      // Fetch user profile immediately after login to check role status
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
          
        if (profileError) {
          console.warn("Login profile fetch error:", profileError.message);
          toast.warning('Account requires role assignment. Please contact administrator.');
          return { success: true, error: 'pending_approval' };
        }
        
        if (!profile) {
          console.warn("User has no profile");
          toast.warning('Account requires role assignment. Please contact administrator.');
          return { success: true, error: 'pending_approval' };
        }

        // Check if role is null and show appropriate message
        if (profile.role === null) {
          console.warn("User has no role assigned");
          toast.warning('Your account needs a role assigned by an administrator.');
          return { success: true, error: 'role_pending' };
        }
        
        // Check role-specific record status
        if (profile.role === 'student') {
          const { data: studentData, error: studentError } = await supabase
            .from('students')
            .select('status')
            .eq('profile_id', data.user.id)
            .maybeSingle();
            
          if (studentError || !studentData) {
            console.warn("Student record not found or error:", studentError);
            toast.warning('Your student record needs to be set up by an administrator.');
            return { success: true, error: 'student_record_pending' };
          }
          
          if (studentData.status !== 'active') {
            console.warn("Student account not active:", studentData.status);
            toast.warning('Your student account is not active. Please contact administrator.');
            return { success: true, error: 'student_inactive' };
          }
        } else if (profile.role === 'coordinator') {
          const { data: coordinatorData, error: coordinatorError } = await supabase
            .from('coordinators')
            .select('status')
            .eq('profile_id', data.user.id)
            .maybeSingle();
            
          if (coordinatorError || !coordinatorData) {
            console.warn("Coordinator record not found or error:", coordinatorError);
            toast.warning('Your coordinator record needs to be set up by an administrator.');
            return { success: true, error: 'coordinator_record_pending' };
          }
          
          if (coordinatorData.status !== 'active') {
            console.warn("Coordinator account not active:", coordinatorData.status);
            toast.warning('Your coordinator account is not active. Please contact administrator.');
            return { success: true, error: 'coordinator_inactive' };
          }
        }
        
        console.log("Login profile fetched:", profile);
      } catch (profileErr) {
        console.error("Error fetching profile after login:", profileErr);
      }
      
      console.log("Login successful for:", email);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error("Login unexpected error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };
  
  const signUpWithEmailAndPassword = async (email: string, password: string, fullName: string, role: string) => {
    try {
      console.log("Signup attempt for:", email);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            // No role set here - admin will assign role manually
          }
        }
      });
      
      if (error) {
        console.error("Signup error:", error.message);
        return { success: false, error: error.message };
      }
      
      console.log("Signup successful for:", email);
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      console.error("Signup unexpected error:", errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  return {
    user,
    setUser,
    profile,
    setProfile,
    session,
    setSession,
    isLoading,
    setIsLoading,
    error,
    setError,
    refreshProfile,
    signOut,
    loginWithEmailAndPassword,
    signUpWithEmailAndPassword
  };
};
