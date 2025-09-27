
import React from 'react';
import { Home, FileText, User, Menu } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

type BottomNavProps = {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onFormAccess: () => void;
};

const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange, onFormAccess }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Hide bottom navigation on coordinator pages
  if (location.pathname.includes('/coordinator')) {
    return null;
  }

  const handleTabChange = (tab: string) => {
    onTabChange(tab);
    if (tab === 'dashboard') {
      navigate('/dashboard');
    } else if (tab === 'profile') {
      navigate('/profile');
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg safe-bottom z-10 md:hidden animate-slide-in-bottom">
      <div className="flex justify-around">
        <button 
          className={`flex flex-col items-center p-4 w-full transition-colors duration-200 ${
            activeTab === 'dashboard' || location.pathname === '/dashboard'
              ? 'text-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('dashboard')}
        >
          <Home size={22} className={activeTab === 'dashboard' ? 'animate-pulse-subtle' : ''} />
          <span className="text-xs mt-1 font-medium">Home</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-4 w-full transition-colors duration-200 ${
            activeTab === 'phase-form' 
              ? 'text-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={onFormAccess}
        >
          <FileText size={22} className={activeTab === 'phase-form' ? 'animate-pulse-subtle' : ''} />
          <span className="text-xs mt-1 font-medium">Forms</span>
        </button>
        
        <button 
          className={`flex flex-col items-center p-4 w-full transition-colors duration-200 ${
            activeTab === 'profile' || location.pathname === '/profile'
              ? 'text-primary-500' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => handleTabChange('profile')}
        >
          <User size={22} className={activeTab === 'profile' ? 'animate-pulse-subtle' : ''} />
          <span className="text-xs mt-1 font-medium">Profile</span>
        </button>
      </div>
    </nav>
  );
};

export default BottomNav;
