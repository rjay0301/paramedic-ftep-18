
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Hook to get the student ID from the profile ID
 */
export const useStudentId = () => {
  const { user } = useAuth();

  const getStudentId = async () => {
    if (!user) return null;

    try {
      // For demo/offline mode, just use the user ID directly when backend isn't available
      // This lets us test the UI without having a working backend
      const { data, error } = await supabase
        .from('students')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching student id:', error);
        // Return user ID as fallback when backend is unavailable
        return user.id;
      }

      return data?.id || user.id;
    } catch (error) {
      console.error('Unexpected error in getStudentId:', error);
      // Return user ID as fallback when backend is unavailable
      return user.id;
    }
  };

  return { getStudentId };
};
