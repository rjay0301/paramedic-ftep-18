
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedUser, UserRole } from './types';

/**
 * Enhances a standard Supabase User with additional information
 * like role and status from the profiles table
 */
export const enhanceUser = async (user: User): Promise<EnhancedUser> => {
  try {
    console.log("Enhancing user:", user.id);
    // Get role from metadata and ensure it's properly typed
    const metadataRole = user.user_metadata?.role as UserRole || null;
    
    // Start with existing metadata
    const enhancedUser: EnhancedUser = { 
      ...user,
      name: user.user_metadata?.full_name || '',
      full_name: user.user_metadata?.full_name || '',
      role: metadataRole,
      status: 'pending'
    };

    // Try to get profile data
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error) {
      console.warn("Could not fetch profile for user:", error.message);
      // Don't throw, just continue with basic user info
      return enhancedUser;
    }

    if (profile) {
      console.log("Enhanced user with profile data");
      // Ensure profile.role is properly typed as UserRole
      const profileRole = profile.role as UserRole || null;
      
      return {
        ...enhancedUser,
        name: profile.full_name || enhancedUser.name,
        full_name: profile.full_name || enhancedUser.full_name,
        role: profileRole,
        status: 'active' // User has a profile, so they're active
      };
    }

    return enhancedUser;
  } catch (err) {
    console.error("Error enhancing user:", err);
    // Return basic user info if enhancement fails
    return {
      ...user,
      name: user.user_metadata?.full_name || '',
      full_name: user.user_metadata?.full_name || '',
      role: null, // Set to null to satisfy UserRole type
      status: 'error'
    };
  }
};

/**
 * Clears any auth-related data from localStorage
 */
export const clearAuthData = () => {
  try {
    // Clear specific auth-related items
    const authKeys = [
      'supabase.auth.token',
      'ftep_last_login',
      'ftep_login_browser_id'
    ];
    
    authKeys.forEach(key => {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        console.warn(`Could not remove ${key} from localStorage:`, e);
      }
    });
    
    console.log("Cleared auth data from localStorage");
  } catch (err) {
    console.error("Error clearing auth data:", err);
  }
};
