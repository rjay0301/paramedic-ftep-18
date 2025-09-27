import React from 'react';
import { LogOut, Menu } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';

type ProfileHeaderProps = {
  name: string;
  role: string;
  corporationId: string;
  department: string;
  onMenuClick: () => void;
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  role,
  corporationId,
  department,
  onMenuClick
}) => {
  const {
    signOut
  } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return <div className="bg-primary-500 p-6 flex flex-col md:flex-row items-center relative">
      <button onClick={onMenuClick} className="absolute top-6 left-6 text-white p-1 rounded-md hover:bg-primary-600 transition-colors" aria-label="Open menu">
        <Menu size={24} />
      </button>

      <button onClick={handleLogout} className="absolute top-6 right-6 text-white p-1 rounded-md hover:bg-primary-600 transition-colors" aria-label="Logout">
        <LogOut size={24} />
      </button>
      
      <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-primary-600 text-4xl font-bold mb-4 md:mb-0 md:mr-6 shadow-md ml-8 md:ml-10 mx-[25px]">
        {name.charAt(0)}
      </div>
      
      <div className="text-center md:text-left flex-1">
        <h2 className="text-xl font-semibold text-white">{name}</h2>
        <p className="text-primary-100">
          {role} • Corp ID: {corporationId}
        </p>
        <p className="text-primary-100 text-sm mt-1">{department}</p>
      </div>
    </div>;
};

export default ProfileHeader;
