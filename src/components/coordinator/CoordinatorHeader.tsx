
import React from 'react';
import { useIsMobile } from '@/hooks/use-mobile';

interface CoordinatorHeaderProps {
  coordinatorName: string;
  coordinatorRole: string;
}

const CoordinatorHeader: React.FC<CoordinatorHeaderProps> = ({ 
  coordinatorName, 
  coordinatorRole 
}) => {
  const isMobile = useIsMobile();
  
  return (
    <header className="bg-white shadow p-4">
      <div className={`flex ${isMobile ? 'flex-col' : 'flex-row justify-between'} items-center`}>
        <div className="flex items-center justify-between w-full">
          <h2 className={`${isMobile ? 'text-lg' : 'text-xl'} font-semibold`}>
            {!isMobile && `Welcome, ${coordinatorName}`}
          </h2>
          <div className="flex items-center space-x-2">
            {isMobile && (
              <span className="bg-primary-100 text-primary py-1 px-2 rounded-full text-xs font-medium mr-2">
                {coordinatorRole}
              </span>
            )}
            <p className="text-gray-600 text-xs sm:text-sm">Today is {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        {!isMobile && (
          <div className="flex items-center space-x-4">
            <span className="bg-primary-100 text-primary py-1 px-2 sm:px-3 rounded-full text-xs sm:text-sm font-medium">
              {coordinatorRole}
            </span>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
              {coordinatorName.split(' ').map(n => n?.[0] || '').join('')}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default CoordinatorHeader;
