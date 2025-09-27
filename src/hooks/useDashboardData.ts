
import { useCallback } from 'react';
import { useAuth } from '@/contexts/auth/AuthContext';
import { useDashboardState } from './dashboard/useDashboardState';
import { useDashboardData as useDashboardDataFetcher } from './dashboard/useDashboardData';
import { useRealtimeUpdates } from './dashboard/useRealtimeUpdates';

/**
 * Main dashboard data hook that combines state, data fetching, and realtime updates
 * @returns Dashboard data and functions
 */
export const useDashboardData = () => {
  const { user } = useAuth();
  
  // Use the dashboard state hook
  const {
    phases,
    setPhases,
    completedPhases, 
    setCompletedPhases,
    isUpdatingProgress,
    setIsUpdatingProgress,
    error,
    setError,
    diagnosisResult,
    setDiagnosisResult
  } = useDashboardState();
  
  // Use the dashboard data fetcher hook
  const {
    fetchUpdatedData,
    refreshDashboard,
    runDiagnostic
  } = useDashboardDataFetcher(
    user?.id,
    setPhases,
    setCompletedPhases,
    setIsUpdatingProgress,
    setError,
    setDiagnosisResult
  );
  
  // Memoized fetchUpdatedData to avoid recreating it
  const fetchData = useCallback(() => {
    return fetchUpdatedData();
  }, [fetchUpdatedData]);
  
  // Set up realtime updates
  useRealtimeUpdates(user?.id, fetchData);

  return {
    phases,
    completedPhases,
    isUpdatingProgress,
    error,
    diagnosisResult,
    fetchUpdatedData,
    refreshDashboard,
    runDiagnostic
  };
};
