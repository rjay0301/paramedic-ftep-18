
import React, { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import AdminHeader from './AdminHeader';
import AdminSidebar from './AdminSidebar';

interface AdminLayoutProps {
  children: ReactNode;
  appName: string;
  adminName: string;
  adminRole: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  appName,
  adminName,
  adminRole,
  activeTab,
  setActiveTab
}) => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarExpanded(!isSidebarExpanded);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {!isSidebarExpanded && (
        <button 
          onClick={toggleSidebar}
          className="fixed top-4 left-4 z-50 bg-red-700 text-white p-2 rounded-full shadow-lg md:hidden"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}
      
      <AdminSidebar 
        appName={appName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarExpanded={isSidebarExpanded}
        onCloseSidebar={() => setIsSidebarExpanded(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <AdminHeader 
          adminName={adminName}
          adminRole={adminRole}
        />

        <div className="flex-1 overflow-auto pb-safe-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
