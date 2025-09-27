
import { useState, useEffect, useCallback } from 'react';
import { Phase } from '@/types/coordinator';
import { supabase } from '@/integrations/supabase/client';

export const usePhasesData = (userId: string | undefined, userRole: string | undefined, refreshCounter = 0) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchPhases = useCallback(async () => {
    if (!userId || userRole !== 'coordinator') return;

    try {
      setIsLoading(true);
      
      const { data: phaseData, error: phaseError } = await supabase
        .from('student_phase_progress')
        .select('phase_name, total_items, completed_items')
        .order('phase_name');

      if (phaseError) {
        console.error('Error fetching phases:', phaseError);
        return;
      }

      if (phaseData) {
        const phaseMap = new Map<string, { count: number, completed: number }>();
        
        phaseData.forEach(phase => {
          const name = phase.phase_name;
          if (!phaseMap.has(name)) {
            phaseMap.set(name, { count: 0, completed: 0 });
          }
          
          const current = phaseMap.get(name)!;
          current.count += phase.total_items;
          current.completed += phase.completed_items;
        });
        
        const mappedPhases: Phase[] = Array.from(phaseMap.entries())
          .map(([phase, data], index) => ({
            id: index.toString(),
            phase: phase.charAt(0).toUpperCase() + phase.slice(1).replace('_', ' '),
            count: data.count,
            completed: data.completed
          }));
        
        setPhases(mappedPhases);
      }
    } catch (error) {
      console.error('Error in fetchPhases:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  // Fetch phases when refreshCounter changes
  useEffect(() => {
    fetchPhases();
  }, [fetchPhases, refreshCounter]);

  return { 
    phases, 
    isLoading, 
    refreshPhases: fetchPhases 
  };
};
