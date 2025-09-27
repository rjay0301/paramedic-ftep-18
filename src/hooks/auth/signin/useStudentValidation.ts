
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStudentValidation = (setPendingApproval: (pending: boolean) => void) => {
  // Cache validation results to avoid repeated database calls
  const validationCache = new Map<string, boolean>();

  const validateStudentStatus = async (userId: string): Promise<boolean> => {
    try {
      // Check cache first
      if (validationCache.has(userId)) {
        const cachedResult = validationCache.get(userId);
        console.log(`Using cached validation result for user ${userId.slice(0, 8)}: ${cachedResult}`);
        return cachedResult || false;
      }

      // Get browser instance ID for logging
      const browserInstanceId = Math.random().toString(36).substring(2, 10);
      console.log(`[Browser ${browserInstanceId}] Starting user validation for user ID:`, userId.slice(0, 8));
      
      // First check if the user has a role assigned in profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single();
        
      if (profileError || !profileData) {
        console.error(`[Browser ${browserInstanceId}] Error fetching profile or profile not found:`, profileError);
        toast.error('Could not verify account status', {
          description: 'Please contact an administrator.'
        });
        validationCache.set(userId, false);
        return false;
      }
      
      // If user has no role assigned, they're not approved yet
      if (!profileData.role) {
        console.log(`[Browser ${browserInstanceId}] User has no role assigned`);
        setPendingApproval(true);
        toast.error('Your account is pending role assignment');
        validationCache.set(userId, false);
        return false;
      }
      
      // Handle validation based on role
      if (profileData.role === 'student') {
        // Check student table
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('status')
          .eq('profile_id', userId)
          .maybeSingle();
          
        if (studentError) {
          console.error(`[Browser ${browserInstanceId}] Error fetching student status:`, studentError);
          toast.error('Could not verify student status');
          validationCache.set(userId, false);
          return false;
        }

        if (!studentData || studentData.status !== 'active') {
          console.log(`[Browser ${browserInstanceId}] Student account not active`);
          toast.error('Student account not active');
          validationCache.set(userId, false);
          return false;
        }
        
        validationCache.set(userId, true);
        return true;
      } 
      else if (profileData.role === 'coordinator') {
        // Check coordinator table
        const { data: coordinatorData, error: coordinatorError } = await supabase
          .from('coordinators')
          .select('status')
          .eq('profile_id', userId)
          .maybeSingle();
          
        if (coordinatorError) {
          console.error(`[Browser ${browserInstanceId}] Error fetching coordinator status:`, coordinatorError);
          toast.error('Could not verify coordinator status');
          validationCache.set(userId, false);
          return false;
        }

        if (!coordinatorData || coordinatorData.status !== 'active') {
          console.log(`[Browser ${browserInstanceId}] Coordinator account not active`);
          toast.error('Coordinator account not active');
          validationCache.set(userId, false);
          return false;
        }
        
        validationCache.set(userId, true);
        return true;
      }
      else if (profileData.role === 'admin') {
        // Admins are always valid
        validationCache.set(userId, true);
        return true;
      }
      
      // For any other role, return false
      console.log(`[Browser ${browserInstanceId}] Unknown role: ${profileData.role}`);
      toast.error('Invalid role assignment');
      validationCache.set(userId, false);
      return false;
    } catch (error) {
      console.error('Error in validateStudentStatus:', error);
      toast.error('Authentication error');
      validationCache.set(userId, false);
      return false;
    }
  };

  return validateStudentStatus;
};
