
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { EnhancedUser, Profile } from '../types';
import { useProfileFetcher } from './useProfileFetcher';

export const useAuthInitializer = (
  setUser: (user: EnhancedUser | null) => void,
  setProfile: (profile: Profile | null) => void,
  setSession: (session: any) => void,
  setIsLoading: (isLoading: boolean) => void,
  setError: (error: Error | null) => void
) => {
  const { fetchProfile } = useProfileFetcher();
  
  useEffect(() => {
    console.log("AuthProvider initialized");
    let isMounted = true;
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      console.log("Auth state change event:", event);
      
      if (!isMounted) return;
      
      setSession(newSession);
      
      if (newSession?.user) {
        // Update the user state with the new session data
        if (isMounted) {
          // First update with basic information we have
          const basicUser: EnhancedUser = {
            ...newSession.user,
            role: null,
            status: 'pending'
          };
          setUser(basicUser);
        }
          
        try {
          // Fetch user profile
          const enhancedUser = await fetchProfile(newSession.user.id);
          if (isMounted && enhancedUser) {
            setUser(enhancedUser);
          }
          
          // Fetch profile data
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', newSession.user.id)
            .single();
            
          if (isMounted && profileData) {
            setProfile(profileData as Profile);
          }
        } catch (err) {
          console.error("Error enhancing user on auth change:", err);
        }
      } else if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setUser(null);
          setProfile(null);
        }
      }
    });

    // Then check for existing session
    const initializeAuth = async () => {
      try {
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        console.log("Initial session check:", currentSession ? "Has session" : "No session");

        if (!isMounted) return;

        if (sessionError) {
          console.error("Error getting session:", sessionError);
          setIsLoading(false);
          return;
        }

        setSession(currentSession);

        if (currentSession?.user) {
          const basicUser: EnhancedUser = {
            ...currentSession.user,
            role: null,
            status: 'pending'
          };
          setUser(basicUser);

          try {
            const enhancedUser = await fetchProfile(currentSession.user.id);
            if (isMounted && enhancedUser) {
              setUser(enhancedUser);
            }

            const { data: profileData } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', currentSession.user.id)
              .single();

            if (isMounted && profileData) {
              setProfile(profileData as Profile);
            }
          } catch (err) {
            console.error("Error enhancing user during initialization:", err);
            if (isMounted) {
              setError(err instanceof Error ? err : new Error('Failed to fetch user profile'));
            }
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error during auth initialization:", err);
        if (isMounted) {
          setError(err instanceof Error ? err : new Error('Failed to initialize authentication'));
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);
};
