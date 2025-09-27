
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AdminHeaderProps {
  adminName: string;
  adminRole: string;
}

const AdminHeader: React.FC<AdminHeaderProps> = ({
  adminName,
  adminRole
}) => {
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      navigate('/login', { replace: true });
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 shadow-sm flex justify-between items-center">
      <div className="flex items-center">
        <div className="ml-2">
          <h2 className="text-lg font-medium text-gray-700">Admin Dashboard</h2>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <User size={16} className="mr-1 text-gray-500" />
          <div>
            <p className="text-sm font-medium text-gray-700">{adminName}</p>
            <p className="text-xs text-gray-500">{adminRole}</p>
          </div>
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleLogout}
          className="flex items-center text-red-500 border-red-300 hover:bg-red-50"
        >
          <LogOut size={16} className="mr-1" />
          Logout
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
