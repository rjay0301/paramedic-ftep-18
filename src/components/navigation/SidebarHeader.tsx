
import React from 'react';
import { X } from 'lucide-react';

interface SidebarHeaderProps {
  onClose: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ onClose }) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-navy/30">
      <h2 className="text-lg font-semibold text-white">Navigation</h2>
      <button
        onClick={onClose}
        className="p-1 rounded-full hover:bg-navy/50 text-white"
        aria-label="Close sidebar"
      >
        <X className="h-5 w-5" />
      </button>
    </div>
  );
};

export default SidebarHeader;
