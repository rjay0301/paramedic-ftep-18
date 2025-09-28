
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { logger } from '../utils/loggerService';

/**
 * Recalculates progress for all students
 * @returns Success status
 */
export const recalculateAllStudentProgress = async (): Promise<boolean> => {
  try {
    logger.info('Starting recalculation of progress for all students');
    
    // Get all students
  const { data: students, error: studentsError } = await sb
    .from('students')
    .select('profile_id');
      
    if (studentsError) {
      logger.error('Error fetching students for progress recalculation', studentsError);
      return false;
    }
    
    if (!students || students.length === 0) {
      logger.info('No students found for progress recalculation');
      return true;
    }
    
    // Call update for each student
    const updatePromises = students.map(student => 
      updateStudentProgressInDbOnly(student.profile_id)
    );
    
    await Promise.all(updatePromises);
    
    logger.info(`Recalculated progress for ${students.length} students`);
    return true;
  } catch (error) {
    logger.error('Error in recalculateAllStudentProgress', error);
    return false;
  }
};

/**
 * Updates student progress directly in the database without triggering events
 * @param studentId The student ID
 */
async function updateStudentProgressInDbOnly(studentId: string): Promise<boolean> {
  try {
    // Get all submitted form submissions
  const { data: submissions, error: submissionsError } = await sb
    .from('form_submissions')
    .select('form_type, form_number')
    .eq('student_id', studentId)
    .eq('status', 'submitted');
      
    if (submissionsError) {
      logger.error('Error fetching submissions for progress recalculation', submissionsError, { studentId });
      return false;
    }
    
    // Count total forms (assuming we have a predefined total)
    const totalForms = 74; // Replace with actual calculation or config value
    const completedForms = submissions?.length || 0;
    const percentage = totalForms > 0 ? Math.round((completedForms / totalForms) * 100) : 0;
    
    // Update the student's progress in student_progress
  const { error: updateError } = await sb
    .from('student_progress')
    .upsert({
      student_id: studentId,
      completed_forms: completedForms,
      total_forms: totalForms,
      percentage: percentage,
      updated_at: new Date().toISOString()
    });
      
    if (updateError) {
      logger.error('Error updating student_progress', updateError, { studentId });
      return false;
    }
    
    return true;
  } catch (error) {
    logger.error('Error in updateStudentProgressInDbOnly', error, { studentId });
    return false;
  }
}
