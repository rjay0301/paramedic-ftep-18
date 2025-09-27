
import { useState, useEffect, useCallback } from 'react';
import { Session } from '@supabase/supabase-js';
import { supabase } from '../../../integrations/supabase/client';
import { EnhancedUser, UserRole } from '../types';
import { enhanceUser } from '../authUtils';

export const useAuthState = () => {
  const [user, setUser] = useState<EnhancedUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [initAttempts, setInitAttempts] = useState(0);
  const [authError, setAuthError] = useState<Error | null>(null);

  const retryInitialization = useCallback(() => {
    console.log("Retrying auth initialization...");
    setIsLoading(true);
    setAuthError(null);
    setInitAttempts(prev => prev + 1);
  }, []);

  useEffect(() => {
    let isMounted = true;
    console.log("Auth state initializing - Attempt:", initAttempts);
    
    // Track Auth State
    const trackState = () => {
      // First set up auth state listener
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, newSession) => {
        if (!isMounted) return;
        
        console.log(`Auth state change: ${event}`);
        
        // Update session immediately
        setSession(newSession);
        
        // For events that change the user, update user data
        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'USER_UPDATED') {
          if (newSession?.user) {
            // Update synchronously first - ensure role is properly typed
            setUser(prevUser => {
              // Convert any string roles to UserRole type
              const safeRole = prevUser?.role as UserRole || null;
              
              return {
                ...prevUser,
                ...newSession.user,
                role: safeRole,
                status: prevUser?.status || 'pending'
              } as EnhancedUser;
            });
            
            // Then enhance with profile data asynchronously
            enhanceUser(newSession.user)
              .then(enhancedUser => {
                if (isMounted) {
                  setUser(enhancedUser);
                }
              })
              .catch(err => {
                console.error("Error enhancing user:", err);
                if (isMounted) {
                  setAuthError(err instanceof Error ? err : new Error(String(err)));
                }
              });
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setSession(null);
          }
        }
      });
      
      return subscription;
    };
    
    const initializeAuth = async () => {
      try {
        // Set up auth state listener first
        const subscription = trackState();
        
        // Then check for existing session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          setAuthError(error);
          setIsLoading(false);
          return;
        }

        if (!isMounted) return;

        if (data?.session) {
          setSession(data.session);
          
          // Set basic user data immediately - ensure role is properly typed
          const userMetadataRole = data.session.user.user_metadata?.role as UserRole || null;
          
          setUser({
            ...data.session.user,
            role: userMetadataRole,
            status: 'pending',
            name: data.session.user.user_metadata?.full_name || ''
          } as EnhancedUser);
          
          // Then enhance with additional data
          try {
            const enhancedUser = await enhanceUser(data.session.user);
            if (isMounted) {
              setUser(enhancedUser);
            }
          } catch (enhanceError) {
            console.error("Error enhancing user during init:", enhanceError);
          }
        } else {
          setUser(null);
          setSession(null);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error in auth initialization:', error);
        if (isMounted) {
          setAuthError(error instanceof Error ? error : new Error(String(error)));
          setIsLoading(false);
        }
      }
    };

    // Start auth initialization process
    initializeAuth();

    // Cleanup function
    return () => {
      isMounted = false;
    };
  }, [initAttempts]);

  return { 
    user, 
    setUser, 
    session, 
    isLoading, 
    authError,
    setIsLoading,
    retryInitialization
  };
};
