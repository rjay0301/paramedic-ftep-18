
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedUser, UserRole } from '../types';
import { toast } from 'sonner';

export const useProfileFetcher = () => {
  const [error, setError] = useState<Error | null>(null);

  const fetchProfile = async (userId: string): Promise<EnhancedUser | null> => {
    try {
      console.log("Fetching profile for user:", userId);
      const fetchStartTime = Date.now();

      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;

      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      const fetchEndTime = Date.now();
      console.log(`Profile fetch took: ${fetchEndTime - fetchStartTime}ms`);
      
      if (profileError) {
        console.error("Error fetching profile:", profileError);
        throw profileError;
      }
      
      console.log("Profile data fetched:", profileData);
      
      // Ensure role is properly typed as UserRole
      const safeRole = profileData?.role as UserRole || null;
      
      // Create enhanced user with the correct structure
      // Make sure we're including all required properties from the User type
      let enhancedUser: EnhancedUser = {
        // Start with current user properties if available
        ...(currentUser || {}),
        // Override with our specific properties
        id: userId,
        name: profileData?.full_name || '',
        full_name: profileData?.full_name || '',
        role: safeRole,
        status: profileData ? 'active' : 'pending',
        // Ensure required properties are present (satisfying TypeScript)
        app_metadata: currentUser?.app_metadata || {},
        user_metadata: currentUser?.user_metadata || {},
        aud: currentUser?.aud || 'authenticated',
        created_at: currentUser?.created_at || new Date().toISOString()
      };
      
      // Now check if the user has a role-specific record and validate its status
      if (profileData?.role === 'student') {
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('status')
          .eq('profile_id', userId)
          .maybeSingle();
          
        if (studentError) {
          console.error("Error fetching student status:", studentError);
        } else if (studentData) {
          enhancedUser = {
            ...enhancedUser,
            status: studentData.status as 'pending' | 'active' | 'inactive' | 'error'
          };
        }
      } else if (profileData?.role === 'coordinator') {
        const { data: coordinatorData, error: coordinatorError } = await supabase
          .from('coordinators')
          .select('status')
          .eq('profile_id', userId)
          .maybeSingle();
          
        if (coordinatorError) {
          console.error("Error fetching coordinator status:", coordinatorError);
        } else if (coordinatorData) {
          enhancedUser = {
            ...enhancedUser,
            status: coordinatorData.status as 'pending' | 'active' | 'inactive' | 'error'
          };
        }
      }

      return enhancedUser;
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err instanceof Error ? err : new Error('Failed to fetch profile'));
      
      // Get current user for error state
      const { data: userData } = await supabase.auth.getUser();
      const currentUser = userData?.user;
      
      // Return a user with error status while maintaining required properties and proper typing
      const errorUser: EnhancedUser = {
        ...(currentUser || {} as EnhancedUser),
        id: userId,
        status: 'error',
        role: null, // Explicitly set as null to satisfy UserRole type
        // Ensure required properties are present
        app_metadata: currentUser?.app_metadata || {},
        user_metadata: currentUser?.user_metadata || {},
        aud: currentUser?.aud || 'authenticated',
        created_at: currentUser?.created_at || new Date().toISOString()
      };
      
      return errorUser;
    }
  };
  
  return {
    fetchProfile,
    error
  };
};
