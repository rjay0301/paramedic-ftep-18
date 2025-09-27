
import React from 'react';
import { RefreshCw, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface DashboardHeaderProps {
  userName: string;
  onRefresh?: () => void;
  toggleSidebar?: () => void;
  loading?: boolean;
}

const DashboardHeader = ({ 
  userName, 
  onRefresh, 
  toggleSidebar,
  loading = false 
}: DashboardHeaderProps) => {
  const today = new Date();
  const dateOptions: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  const formattedDate = today.toLocaleDateString(undefined, dateOptions);

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <div className="flex items-center gap-3 mb-4 md:mb-0">
        {toggleSidebar && (
          <Button 
            onClick={toggleSidebar}
            variant="ghost"
            size="icon"
            className="md:hidden"
          >
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <div>
          <h1 className="text-2xl font-bold">Welcome, {userName}</h1>
          <p className="text-gray-600">{formattedDate}</p>
        </div>
      </div>
      
      {onRefresh && (
        <Button 
          onClick={onRefresh} 
          variant="outline" 
          size="sm"
          disabled={loading}
          className="self-start md:self-auto"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Refreshing...' : 'Refresh Dashboard'}
        </Button>
      )}
    </div>
  );
};

export default DashboardHeader;
