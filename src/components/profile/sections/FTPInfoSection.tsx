
import React from 'react';
import { User, Phone, Clock } from 'lucide-react';

interface FTPInfoSectionProps {
  profile: {
    ftpName: string;
    emergencyContact: string;
    joinDate: string;
  };
}

const FTPInfoSection: React.FC<FTPInfoSectionProps> = ({ profile }) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">FTP Name</label>
        <div className="flex items-center">
          <User size={18} className="text-gray-400 mr-2" />
          <span>{profile.ftpName || 'Not Set'}</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">FTP Contact Number</label>
        <div className="flex items-start">
          <Phone size={18} className="text-gray-400 mr-2 mt-0.5" />
          <span>{profile.emergencyContact || 'Not Set'}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 mb-1">Program Start Date</label>
        <div className="flex items-center">
          <Clock size={18} className="text-gray-400 mr-2" />
          <span>{profile.joinDate || 'Not Set'}</span>
        </div>
      </div>
    </div>
  );
};

export default FTPInfoSection;
