
import React from 'react';
import { Users, BarChart2, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface CoordinatorSidebarProps {
  appName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
  onCloseSidebar: () => void;
}

const CoordinatorSidebar: React.FC<CoordinatorSidebarProps> = ({ 
  appName, 
  activeTab, 
  setActiveTab,
  isSidebarExpanded,
  onCloseSidebar
}) => {
  const isMobile = useIsMobile();
  const { signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logged out successfully');
      
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  return (
    <>
      <div 
        className={`${
          isSidebarExpanded ? 'translate-x-0' : '-translate-x-full'
        } fixed md:static z-40 h-full transition-transform duration-300 ease-in-out ${
          isMobile ? 'w-[260px]' : 'w-64'
        } bg-navy text-white p-4`}
      >
        <div className="flex items-center justify-between mb-8 mt-2">
          <h1 className="text-xl font-bold">{appName}</h1>
          {isMobile && (
            <button
              onClick={onCloseSidebar}
              className="p-1.5 rounded-full hover:bg-navy/50 text-white"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}
        </div>
        
        <nav>
          <ul>
            <li className="mb-2">
              <button 
                onClick={() => {
                  setActiveTab('dashboard');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'dashboard' ? 'bg-navy/50' : 'hover:bg-navy/30'}`}
              >
                <BarChart2 size={20} className="mr-3" />
                <span>Dashboard</span>
              </button>
            </li>
            <li className="mb-2">
              <button 
                onClick={() => {
                  setActiveTab('students');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'students' || activeTab === 'studentProfile' ? 'bg-navy/50' : 'hover:bg-navy/30'}`}
              >
                <Users size={20} className="mr-3" />
                <span>Students</span>
              </button>
            </li>
            <li className="mt-auto">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg hover:bg-navy/30 mt-48 text-red-400"
              >
                <LogOut size={20} className="mr-3" />
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {isMobile && isSidebarExpanded && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={onCloseSidebar}
        />
      )}
    </>
  );
};

export default CoordinatorSidebar;
