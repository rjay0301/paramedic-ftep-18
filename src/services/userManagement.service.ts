import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const userManagementService = {
  /**
   * Delete a user from the database and auth system (admin only)
   * This function calls an edge function that safely removes both the database records and auth user
   */
  async deleteUser(userId: string) {
    if (!userId) {
      return { 
        success: false, 
        error: 'Invalid user ID provided' 
      };
    }

    try {
      console.log(`Requesting deletion of user with ID: ${userId}`);
      
      // Get the session token for authorization
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        return { success: false, error: 'Not authenticated' };
      }
      
      // Call the edge function to perform the deletion securely
      const { data, error } = await supabase.functions.invoke('delete-user', {
        body: { userId },
      });
      
      if (error) {
        console.error('Error from deletion edge function:', error);
        return { 
          success: false, 
          error: error.message || `Failed to delete user`
        };
      }
      
      return { success: true, data };
    } catch (error: any) {
      console.error('Error deleting user:', error);
      return { 
        success: false, 
        error: error.message || 'An error occurred while trying to delete the user'
      };
    }
  },

  /**
   * Check if the current user has admin role
   * Used to determine if delete functionality should be shown
   */
  async checkAdminStatus() {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .single();

      if (error) throw error;
      return profile?.role === 'admin';
    } catch (error) {
      console.error('Error checking admin status:', error);
      return false;
    }
  },
  
  /**
   * Get detailed explanation of the authentication flow
   */
  getAuthenticationExplanation() {
    return {
      flowDescription: `
        The authentication flow in this application works as follows:
        
        1. User Registration:
           - Users sign up with email, password, and profile information
           - Auth data is stored in Supabase's auth.users table
           - Profile data is stored in the public.profiles table with role initially set to null
           - A trigger function creates necessary records in other tables
        
        2. User Login:
           - Users log in with email and password
           - Supabase validates credentials and returns a JWT token
           - The application stores this token for authenticated requests
           - User session is maintained in the AuthContext
        
        3. Role Assignment:
           - All new users have their role initially set to null
           - Supabase admin must manually set the role in the profiles table
           - Available roles: 'student', 'coordinator', 'admin'
           - Users without an assigned role see the Unauthorized page
        
        4. Access Control:
           - Users with 'student' role can access student pages
           - Users with 'coordinator' role can access coordinator pages
           - Users with 'admin' role have special permissions like user deletion
        
        5. User Deletion:
           - Only admins can delete users via a secure edge function
           - The edge function requires admin authentication
           - It removes all user data from the database 
           - It also removes the user from the Supabase auth system
           - Audit logs are preserved with a placeholder user ID
      `
    };
  }
};
