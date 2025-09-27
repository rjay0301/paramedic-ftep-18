
import React from 'react';
import { Users, BarChart2, LogOut, Activity, DatabaseIcon, Calendar } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AdminSidebarProps {
  appName: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isSidebarExpanded: boolean;
  onCloseSidebar: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ 
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
      navigate('/login', { replace: true });
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
        } bg-red-900 text-white p-4`}
      >
        <div className="flex items-center justify-between mb-8 mt-2">
          <h1 className="text-xl font-bold">{appName}</h1>
          {isMobile && (
            <button
              onClick={onCloseSidebar}
              className="p-1.5 rounded-full hover:bg-red-800 text-white"
              aria-label="Close sidebar"
            >
              ✕
            </button>
          )}
        </div>
        
        <nav>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => {
                  setActiveTab('users');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'users' ? 'bg-red-800' : 'hover:bg-red-800/50'}`}
              >
                <Users size={20} className="mr-3" />
                <span>User Management</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('analytics');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'analytics' ? 'bg-red-800' : 'hover:bg-red-800/50'}`}
              >
                <BarChart2 size={20} className="mr-3" />
                <span>Analytics</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('progress');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'progress' ? 'bg-red-800' : 'hover:bg-red-800/50'}`}
              >
                <Activity size={20} className="mr-3" />
                <span>Student Progress</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('audit-logs');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'audit-logs' ? 'bg-red-800' : 'hover:bg-red-800/50'}`}
              >
                <Calendar size={20} className="mr-3" />
                <span>Audit Logs</span>
              </button>
            </li>
            <li>
              <button 
                onClick={() => {
                  setActiveTab('database');
                  if (isMobile) onCloseSidebar();
                }}
                className={`flex items-center w-full p-3 rounded-lg ${activeTab === 'database' ? 'bg-red-800' : 'hover:bg-red-800/50'}`}
              >
                <DatabaseIcon size={20} className="mr-3" />
                <span>Database Records</span>
              </button>
            </li>
            
            <li className="pt-8">
              <button 
                onClick={handleLogout}
                className="flex items-center w-full p-3 rounded-lg hover:bg-red-800/50 text-red-200"
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

export default AdminSidebar;
