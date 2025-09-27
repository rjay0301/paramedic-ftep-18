
import { useEffect, useState } from 'react';
import { seedTrainingPhases } from '@/services/utils/seedPhases';
import { useAuth } from '@/contexts/auth/AuthContext';

export function useSeedData() {
  const { user, profile } = useAuth();
  const [isSeeding, setIsSeeding] = useState(false);
  const [seedError, setSeedError] = useState<Error | null>(null);
  const [seeded, setSeeded] = useState(false);
  
  useEffect(() => {
    // Only seed data if user is authenticated and has coordinator or admin role
    const shouldSeed = !!user && 
      !!profile && 
      ['coordinator', 'admin'].includes(profile.role) && 
      !seeded && 
      !isSeeding;
      
    if (shouldSeed) {
      const performSeed = async () => {
        setIsSeeding(true);
        try {
          await seedTrainingPhases();
          setSeeded(true);
        } catch (error) {
          setSeedError(error instanceof Error ? error : new Error('Failed to seed data'));
          console.error('Seed error:', error);
        } finally {
          setIsSeeding(false);
        }
      };
      
      performSeed();
    }
  }, [user, profile, seeded, isSeeding]);
  
  return { isSeeding, seedError, seeded };
}
