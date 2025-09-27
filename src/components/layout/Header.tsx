
import React, { useState, useRef, useEffect } from 'react';
import { Menu, User, X, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/auth';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type HeaderProps = {
  onMenuToggle: () => void;
};

const Header: React.FC<HeaderProps> = ({
  onMenuToggle
}) => {
  const { user, signOut } = useAuth();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut();
      setProfileMenuOpen(false);
      toast.success('Logged out successfully');
      setTimeout(() => {
        navigate('/login', {
          replace: true
        });
      }, 100);
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error('Failed to sign out');
    }
  };

  const getRoleDisplay = () => {
    if (!user?.role) return '';
    const role = user.role as string;
    switch (role) {
      case 'student':
        return 'Student';
      case 'coordinator':
        return 'Coordinator';
      default:
        return role.charAt(0).toUpperCase() + role.slice(1);
    }
  };

  return (
    <header className="bg-primary-600 text-white p-4 shadow-md fixed top-0 left-0 right-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md hover:bg-primary-700 transition-colors duration-200" onClick={onMenuToggle} aria-label="Toggle menu">
            <Menu size={24} />
          </button>
          
          <div className="flex items-center">
            <img src="/lovable-uploads/51769bc3-3069-4432-b088-7a99a91c9bcb.png" alt="Hamad Ambulance Service" className="h-8 mr-3" />
            <h1 className="text-xl font-semibold tracking-tight">FTEP</h1>
          </div>
        </div>
        
        <div className="relative" ref={menuRef}>
          <button className="flex items-center space-x-2 p-2 rounded-md hover:bg-primary-700 transition-colors duration-200" onClick={() => setProfileMenuOpen(!profileMenuOpen)} aria-expanded={profileMenuOpen} aria-haspopup="true">
            <div className="w-8 h-8 rounded-full bg-primary-300 flex items-center justify-center text-primary-900 font-medium">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <ChevronDown size={16} className={`transition-transform duration-200 ${profileMenuOpen ? 'rotate-180' : ''}`} />
          </button>
          
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-800 animate-scale-in origin-top-right">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="font-medium text-sm">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
                {user?.role && (
                  <div className="mt-1">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary-100 text-primary-800">
                      {getRoleDisplay()}
                    </span>
                  </div>
                )}
              </div>
              <Link to="/profile" className="block px-4 py-2 text-sm hover:bg-gray-100 transition-colors duration-150" onClick={() => setProfileMenuOpen(false)}>
                Manage Profile
              </Link>
              <button onClick={handleSignOut} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-150">
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
