
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../integrations/supabase/client';
import { clearAuthData } from '../authUtils';
import { toast } from 'sonner';

export const useSignout = () => {
  const navigate = useNavigate();

  const signOut = async () => {
    try {
      const browserInstanceId = localStorage.getItem('ftep_browser_instance_id')?.slice(0, 8) || 'unknown';
      console.log(`[Browser ${browserInstanceId}] Signing out user`);
      
      // Store pre-signout info for debugging
      const beforeSignoutInfo = {
        hasSession: false,
        timestamp: new Date().toISOString()
      };
      
      try {
        // Check if we have a session before signing out
        const { data } = await supabase.auth.getSession();
        beforeSignoutInfo.hasSession = !!data.session;
      } catch (e) {
        console.warn('Error checking session before signout:', e);
      }
      
      // Perform the actual signout - use local scope to prevent signing out all tabs
      await supabase.auth.signOut({ scope: 'local' });
      
      // Clean up local storage auth data
      clearAuthData();
      
      // Store signout completion info
      localStorage.setItem(`signout_${Date.now()}`, JSON.stringify({
        ...beforeSignoutInfo,
        completedAt: new Date().toISOString(),
        browserInstance: browserInstanceId
      }));
      
      // Always navigate to login after signing out with a logout parameter
      navigate('/login?logout=true', { replace: true });
      
      toast.info('You have been signed out');
      console.log(`[Browser ${browserInstanceId}] User successfully signed out`);
    } catch (error) {
      console.error("Error signing out:", error);
      
      // Try a forced cleanup on error
      try {
        clearAuthData();
        console.log("Forced auth cleanup after signout error");
      } catch (e) {
        console.error("Error during forced cleanup:", e);
      }
      
      toast.error('Error signing out', {
        description: 'Please try again or refresh the page'
      });
      
      // Always navigate to login even if there was an error
      navigate('/login?logout=true', { replace: true });
    }
  };

  return {
    signOut
  };
};
