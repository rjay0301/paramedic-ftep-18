
import { useState } from 'react';
import { PhaseItem } from '@/types';

/**
 * Hook for managing dashboard state
 */
export const useDashboardState = () => {
  const [phases, setPhases] = useState<PhaseItem[]>([]);
  const [completedPhases, setCompletedPhases] = useState<string[]>([]);
  const [isUpdatingProgress, setIsUpdatingProgress] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [diagnosisResult, setDiagnosisResult] = useState<any | null>(null);

  return {
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
  };
};
