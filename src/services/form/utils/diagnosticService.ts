
import { supabase } from '@/integrations/supabase/client';
import { logger } from './loggerService';

export const diagnosticService = {
  async runDiagnostic(studentId: string) {
    logger.info('Running diagnostic for student', { studentId });
    
    try {
      // 1. Check user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', studentId)
        .maybeSingle();
      
      if (profileError && profileError.code !== 'PGRST116') {
        logger.error('Error fetching profile', profileError);
      }
      
      // 2. Check form submissions
      const { data: submissions, error: submissionsError } = await supabase
        .from('form_submissions')
        .select('*')
        .eq('student_id', studentId);
      
      if (submissionsError) {
        logger.error('Error fetching form submissions', submissionsError);
      }
      
      // Count submitted forms
      const submittedForms = submissions?.filter(s => s.status === 'submitted') || [];
      
      // 3. Check overall progress
      const { data: overallProgress, error: progressError } = await supabase
        .from('student_overall_progress')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();
      
      if (progressError && progressError.code !== 'PGRST116') {
        logger.error('Error fetching overall progress', progressError);
      }
      
      // 4. Check phase progress
      const { data: phaseProgress, error: phaseError } = await supabase
        .from('student_phase_progress')
        .select('*')
        .eq('student_id', studentId);
      
      if (phaseError) {
        logger.error('Error fetching phase progress', phaseError);
      }

      // Prepare issues list
      const inconsistencies = [];

      // Only check for profile/progress issues if we're connected to the backend
      // and expect to have this data
      if (!profile) {
        inconsistencies.push("User profile not found");
      }

      if (!overallProgress) {
        inconsistencies.push("Missing overall progress record");
      } else if (submittedForms.length > 0 && overallProgress.completed_forms !== submittedForms.length) {
        inconsistencies.push(`Overall progress shows ${overallProgress.completed_forms} completed forms, but there are ${submittedForms.length} submitted forms`);
      }

      // Add validation results to the response object
      const validationResult = inconsistencies.length > 0 ? { inconsistencies } : null;
      const overallStatus = inconsistencies.length > 0 ? 'ERROR' : 'OK';

      return {
        success: true,
        profileExists: !!profile,
        submissionCount: submissions?.length || 0,
        submittedFormCount: submittedForms.length,
        overallProgressExists: !!overallProgress,
        phaseProgressCount: phaseProgress?.length || 0,
        validationResult,
        overallStatus,
        data: {
          profile,
          submissions,
          overallProgress,
          phaseProgress
        }
      };
    } catch (error) {
      logger.error('Diagnostic error', error);
      return {
        success: false,
        error,
        validationResult: { inconsistencies: ["Diagnostic process failed"] },
        overallStatus: 'ERROR'
      };
    }
  },
  
  async fixProgressData(studentId: string) {
    logger.info('Attempting to fix progress data', { studentId });
    return await this.recalculateAllProgress(studentId);
  },
  
  async recalculateAllProgress(studentId: string) {
    try {
      logger.info('Recalculating all progress for student', { studentId });
      
      // Get the progress service
      const { progressService } = await import('../progressUpdateService');
      
      // Update progress
      await progressService.updateStudentProgress(studentId);
      
      return {
        success: true,
        message: 'Student progress recalculated successfully'
      };
    } catch (error) {
      logger.error('Error recalculating progress', error);
      return {
        success: false,
        error
      };
    }
  },

  async forceProgressRecalculation(studentId: string) {
    try {
      logger.info('Force recalculating progress for student', { studentId });
      
      // Get the progress service
      const { progressService } = await import('../progressUpdateService');
      
      // Force update progress
      await progressService.updateStudentProgress(studentId);
      
      return {
        success: true,
        message: 'Progress recalculation forced successfully'
      };
    } catch (error) {
      logger.error('Error forcing progress recalculation', error);
      return {
        success: false,
        error
      };
    }
  }
};
