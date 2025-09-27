
import { supabase } from '@/integrations/supabase/client';
import { logger } from '../utils/loggerService';

/**
 * Gets all form submissions for a student 
 * @param studentId The student ID
 * @returns Array of form submissions or empty array if error
 */
export const getStudentFormSubmissions = async (studentId: string) => {
  logger.info('Fetching form submissions for student', { studentId });
  
  try {
    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        *,
        form_revisions(*)
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) {
      logger.error('Error fetching form submissions', error, { studentId });
      return [];
    }

    logger.debug('Retrieved form submissions', { 
      studentId, 
      count: data?.length || 0 
    });
    return data || [];
  } catch (error) {
    logger.error('Exception in getStudentFormSubmissions', error, { studentId });
    return [];
  }
};

/**
 * Gets form revisions for a specific form submission
 * @param formSubmissionId The form submission ID
 * @returns Array of form revisions or empty array if error
 */
export const getFormRevisions = async (formSubmissionId: string) => {
  logger.info('Fetching form revisions', { formSubmissionId });
  
  try {
    const { data, error } = await supabase
      .from('form_revisions')
      .select('*')
      .eq('form_submission_id', formSubmissionId)
      .order('revision_number', { ascending: true });

    if (error) {
      logger.error('Error fetching form revisions', error, { formSubmissionId });
      return [];
    }

    logger.debug('Retrieved form revisions', { 
      formSubmissionId, 
      count: data?.length || 0 
    });
    return data || [];
  } catch (error) {
    logger.error('Exception in getFormRevisions', error, { formSubmissionId });
    return [];
  }
};
