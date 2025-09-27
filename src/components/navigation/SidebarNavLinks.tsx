
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, User } from 'lucide-react';

interface SidebarNavLinksProps {
  onClose: () => void;
}

const SidebarNavLinks: React.FC<SidebarNavLinksProps> = ({ onClose }) => {
  return (
    <>
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md ${
            isActive
              ? 'bg-navy/50 text-white'
              : 'text-gray-300 hover:bg-navy/30 hover:text-white'
          }`
        }
        onClick={onClose}
      >
        <Home size={18} className="mr-2" />
        Dashboard
      </NavLink>
      
      <NavLink
        to="/profile"
        className={({ isActive }) =>
          `flex items-center px-3 py-2 rounded-md ${
            isActive
              ? 'bg-navy/50 text-white'
              : 'text-gray-300 hover:bg-navy/30 hover:text-white'
          }`
        }
        onClick={onClose}
      >
        <User size={18} className="mr-2" />
        Profile
      </NavLink>
    </>
  );
};

export default SidebarNavLinks;
