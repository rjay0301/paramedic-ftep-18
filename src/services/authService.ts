import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

/**
 * Signs in a user with email and password
 * @param email The user's email
 * @param password The user's password
 * @returns An object containing the user, session, and error (if any)
 */
export const signInWithEmail = async (email: string, password: string) => {
  try {
    // Generate a unique identifier for this login attempt for logging
    const loginAttemptId = Math.random().toString(36).substring(2, 8);
    console.log(`[Login ${loginAttemptId}] Starting login for: ${email}`);
    
    // Don't clear existing auth data - let Supabase handle session management
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error(`[Login ${loginAttemptId}] Error:`, error.message);
      return { user: null, session: null, error };
    }

    console.log(`[Login ${loginAttemptId}] Success for: ${email}`);
    
    // Store login timestamp to detect session issues
    try {
      localStorage.setItem('ftep_last_login', new Date().toISOString());
      localStorage.setItem('ftep_login_browser_id', localStorage.getItem('ftep_browser_instance_id') || 'unknown');
    } catch (e) {
      console.warn('Could not store login timestamp', e);
    }
    
    return {
      user: data?.user || null,
      session: data?.session || null,
      error: null,
    };
  } catch (error) {
    console.error('SignInWithEmail error:', error);
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error : new Error('An unknown error occurred'),
    };
  }
};

/**
 * Signs up a new user with email and password
 * @param email The user's email
 * @param password The user's password
 * @param userData Additional user data to store in auth.users.user_metadata
 * @returns An object containing the user, session, and error (if any)
 */
export const signUpWithEmail = async (email: string, password: string, userData: any) => {
  try {
    const signupAttemptId = Math.random().toString(36).substring(2, 8);
    console.log(`[Signup ${signupAttemptId}] Starting signup for: ${email}`);
    
    // Clear existing session
    await supabase.auth.signOut();
    
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData,
      },
    });

    if (error) {
      console.error(`[Signup ${signupAttemptId}] Error:`, error.message);
      return { user: null, session: null, error };
    }

    console.log(`[Signup ${signupAttemptId}] Success for: ${email}`);
    
    return {
      user: data?.user || null,
      session: data?.session || null,
      error: null,
    };
  } catch (error) {
    console.error('SignUpWithEmail error:', error);
    return {
      user: null,
      session: null,
      error: error instanceof Error ? error : new Error('An unknown error occurred'),
    };
  }
};

/**
 * Signs out the current user
 * @returns True if successful, false otherwise
 */
export const signOut = async (): Promise<boolean> => {
  try {
    console.log("Signing out user");
    
    // Add scope to signout to avoid session issues across browser tabs
    const { error } = await supabase.auth.signOut({ 
      scope: 'local' // Only sign out from current tab, not all tabs
    });
    
    // Only clean up specific auth-related items from localStorage
    try {
      localStorage.removeItem('ftep_last_login');
    } catch (err) {
      console.error('Error cleaning up local storage:', err);
    }
    
    return !error;
  } catch (error) {
    console.error('Sign out error:', error);
    return false;
  }
};

/**
 * Gets the current session
 * @returns The current session or null if not authenticated
 */
export const getCurrentSession = async (): Promise<Session | null> => {
  try {
    const { data } = await supabase.auth.getSession();
    return data.session;
  } catch (error) {
    console.error('Get current session error:', error);
    return null;
  }
};

/**
 * Gets the current user
 * @returns The current user or null if not authenticated
 */
export const getCurrentUser = async (): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      console.error('Get current user error:', error);
      return null;
    }

    return data.user;
  } catch (error) {
    console.error('Get current user unexpected error:', error);
    return null;
  }
};

/**
 * Gets the user's role from the students table
 * @param userId The user's ID
 * @returns The user's role or null if not found
 */
export const getUserRole = async (userId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('role')
      .eq('profile_id', userId)
      .single();

    if (error) {
      console.error('Error fetching user role:', error);
      return null;
    }

    return data?.role || null;
  } catch (error) {
    console.error('Error in getUserRole:', error);
    return null;
  }
};

/**
 * Checks if the current user has a specific role
 * @param role The role to check for
 * @returns True if the user has the role, false otherwise
 */
export const hasRole = async (role: string): Promise<boolean> => {
  const user = await getCurrentUser();
  if (!user) return false;

  const userRole = await getUserRole(user.id);
  return userRole === role;
};
