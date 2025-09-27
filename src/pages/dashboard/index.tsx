
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/navigation/Sidebar';
import { useAuth } from '@/contexts/auth';
import { PhaseItem } from '@/types';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import PhaseGrid from '@/components/dashboard/PhaseGrid';
import { usePhasesData } from '@/hooks/usePhasesData';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import { toast } from 'sonner';
import { 
  calculateTotalFormCount, 
  calculateCompletedForms,
  calculateProgressPercentage
} from '@/utils/dashboardUtils';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  const {
    phases,
    completedPhases,
    loading,
    error,
    retryFetch
  } = usePhasesData();

  const totalForms = calculateTotalFormCount();
  const completedForms = calculateCompletedForms(phases);
  const progressPercentage = calculateProgressPercentage(completedForms, totalForms);

  const handlePhaseSelect = (phase: PhaseItem) => {
    navigate(`/phase/${phase.id}`);
  };

  const handleRetry = () => {
    toast.info("Retrying data fetch...");
    retryFetch();
  };

  const handleRefreshDashboard = () => {
    toast.info("Refreshing dashboard data...");
    retryFetch();
  };

  const userName = user?.name || user?.full_name || 'Paramedic';

  return (
    <div>
      <Header onMenuToggle={() => setIsSidebarOpen(true)} />
      
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        phases={phases}
        completedPhases={completedPhases}
        onPhaseSelect={handlePhaseSelect}
      />
      
      <div className="container mx-auto p-4 pt-16 md:pt-24">
        <DashboardHeader 
          userName={userName} 
          onRefresh={handleRefreshDashboard} 
          loading={loading}
        />
        
        <div className="mb-6">
          <ProgressOverview 
            isUpdatingProgress={loading}
            progressPercentage={progressPercentage}
            completedForms={completedForms}
            totalForms={totalForms}
            error={error}
          />
        </div>
        
        <h2 className="text-xl font-semibold mb-4">Your Workbook Phases</h2>
        
        <PhaseGrid 
          phases={phases} 
          completedPhases={completedPhases}
          onPhaseSelect={handlePhaseSelect}
          loading={loading}
          error={error}
          onRetry={handleRetry}
        />
      </div>
    </div>
  );
};

export default Dashboard;
