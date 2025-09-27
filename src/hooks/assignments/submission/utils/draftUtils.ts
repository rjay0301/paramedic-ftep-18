
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/form/utils/loggerService';

/**
 * Helper function to check if an assignment draft exists
 * @param studentId The student ID
 * @param assignmentNumber The assignment number
 * @returns True if a draft exists, false otherwise
 */
export const checkAssignmentDraftExists = async (
  studentId: string, 
  assignmentNumber: number
): Promise<{ exists: boolean, id?: string }> => {
  try {
    logger.debug('Checking if assignment draft exists', { 
      studentId, 
      assignmentNumber 
    });
    
    const { data, error } = await supabase
      .from('assignments')
      .select('id')
      .eq('student_id', studentId)
      .eq('assignment_number', assignmentNumber)
      .eq('status', 'draft')
      .maybeSingle();
      
    if (error && error.code !== 'PGRST116') {
      logger.error('Error checking assignment draft existence', error, { 
        studentId, 
        assignmentNumber 
      });
      return { exists: false };
    }
    
    logger.debug('Assignment draft existence check complete', { 
      exists: !!data, 
      id: data?.id 
    });
    
    return { 
      exists: !!data, 
      id: data?.id 
    };
  } catch (error) {
    logger.error('Unexpected error in checkAssignmentDraftExists', error, { 
      studentId, 
      assignmentNumber 
    });
    return { exists: false };
  }
};

/**
 * Helper function to get all assignment drafts for a student
 * @param studentId The student ID
 * @returns An array of assignment numbers that have drafts
 */
export const getStudentAssignmentDrafts = async (studentId: string): Promise<number[]> => {
  try {
    logger.debug('Fetching student assignment drafts', { studentId });
    
    const { data, error } = await supabase
      .from('assignments')
      .select('assignment_number')
      .eq('student_id', studentId)
      .eq('status', 'draft');
      
    if (error) {
      logger.error('Error fetching assignment drafts', error, { studentId });
      return [];
    }
    
    const draftAssignments = (data || []).map(item => item.assignment_number);
    
    logger.debug('Retrieved assignment drafts', { 
      studentId, 
      count: draftAssignments.length 
    });
    
    return draftAssignments;
  } catch (error) {
    logger.error('Unexpected error in getStudentAssignmentDrafts', error, { studentId });
    return [];
  }
};
