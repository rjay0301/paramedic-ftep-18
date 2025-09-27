
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { PhaseItem } from '@/types';
import { formTypeToPhase, phaseFormCounts } from '@/services/form/constants/phaseConstants';
import { logger } from '@/services/form/utils/loggerService';
import { useAuth } from '@/contexts/auth';

/**
 * Custom hook for fetching phases data with error handling and offline support
 */
export const usePhasesData = () => {
  const { user } = useAuth();
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Load phases data
  useEffect(() => {
    if (!user?.id) return;
    
    const fetchPhaseData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // First get the student ID
        const { data: studentData, error: studentError } = await supabase
          .from('students')
          .select('id')
          .eq('profile_id', user.id)
          .maybeSingle();
        
        if (studentError && studentError.code !== 'PGRST116') {
          logger.error('Error fetching student data', studentError);
          throw new Error('Failed to load student data');
        }
        
        const studentId = studentData?.id || user.id;
        
        // Get submitted forms
        const { data: submissions, error: submissionsError } = await supabase
          .from('form_submissions')
          .select('form_type, form_number')
          .eq('student_id', studentId)
          .eq('status', 'submitted');
        
        if (submissionsError && submissionsError.code !== 'PGRST116') {
          logger.error('Error fetching form submissions', submissionsError);
          throw new Error('Failed to load submission data');
        }
        
        // Generate phases with completion info
        const defaultPhases = [
          { id: 'assignments', name: 'Assignments', completed: 0, total: 6, locked: false },
          { id: 'rural-ambulance', name: 'Rural Ambulance', completed: 0, total: 2, locked: false },
          { id: 'observation', name: 'Observation Phase', completed: 0, total: 2, locked: false },
          { id: 'instructional', name: 'Instructional Phase', completed: 0, total: 6, locked: false },
          { id: 'instructional-evaluation', name: 'Instructional Shift Evaluation', completed: 0, total: 6, locked: false },
          { id: 'instructional-summaries', name: 'Instructional Case Summaries', completed: 0, total: 20, locked: false },
          { id: 'independent', name: 'Independent Phase', completed: 0, total: 6, locked: false },
          { id: 'independent-evaluation', name: 'Independent Shift Evaluation', completed: 0, total: 6, locked: false },
          { id: 'independent-summaries', name: 'Independent Case Summaries', completed: 0, total: 10, locked: false },
          { id: 'reflective', name: 'Reflective Practice', completed: 0, total: 1, locked: false },
          { id: 'final-evaluation', name: 'Declaration of Readiness', completed: 0, total: 1, locked: false },
          { id: 'evaluation-forms', name: 'Final Evaluation', completed: 0, total: 4, locked: false },
        ];
        
        // Count completions from submissions if available
        if (submissions && submissions.length > 0) {
          // Group submissions by phase
          const submissionsByPhase: Record<string, Set<number>> = {};
          
          submissions.forEach(submission => {
            const phase = formTypeToPhase[submission.form_type];
            if (!phase) return;
            
            if (!submissionsByPhase[phase]) {
              submissionsByPhase[phase] = new Set();
            }
            
            submissionsByPhase[phase].add(submission.form_number);
          });
          
          // Update phase completion counts
          defaultPhases.forEach(phase => {
            const completed = submissionsByPhase[phase.id]?.size || 0;
            phase.completed = completed;
          });
        }
        
        setPhases(defaultPhases);
        
        // Get completed phases - either from phase progress or calculate
        try {
          const { data: phaseProgress, error: phaseError } = await supabase
            .from('student_phase_progress')
            .select('phase_name, is_complete')
            .eq('student_id', studentId)
            .eq('is_complete', true);
          
          if (!phaseError && phaseProgress) {
            const completed = phaseProgress.map(p => p.phase_name);
            setCompletedPhases(completed);
          } else {
            // Calculate from submissions as fallback
            const completed = Object.entries(phaseFormCounts)
              .filter(([phase, total]) => {
                const submittedCount = defaultPhases.find(p => p.id === phase)?.completed || 0;
                return submittedCount >= total;
              })
              .map(([phase]) => phase);
              
            setCompletedPhases(completed);
          }
        } catch (phaseError) {
          logger.error('Error processing phase completion', phaseError);
          // Fall back to simple completion logic
          const completed = defaultPhases
            .filter(phase => phase.completed >= phase.total && phase.total > 0)
            .map(phase => phase.id);
            
          setCompletedPhases(completed);
        }
      } catch (error) {
        logger.error('Error in usePhasesData', error);
        setError('Failed to load phase data');
        
        // Set default values for offline mode
        setPhases([
          { id: 'assignments', name: 'Assignments', completed: 0, total: 6, locked: false },
          { id: 'rural-ambulance', name: 'Rural Ambulance', completed: 0, total: 2, locked: false },
          { id: 'observation', name: 'Observation Phase', completed: 0, total: 2, locked: false },
          { id: 'instructional', name: 'Instructional Phase', completed: 0, total: 6, locked: false },
        ]);
        setCompletedPhases(['assignments']);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPhaseData();
  }, [user?.id, retryCount]);

  const retryFetch = () => {
    setRetryCount(prevCount => prevCount + 1);
  };

  return {
    phases,
    completedPhases,
    loading,
    error,
    retryFetch
  };
};
