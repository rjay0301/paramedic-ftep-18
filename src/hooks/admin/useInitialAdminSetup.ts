
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Hook to check if any admin exists and potentially create the first admin
 */
export const useInitialAdminSetup = () => {
  const [isChecking, setIsChecking] = useState(false);
  const [needsSetup, setNeedsSetup] = useState(false);

  // Check if any admin exists in the system
  const checkIfAdminExists = async () => {
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('count')
        .eq('role', 'admin')
        .single();

      if (error) {
        console.error('Error checking for admin users:', error);
        return false;
      }

      // If no admins exist yet
      const adminCount = data?.count || 0;
      setNeedsSetup(adminCount === 0);
      return adminCount === 0;
    } catch (error) {
      console.error('Error in admin check:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  // Create the first admin user
  const createFirstAdmin = async (email: string, password: string, fullName: string) => {
    setIsChecking(true);
    try {
      // First check if any admin already exists (security check)
      const adminExists = !(await checkIfAdminExists());
      if (adminExists) {
        toast.error('An administrator already exists in the system');
        return false;
      }

      // Create the user with admin role
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            role: 'admin'
          }
        }
      });

      if (error) {
        toast.error('Failed to create admin account', {
          description: error.message
        });
        return false;
      }

      // Ensure the profile is updated with admin role
      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({ role: 'admin' })
          .eq('id', data.user.id);

        if (profileError) {
          console.error('Error setting admin role:', profileError);
        }
      }

      toast.success('Admin account created successfully', {
        description: 'You can now log in with your admin credentials'
      });
      
      setNeedsSetup(false);
      return true;
    } catch (error) {
      console.error('Error creating admin:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  return {
    isChecking,
    needsSetup,
    checkIfAdminExists,
    createFirstAdmin
  };
};
