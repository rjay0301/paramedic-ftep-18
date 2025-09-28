
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { logger } from './loggerService';
import { phaseFormCounts, formTypeToPhase } from '../constants/phaseConstants';

/**
 * Service for diagnosing and fixing issues with progress tracking
 */
export const progressDiagnosticService = {
  async runDiagnostic(studentId: string) {
    logger.info('Running progress diagnostic for student', { studentId });
    
    try {
      // 1. Check form submissions
      const { data: submissions, error: submissionsError } = await sb
        .from('form_submissions')
        .select('*')
        .eq('student_id', studentId);
      
      if (submissionsError) {
        logger.error('Error fetching form submissions', submissionsError);
        return {
          success: false,
          error: 'Failed to fetch form submissions',
          details: submissionsError
        };
      }
      
      // 2. Get phase progress
      const { data: phaseProgress, error: phaseError } = await sb
        .from('student_phase_progress')
        .select('*')
        .eq('student_id', studentId);
      
      if (phaseError) {
        logger.error('Error fetching phase progress', phaseError);
        return {
          success: false,
          error: 'Failed to fetch phase progress',
          details: phaseError
        };
      }
      
      // 3. Get overall progress
      const { data: overallProgress, error: progressError } = await sb
        .from('student_overall_progress')
        .select('*')
        .eq('student_id', studentId)
        .maybeSingle();
      
      if (progressError) {
        logger.error('Error fetching overall progress', progressError);
        return {
          success: false,
          error: 'Failed to fetch overall progress',
          details: progressError
        };
      }
      
      // Check for inconsistencies
      const submittedForms = submissions?.filter(sub => sub.status === 'submitted') || [];
      logger.debug(`Found ${submittedForms.length} submitted forms`);
      
      // Group submissions by form type
      const submissionsByType: Record<string, any[]> = {};
      submittedForms.forEach(sub => {
        if (!submissionsByType[sub.form_type]) {
          submissionsByType[sub.form_type] = [];
        }
        submissionsByType[sub.form_type].push(sub);
      });
      
      // Check against phase progress records
      const phaseProgressMap: Record<string, any> = {};
      phaseProgress?.forEach(phase => {
        phaseProgressMap[phase.phase_name] = phase;
      });
      
      const inconsistencies = [];
      
      // Check each expected phase
      Object.entries(phaseFormCounts).forEach(([phase, expectedCount]) => {
        const phaseRecord = phaseProgressMap[phase];
        
        // Find related form types for this phase
        const formTypes = Object.entries(formTypeToPhase)
          .filter(([_, p]) => p === phase)
          .map(([type]) => type);
        
        // Count submitted forms for this phase
        let actualCount = 0;
        formTypes.forEach(type => {
          actualCount += submissionsByType[type]?.length || 0;
        });
        
        // Detect inconsistencies
        if (!phaseRecord) {
          inconsistencies.push(`Missing phase progress record for ${phase}`);
        } else if (phaseRecord.completed_items !== actualCount) {
          inconsistencies.push(`Phase ${phase} shows ${phaseRecord.completed_items} completed items, but has ${actualCount} submitted forms`);
        }
      });
      
      // Check overall progress
      if (overallProgress) {
        const totalSubmitted = submittedForms.length;
        if (overallProgress.completed_forms !== totalSubmitted) {
          inconsistencies.push(`Overall progress shows ${overallProgress.completed_forms} completed forms, but there are ${totalSubmitted} submitted forms`);
        }
      } else {
        inconsistencies.push('Missing overall progress record');
      }
      
      return {
        success: true,
        data: {
          submissions: submittedForms,
          phaseProgress: phaseProgress || [],
          overallProgress: overallProgress,
          submissionsByType: submissionsByType,
          inconsistencies: inconsistencies
        }
      };
    } catch (error) {
      logger.error('Error during progress diagnostic', error);
      return {
        success: false,
        error: 'Diagnostic failed',
        details: error
      };
    }
  },
  
  async fixProgressIssues(studentId: string) {
    logger.info('Attempting to fix progress issues for student', { studentId });
    
    try {
      // First run a diagnostic
      const diagnostic = await this.runDiagnostic(studentId);
      
      if (!diagnostic.success) {
        return {
          success: false,
          error: 'Diagnostic failed before fix attempt',
          details: diagnostic.error
        };
      }
      
      // Get all form submissions for this student
      const { data: submissions, error: submissionsError } = await sb
        .from('form_submissions')
        .select('id, form_type, form_number, status, submitted_at')
        .eq('student_id', studentId);
    
      if (submissionsError) {
        logger.error('Error fetching submissions for progress fix', submissionsError);
        return {
          success: false,
          error: 'Failed to fetch submissions',
          details: submissionsError
        };
      }
      
      // Process submissions by phase
      const submittedForms = submissions?.filter(sub => sub.status === 'submitted') || [];
      logger.debug(`Found ${submittedForms.length} submitted forms for progress fix`);
      
      // Create phase tracking objects
      const phaseCounters: Record<string, Set<number>> = {};
      
      // Initialize counter sets for each phase 
      Object.keys(phaseFormCounts).forEach(phase => {
        phaseCounters[phase] = new Set<number>();
      });
      
      // Count submitted forms for each phase 
      for (const submission of submittedForms) {
        const phase = formTypeToPhase[submission.form_type];
        
        if (!phase) {
          logger.warn(`Unknown form type: ${submission.form_type}`, { submission });
          continue;
        }
        
        // Add form number to the set (prevents duplicate counting)
        phaseCounters[phase].add(submission.form_number);
      }
      
      // Calculate phase completion and total forms
      let totalCompletedForms = 0;
      const completedPhases = [];
      
      // Update phase progress for each phase
      for (const phase of Object.keys(phaseFormCounts)) {
        const completedItems = phaseCounters[phase]?.size || 0;
        const totalItems = phaseFormCounts[phase];
        
        totalCompletedForms += completedItems;
        
        if (completedItems >= totalItems) {
          completedPhases.push(phase);
        }
        
        // Update phase progress
        const completionPercentage = Math.round((completedItems / totalItems) * 100);
        const isComplete = completedItems >= totalItems;
        
        const { error: phaseUpdateError } = await sb
          .from('student_phase_progress')
          .upsert({
            student_id: studentId,
            phase_name: phase,
            total_items: totalItems,
            completed_items: completedItems,
            is_complete: isComplete,
            completion_percentage: completionPercentage,
            updated_at: new Date().toISOString()
          }, { 
            onConflict: 'student_id,phase_name' 
          });
          
        if (phaseUpdateError) {
          logger.error(`Error updating phase ${phase} during fix:`, phaseUpdateError);
          return {
            success: false,
            error: `Failed to update phase ${phase} progress`,
            details: phaseUpdateError
          };
        }
      }
      
      // Ensure the total form count is accurate
      const totalFormCount = Object.values(phaseFormCounts).reduce((a, b) => a + b, 0);
      
      // Update overall progress
      const overallPercentage = Math.round((totalCompletedForms / totalFormCount) * 100);
      const { error: overallUpdateError } = await sb
        .from('student_overall_progress')
        .upsert({
          student_id: studentId,
          completed_forms: totalCompletedForms,
          completed_phases: completedPhases.length,
          total_forms: totalFormCount,
          total_phases: Object.keys(phaseFormCounts).length,
          overall_percentage: overallPercentage,
          is_complete: totalCompletedForms >= totalFormCount,
          updated_at: new Date().toISOString()
        }, { 
          onConflict: 'student_id' 
        });
        
      if (overallUpdateError) {
        logger.error('Error updating overall progress during fix:', overallUpdateError);
        return {
          success: false,
          error: 'Failed to update overall progress',
          details: overallUpdateError
        };
      }
      
      // Run diagnostic again to verify fixes
      const postFixDiagnostic = await this.runDiagnostic(studentId);
      
      return {
        success: true,
        fixedIssues: diagnostic.data?.inconsistencies || [],
        remainingIssues: postFixDiagnostic.success ? postFixDiagnostic.data?.inconsistencies || [] : [],
        overallProgress: {
          completed: totalCompletedForms,
          total: totalFormCount,
          percentage: overallPercentage
        }
      };
    } catch (error) {
      logger.error('Error during progress fix operation', error);
      return {
        success: false,
        error: 'Fix operation failed',
        details: error
      };
    }
  }
};
