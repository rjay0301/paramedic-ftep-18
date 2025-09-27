
import { useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/form/utils/loggerService';
import { progressDiagnosticService } from '@/services/form/utils/progressDiagnosticService';

/**
 * Main dashboard data hook that combines state, data fetching, and realtime updates
 */
export const useDashboardData = (
  userId?: string,
  setPhases?: (phases: any[]) => void,
  setCompletedPhases?: (phases: string[]) => void,
  setIsUpdatingProgress?: (isUpdating: boolean) => void,
  setError?: (error: string | null) => void,
  setDiagnosisResult?: (result: any | null) => void
) => {
  const phases = [];
  const completedPhases = [];
  const isUpdatingProgress = false;
  const error = null;
  const diagnosisResult = null;

  // Fetch updated dashboard data
  const fetchUpdatedData = useCallback(async () => {
    if (!userId) return;
    
    try {
      if (setIsUpdatingProgress) setIsUpdatingProgress(true);
      
      // Fetch phases data from training_phases table
      const { data: phasesData, error: phasesError } = await supabase
        .from('training_phases')
        .select('*')
        .order('order_index', { ascending: true });
      
      if (phasesError) {
        throw phasesError;
      }
      
      // Fetch student submissions to calculate completion
      const { data: submissions, error: submissionsError } = await supabase
        .from('student_submissions')
        .select('phase_id, status')
        .eq('student_id', userId)
        .eq('status', 'submitted');
      
      if (submissionsError) {
        throw submissionsError;
      }
      
      // Process phases data with completion information
      if (setPhases && phasesData) {
        const processedPhases = phasesData.map(phase => {
          const phaseSubmissions = submissions?.filter(sub => sub.phase_id === phase.id) || [];
          const completed = phaseSubmissions.length;
          // This is a simplification - you may need to adjust this logic based on your requirements
          return {
            ...phase,
            id: phase.name.toLowerCase().replace(/\s+/g, '-'),
            title: phase.name,
            description: phase.description,
            status: completed > 0 ? 'completed' : 'not-started',
            icon: getPhaseIcon(phase.name),
            completed,
            total: 1, // This is a placeholder - adjust according to your phase structure
          };
        });
        
        setPhases(processedPhases);
        
        // Set completed phases
        if (setCompletedPhases) {
          const completed = processedPhases
            .filter(phase => phase.status === 'completed')
            .map(phase => phase.id);
          setCompletedPhases(completed);
        }
      }
      
      if (setError) setError(null);
    } catch (err) {
      logger.error('Error fetching dashboard data:', err);
      if (setError) setError('Failed to load dashboard data. Please try again.');
    } finally {
      if (setIsUpdatingProgress) setIsUpdatingProgress(false);
    }
  }, [userId, setPhases, setCompletedPhases, setIsUpdatingProgress, setError]);

  const refreshDashboard = useCallback(async () => {
    await fetchUpdatedData();
    toast.success('Dashboard data refreshed');
  }, [fetchUpdatedData]);
  
  const runDiagnostic = useCallback(async () => {
    if (!userId) return;
    
    try {
      if (setIsUpdatingProgress) setIsUpdatingProgress(true);
      
      // Using runDiagnostic instead of diagnoseStudentProgress
      const result = await progressDiagnosticService.runDiagnostic(userId);
      
      if (setDiagnosisResult) {
        setDiagnosisResult(result);
      }
      
      toast.success('Diagnostic check completed');
    } catch (err) {
      logger.error('Error running diagnostic:', err);
      toast.error('Failed to run diagnostic');
    } finally {
      if (setIsUpdatingProgress) setIsUpdatingProgress(false);
    }
  }, [userId, setDiagnosisResult, setIsUpdatingProgress]);

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

// Helper function to determine the icon for each phase
const getPhaseIcon = (phaseName: string): string => {
  const name = phaseName.toLowerCase();
  
  if (name.includes('assignment')) return 'ClipboardList';
  if (name.includes('rural') || name.includes('ambulance')) return 'Ambulance';
  if (name.includes('observational')) return 'Eye';
  if (name.includes('instructional')) return 'BookOpen';
  if (name.includes('independent')) return 'User';
  if (name.includes('reflective')) return 'PenTool';
  if (name.includes('declaration')) return 'FileText';
  if (name.includes('evaluation')) return 'CheckSquare';
  
  // Default icon
  return 'Circle';
};
