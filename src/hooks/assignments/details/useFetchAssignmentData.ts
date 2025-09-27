
import { useState } from 'react';
import { toast } from 'sonner';
import { useStudentId } from '@/hooks/assignments/useStudentId';
import { logger } from '@/services/form/utils/loggerService';
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;

export const useFetchAssignmentData = () => {
  const { getStudentId } = useStudentId();
  
  const fetchAssignmentData = async (assignmentKey: string | undefined, setAssignments: any, setSubmittedAssignments: any) => {
    if (!assignmentKey) return;
    
    const studentId = await getStudentId();
    if (!studentId) {
      toast.error('Could not retrieve student information.');
      return;
    }

    const assignmentNumber = parseInt(assignmentKey.replace('assignment', ''));
    
    // Check if assignment exists
    const { data: existingAssignment, error: fetchError } = await sb
      .from('assignments')
      .select('content, status')
      .eq('student_id', studentId)
      .eq('assignment_number', assignmentNumber)
      .maybeSingle();
    
    if (fetchError) {
      logger.error('Error fetching assignment', fetchError);
      return;
    }
    
    if (existingAssignment) {
      const contentValue = (existingAssignment as any)?.content?.content || '';
      
      setAssignments((prev: any) => ({
        ...prev,
        [assignmentKey]: { content: contentValue }
      }));
      
      if (existingAssignment.status === 'submitted') {
        setSubmittedAssignments(prev => [...prev, assignmentKey]);
      }
    }
  };

  return { fetchAssignmentData };
};
