
import React from 'react';
import { FileText } from 'lucide-react';

interface AuthHeaderProps {
  title: string;
  subtitle: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500 text-white mb-4 shadow-md">
        <FileText size={32} />
      </div>
      <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
      <p className="text-gray-600 mt-2">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
