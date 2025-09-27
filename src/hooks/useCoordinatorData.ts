
import { useState, useEffect, useCallback } from 'react';
import { Student, Phase, RecentActivity } from '@/types/coordinator';
import { useStudentsData } from '@/hooks/coordinator/useStudentsData';
import { usePhasesData } from '@/hooks/coordinator/usePhasesData';
import { useActivitiesData } from '@/hooks/coordinator/useActivitiesData';

export const useCoordinatorData = (userId: string | undefined, userRole: string | undefined) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [refreshCounter, setRefreshCounter] = useState(0);
  const [lastRefreshTime, setLastRefreshTime] = useState(0);
  
  // Use hooks to fetch different data types
  const { 
    students, 
    setStudents, 
    isLoading: isLoadingStudents,
    refreshStudents
  } = useStudentsData(userId, userRole, refreshCounter);
  
  const { 
    phases, 
    isLoading: isLoadingPhases,
    refreshPhases
  } = usePhasesData(userId, userRole, refreshCounter);
  
  const { 
    recentActivities, 
    isLoading: isLoadingActivities,
    refreshActivities
  } = useActivitiesData(userId, userRole, refreshCounter);

  // Update initialization status
  useEffect(() => {
    if (!isInitialized && !isLoadingStudents && !isLoadingPhases && !isLoadingActivities) {
      setIsInitialized(true);
    }
  }, [isInitialized, isLoadingStudents, isLoadingPhases, isLoadingActivities]);

  const isLoading = !isInitialized || isLoadingStudents || isLoadingPhases || isLoadingActivities;
  
  // Function to refresh student data with debouncing
  const refreshStudentData = useCallback(() => {
    // Implement debouncing (don't refresh more than once every 2 seconds)
    const now = Date.now();
    if (now - lastRefreshTime < 2000) {
      console.log('Debouncing refresh request');
      return;
    }
    
    setLastRefreshTime(now);
    setRefreshCounter(prev => prev + 1);
    
    // Also trigger individual refreshes for components
    refreshStudents();
    refreshPhases();
    refreshActivities();
  }, [lastRefreshTime, refreshStudents, refreshPhases, refreshActivities]);

  return {
    students,
    setStudents,
    phases,
    recentActivities,
    isLoading,
    refreshStudentData
  };
};
