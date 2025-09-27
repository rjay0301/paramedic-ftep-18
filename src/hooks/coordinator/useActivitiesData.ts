
import { useState, useEffect, useCallback } from 'react';
import { RecentActivity } from '@/types/coordinator';
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;

export const useActivitiesData = (userId: string | undefined, userRole: string | undefined, refreshCounter = 0) => {
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchActivities = useCallback(async () => {
    if (!userId || userRole !== 'coordinator') return;

    try {
      setIsLoading(true);
      
      // Fetch recent form submissions as activities
      const { data: submissions, error } = await sb
        .from('assignments')
        .select(`
          id,
          student_id,
          assignment_number,
          submitted_at,
          students:student_id (full_name)
        `)
        .eq('status', 'submitted')
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('Error fetching activities:', error);
        return;
      }

      // Map submissions to RecentActivity format with proper type handling
      const activities: RecentActivity[] = submissions.map(submission => {
        // Handle the students data properly, as it's returned as an object by Supabase
        let studentName = 'Unknown Student';
        if (submission.students && typeof submission.students === 'object') {
          if ('full_name' in submission.students) {
            studentName = String(submission.students.full_name || 'Unknown Student');
          }
        }
        
        const formType = 'assignment';
        const formattedDate = new Date(submission.submitted_at).toLocaleString();
        
        // Assign colors based on form type
        const color = 'green';
        
        return {
          id: submission.id,
          description: `${studentName} submitted ${formType} #${submission.assignment_number}`,
          timestamp: formattedDate,
          color
        };
      });

      setRecentActivities(activities);
    } catch (error) {
      console.error('Error in fetchActivities:', error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, userRole]);

  // Fetch activities when refreshCounter changes
  useEffect(() => {
    fetchActivities();
  }, [fetchActivities, refreshCounter]);

  return { 
    recentActivities, 
    isLoading,
    refreshActivities: fetchActivities 
  };
};
