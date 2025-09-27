
import React, { ReactNode, useState } from 'react';
import { Menu } from 'lucide-react';
import CoordinatorHeader from './CoordinatorHeader';
import CoordinatorSidebar from './CoordinatorSidebar';

interface CoordinatorLayoutProps {
  children: ReactNode;
  appName: string;
  coordinatorName: string;
  coordinatorRole: string;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const CoordinatorLayout: React.FC<CoordinatorLayoutProps> = ({
  children,
  appName,
  coordinatorName,
  coordinatorRole,
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
          className="fixed top-4 left-4 z-50 bg-navy text-white p-2 rounded-full shadow-lg md:hidden"
          aria-label="Open Sidebar"
        >
          <Menu size={24} />
        </button>
      )}
      
      <CoordinatorSidebar 
        appName={appName}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isSidebarExpanded={isSidebarExpanded}
        onCloseSidebar={() => setIsSidebarExpanded(false)}
      />

      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <CoordinatorHeader 
          coordinatorName={coordinatorName}
          coordinatorRole={coordinatorRole}
        />

        <div className="flex-1 overflow-auto pb-safe-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CoordinatorLayout;
