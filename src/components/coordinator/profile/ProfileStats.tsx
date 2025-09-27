
import React from 'react';
import { Mail, Phone } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Student } from '@/types/coordinator';

interface ProfileStatsProps {
  student: Student;
}

const ProfileStats: React.FC<ProfileStatsProps> = ({ student }) => {
  const getProgressColor = (progress: number) => {
    if (progress < 50) return "bg-red-500";
    if (progress < 75) return "bg-yellow-500";
    return "bg-green-500";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-4 sm:mb-6">
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">Progress Overview</h3>
        <div className="text-xl sm:text-3xl font-bold mb-1 sm:mb-2">{student.progress}%</div>
        <Progress 
          value={student.progress}
          className={`h-2 sm:h-2.5 mb-2 sm:mb-4 ${getProgressColor(student.progress)}`}
        />
        <div className="text-xs text-gray-500">Last updated: {student.lastUpdated || 'N/A'}</div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">Contact Information</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <Mail className="text-gray-400 mr-2 h-4 w-4" />
            <a href={`mailto:${student.email}`} className="text-primary hover:text-primary-dark text-xs sm:text-sm truncate">
              {student.email}
            </a>
          </div>
          <div className="flex items-center">
            <Phone className="text-gray-400 mr-2 h-4 w-4" />
            <a href={`tel:${student.phone}`} className="text-primary hover:text-primary-dark text-xs sm:text-sm">
              {student.phone}
            </a>
          </div>
        </div>
      </div>
      
      <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
        <h3 className="font-medium text-gray-500 mb-1 sm:mb-2 text-xs sm:text-sm">Program Details</h3>
        <div className="space-y-2 text-xs sm:text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Alpha Unit:</span>
            <span className="font-medium">{student.alphaUnit}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">FTP Name:</span>
            <span className="font-medium">{student.ftpName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">FTP Contact:</span>
            <span className="font-medium">{student.ftpContact}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileStats;
