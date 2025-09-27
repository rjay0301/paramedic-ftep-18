
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/services/form/utils/loggerService';
const sb = supabase as any;

/**
 * Updates form submission in the database
 */
export const updateFormSubmission = async (
  studentId: string, 
  assignmentId: string, 
  assignmentNumber: number
) => {
  logger.debug('Updating form submission entry', { 
    studentId, 
    assignmentId, 
    assignmentNumber 
  });
  
  const response = await sb
    .from('assignments')
    .update({
      status: 'submitted',
      submitted_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('id', assignmentId);
    
  if (response.error) {
    logger.error('Error updating form submission entry', response.error, { 
      studentId, 
      assignmentId 
    });
  } else {
    logger.debug('Form submission entry updated successfully', { 
      studentId, 
      assignmentId 
    });
  }
};

/**
 * Helper function to get the existing submitted assignments
 */
export const getCurrentSubmittedAssignments = async (studentId: string): Promise<string[]> => {
  try {
    logger.debug('Fetching current submitted assignments', { studentId });
    
    const { data, error } = await supabase
      .from('assignments')
      .select('assignment_number')
      .eq('student_id', studentId)
      .eq('status', 'submitted');
      
    if (error) {
      logger.error('Error fetching submitted assignments', error, { studentId });
      return [];
    }
    
    const assignments = (data || []).map(item => `assignment${item.assignment_number}`);
    logger.debug('Retrieved submitted assignments', { 
      studentId, 
      count: assignments.length 
    });
    
    return assignments;
  } catch (error) {
    logger.error('Error in getCurrentSubmittedAssignments', error, { studentId });
    return [];
  }
};
