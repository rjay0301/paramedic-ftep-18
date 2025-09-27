
import { useState } from 'react';
import { userManagementService } from '@/services/userManagement.service';
import { toast } from 'sonner';

export function useUserDeletion() {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  const deleteUser = async (userId: string, userName: string) => {
    if (!userId) {
      toast.error('Invalid user ID provided');
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      console.log(`Attempting to delete user: ${userName} (${userId})`);
      
      // Add a small delay to ensure UI feedback is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const result = await userManagementService.deleteUser(userId);
      
      if (result.success) {
        console.log(`Successfully deleted user: ${userName} from database and auth system`);
        toast.success(`User ${userName || userId} and all associated data were completely removed from the system`);
        
        // Get authentication flow information for reference
        const authInfo = userManagementService.getAuthenticationExplanation();
        setAuthInfo(authInfo.flowDescription);
        
        // Add a small delay to ensure the toast is seen
        await new Promise(resolve => setTimeout(resolve, 1000));
        return true;
      } else {
        const errorMsg = result.error || 'Failed to delete user';
        console.error(`Error deleting user: ${errorMsg}`);
        setError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (err: any) {
      const errorMessage = err.message || 'An unexpected error occurred';
      console.error(`Exception while deleting user: ${errorMessage}`);
      setError(errorMessage);
      toast.error(`Error: ${errorMessage}`);
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const getAuthenticationInfo = () => {
    const authInfo = userManagementService.getAuthenticationExplanation();
    setAuthInfo(authInfo.flowDescription);
    return authInfo.flowDescription;
  };

  return {
    deleteUser,
    isDeleting,
    error,
    authInfo,
    getAuthenticationInfo
  };
}
