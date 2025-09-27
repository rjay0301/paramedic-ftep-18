
import { useQuery } from '@tanstack/react-query';
import { phasesService } from '@/services/phases.service';

export function useAllPhases() {
  return useQuery({
    queryKey: ['phases'],
    queryFn: () => phasesService.getAllPhases()
  });
}

export function usePhaseById(phaseId: string | undefined) {
  return useQuery({
    queryKey: ['phase', phaseId],
    queryFn: () => phaseId ? phasesService.getPhaseById(phaseId) : null,
    enabled: !!phaseId
  });
}
