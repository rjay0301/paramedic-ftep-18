
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AnalyticsStats {
  totalUsers: number;
  activeStudents: number;
  totalCoordinators: number;
  usersByRole: {
    student: number;
    coordinator: number;
    admin: number;
  };
}

export const useAdminAnalytics = () => {
  const [stats, setStats] = useState<AnalyticsStats>({
    totalUsers: 0,
    activeStudents: 0,
    totalCoordinators: 0,
    usersByRole: {
      student: 0,
      coordinator: 0,
      admin: 0
    }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        
        // Get total users count
        const { count: totalUsers, error: countError } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
        
        if (countError) throw countError;
        
        // Get active students count
        const { count: activeStudents, error: studentsError } = await supabase
          .from('students')
          .select('*', { count: 'exact', head: true })
          .eq('status', 'active');
          
        if (studentsError) throw studentsError;
        
        // Get coordinators count
        const { count: totalCoordinators, error: coordError } = await supabase
          .from('coordinators')
          .select('*', { count: 'exact', head: true });
          
        if (coordError) throw coordError;
        
        // Get user role distribution
        const { data: roleData, error: roleError } = await supabase
          .from('profiles')
          .select('role');
          
        if (roleError) throw roleError;
        
        // Count roles
        const usersByRole = {
          student: 0,
          coordinator: 0,
          admin: 0
        };
        
        roleData?.forEach(user => {
          if (user.role === 'student') usersByRole.student++;
          else if (user.role === 'coordinator') usersByRole.coordinator++;
          else if (user.role === 'admin') usersByRole.admin++;
        });
        
        setStats({
          totalUsers: totalUsers || 0,
          activeStudents: activeStudents || 0,
          totalCoordinators: totalCoordinators || 0,
          usersByRole
        });
        
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    fetchAnalytics();
  }, []);
  
  return {
    stats,
    loading,
    error
  };
};
