
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { RegistrationData } from './types';

export const useRegistration = (
  setIsLoading: (loading: boolean) => void,
  setAuthError: (error: any) => void,
  setPendingApproval: (pending: boolean) => void,
  setIsLogin: (isLogin: boolean) => void
) => {
  const handleRegistration = async (data: RegistrationData) => {
    try {
      setIsLoading(true);
      setAuthError(null);
      
      console.log('Attempting sign up for:', data.email);
      
      // Register user with Supabase Auth with all metadata needed for approval
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            full_name: data.fullName,
            corp_id: data.corporationNumber,
            apc_batch: data.apcBatch,
            contact_number: data.contactNumber,
            role: 'pending' // Default role for new registrations
          }
        }
      });

      if (authError) {
        console.error('Auth error during signup:', authError);
        // Special handling for common errors
        if (authError.message.includes('User already registered')) {
          toast.error('This email is already registered', {
            description: 'Please try logging in instead or use a different email address.',
          });
        } else {
          toast.error('Registration failed', {
            description: authError.message || 'There was an error creating your account',
          });
        }
        setAuthError(authError);
        return;
      }

      console.log('Auth signup successful:', authData);
      
      // Show success message and switch to login view
      toast.success('Registration successful', {
        description: 'Your account is pending admin approval. You will be notified when it is activated.',
      });
      
      setPendingApproval(true);
      setIsLogin(true);
      
    } catch (error: any) {
      console.error('Signup error:', error);
      setAuthError(error);
      toast.error('Registration failed', {
        description: error.message || 'There was an error creating your account',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return handleRegistration;
};
