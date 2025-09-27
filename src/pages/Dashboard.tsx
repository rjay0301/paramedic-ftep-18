import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useSeedData } from '@/hooks/useSeedData';
import { 
  calculateTotalFormCount, 
  calculateCompletedForms,
  calculateProgressPercentage
} from '@/utils/dashboardUtils';
import Sidebar from '@/components/navigation/Sidebar';
import BottomNav from '@/components/navigation/BottomNav';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import ProgressOverview from '@/components/dashboard/ProgressOverview';
import PhaseGrid from '@/components/dashboard/PhaseGrid';
import { PhaseItem } from '@/types';
import { Button } from '@/components/ui/button';
import { RefreshCw, Wrench, AlertTriangle, Check } from 'lucide-react';
import { logger } from '@/services/form/utils/loggerService';
import { progressDiagnosticService } from '@/services/form/utils/progressDiagnosticService';
import { toast } from 'sonner';
import { useDashboardData } from '@/hooks/useDashboardData';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  useSeedData(); // This will seed training phases if needed
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isFixing, setIsFixing] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);
  
  const {
    phases,
    completedPhases,
    isUpdatingProgress,
    error,
    refreshDashboard,
    runDiagnostic
  } = useDashboardData();

  const totalForms = calculateTotalFormCount();
  const completedForms = calculateCompletedForms(phases);
  const progressPercentage = calculateProgressPercentage(completedForms, totalForms);

  const userName = user?.name || "Paramedic Student";

  const handlePhaseSelect = (phase: PhaseItem) => {
    if (phase.id === 'assignments') {
      logger.info('Navigating to assignments page', { userId: user?.id });
      navigate('/phases/assignments');
    } else {
      logger.info(`Navigating to phase ${phase.id}`, { userId: user?.id, phaseId: phase.id });
      navigate(`/phase/${phase.id}`);
    }
    setActiveTab('phase-form');
    setIsSidebarOpen(false);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleFormAccess = () => {
    setIsSidebarOpen(true);
    setActiveTab('phase-form');
  };

  const handleFixProgressData = async () => {
    if (!user?.id) return;
    
    setIsFixing(true);
    try {
      const result = await progressDiagnosticService.fixProgressIssues(user.id);
      if (result.success) {
        toast.success("Progress data has been fixed successfully");
        setDiagnosticInfo(result);
        await refreshDashboard();
      } else {
        toast.error("Failed to fix progress data");
      }
    } catch (error) {
      logger.error('Error fixing progress data', error);
      toast.error("An error occurred while fixing progress data");
    } finally {
      setIsFixing(false);
    }
  };

  // Refresh dashboard data when component mounts
  useEffect(() => {
    if (user?.id) {
      logger.info('Dashboard component mounted, refreshing data', { userId: user.id });
      refreshDashboard();
    }
  }, [user?.id, refreshDashboard]);

  return (
    <div className="relative max-w-7xl mx-auto px-4 pt-16 pb-20 md:pt-24 md:pb-10 page-transition">
      <DashboardHeader
        userName={userName}
        toggleSidebar={toggleSidebar}
      />
      
      <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1 mb-8">
        <div className="flex flex-col">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-xl font-semibold">Progress Overview</h2>
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={handleFixProgressData}
                disabled={isFixing || isUpdatingProgress}
              >
                <Wrench size={16} className={isFixing ? "animate-spin" : ""} /> 
                {isFixing ? "Fixing..." : "Fix Progress"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={runDiagnostic}
                disabled={isUpdatingProgress}
              >
                <Wrench size={16} className={isUpdatingProgress ? "animate-spin" : ""} /> 
                {isUpdatingProgress ? "Diagnosing..." : "Diagnose"}
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={refreshDashboard}
                disabled={isUpdatingProgress}
              >
                <RefreshCw size={16} className={isUpdatingProgress ? "animate-spin" : ""} /> 
                {isUpdatingProgress ? "Refreshing..." : "Refresh"}
              </Button>
            </div>
          </div>
          
          {diagnosticInfo && diagnosticInfo.fixedIssues && diagnosticInfo.fixedIssues.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
              <h3 className="text-green-700 font-medium flex items-center">
                <Check size={16} className="mr-2" />
                Progress Issues Fixed
              </h3>
              <ul className="text-green-600 text-sm mt-2 list-disc list-inside">
                {diagnosticInfo.fixedIssues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {diagnosticInfo && diagnosticInfo.remainingIssues && diagnosticInfo.remainingIssues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-700 font-medium flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Remaining Issues
              </h3>
              <ul className="text-yellow-600 text-sm mt-2 list-disc list-inside">
                {diagnosticInfo.remainingIssues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          <ProgressOverview
            isUpdatingProgress={isUpdatingProgress}
            progressPercentage={progressPercentage}
            completedForms={completedForms}
            totalForms={totalForms}
            error={error}
          />
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mb-4">All Phases</h2>
      <PhaseGrid
        phases={phases}
        completedPhases={completedPhases}
        onPhaseSelect={handlePhaseSelect}
      />

      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        phases={phases}
        onPhaseSelect={handlePhaseSelect}
        completedPhases={completedPhases}
      />
      
      <BottomNav 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onFormAccess={handleFormAccess}
      />
    </div>
  );
};

export default Dashboard;
