
import { supabase } from '@/integrations/supabase/client';

// Define a type for student information with free text fields
export interface StudentInfo {
  id: string;
  profile_id: string;
  alpha_unit_text?: string;
  hub_id?: string;
  ftp_id?: string;
  ftp_name?: string;
  ftp_contact?: string;
  program_start_date?: string;
  status: string;
}

/**
 * Retrieves the student ID for the given profile ID
 * @param profileId The profile ID (auth.users.id) of the student
 * @returns The student ID or null if not found
 */
export const getStudentIdFromProfileId = async (profileId: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select('id')
      .eq('profile_id', profileId)
      .single();

    if (error) {
      console.error('Error fetching student ID:', error);
      return null;
    }

    return data?.id || null;
  } catch (error) {
    console.error('Error in getStudentIdFromProfileId:', error);
    return null;
  }
};

/**
 * Retrieves student information for the given student ID
 * @param studentId The student ID
 * @returns The student information or null if not found
 */
export const getStudentInfo = async (studentId: string): Promise<StudentInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .select(`
        id,
        profile_id,
        alpha_unit_text,
        hub_id,
        ftp_id,
        ftp_name,
        ftp_contact,
        program_start_date,
        status
      `)
      .eq('id', studentId)
      .single();

    if (error) {
      console.error('Error fetching student info:', error);
      return null;
    }

    return data as StudentInfo || null;
  } catch (error) {
    console.error('Error in getStudentInfo:', error);
    return null;
  }
};

/**
 * Updates student information
 * @param studentId The student ID
 * @param updates The fields to update
 * @returns The updated student information or null if error
 */
export const updateStudentInfo = async (
  studentId: string, 
  updates: Partial<Omit<StudentInfo, 'id' | 'profile_id'>>
): Promise<StudentInfo | null> => {
  try {
    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', studentId)
      .select()
      .single();

    if (error) {
      console.error('Error updating student info:', error);
      return null;
    }

    return data as StudentInfo || null;
  } catch (error) {
    console.error('Error in updateStudentInfo:', error);
    return null;
  }
};

/**
 * Saves a form draft for the given student
 * @param studentId The student ID
 * @param formType The type of form (e.g., 'instructional_case_summary')
 * @param formIdentifier A unique identifier for the form (e.g., 'summary_1')
 * @param formData The form data to save
 * @returns True if the save was successful, false otherwise
 */
export const saveFormDraft = async (
  studentId: string,
  formType: string,
  formIdentifier: string,
  formData: any
): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('form_drafts')
      .upsert({
        student_id: studentId,
        form_type: formType,
        form_identifier: formIdentifier,
        form_data: formData,
        last_saved_at: new Date().toISOString()
      }, {
        onConflict: 'student_id, form_type, form_identifier'
      });

    if (error) {
      console.error('Error saving form draft:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error in saveFormDraft:', error);
    return false;
  }
};

/**
 * Retrieves a form draft for the given student
 * @param studentId The student ID
 * @param formType The type of form (e.g., 'instructional_case_summary')
 * @param formIdentifier A unique identifier for the form (e.g., 'summary_1')
 * @returns The form data or null if not found
 */
export const getFormDraft = async (
  studentId: string,
  formType: string,
  formIdentifier: string
): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('form_drafts')
      .select('form_data, last_saved_at')
      .eq('student_id', studentId)
      .eq('form_type', formType)
      .eq('form_identifier', formIdentifier)
      .single();

    if (error) {
      console.error('Error fetching form draft:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getFormDraft:', error);
    return null;
  }
};

/**
 * Gets the overall progress for a student
 * @param studentId The student ID
 * @returns The student's overall progress or null if not found
 */
export const getStudentOverallProgress = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('student_overall_progress')
      .select('*')
      .eq('student_id', studentId)
      .single();

    if (error) {
      console.error('Error fetching student overall progress:', error);
      
      // If no progress record exists, initialize one
      if (error.code === 'PGRST116') {
        const { error: initError } = await supabase
          .from('student_overall_progress')
          .insert({
            student_id: studentId,
            total_phases: 12, // Total number of phases
            completed_phases: 0,
            total_forms: 70, // Approximate total forms
            completed_forms: 0,
            overall_percentage: 0,
            is_complete: false
          });
          
        if (initError) {
          console.error('Error initializing progress record:', initError);
        } else {
          // Try fetching again
          const { data: retryData } = await supabase
            .from('student_overall_progress')
            .select('*')
            .eq('student_id', studentId)
            .single();
            
          return retryData;
        }
      }
      
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getStudentOverallProgress:', error);
    return null;
  }
};

/**
 * Gets the phase progress for a student
 * @param studentId The student ID
 * @returns The student's phase progress or null if not found
 */
export const getStudentPhaseProgress = async (studentId: string) => {
  try {
    const { data, error } = await supabase
      .from('student_phase_progress')
      .select('*')
      .eq('student_id', studentId)
      .order('phase_name', { ascending: true });

    if (error) {
      console.error('Error fetching student phase progress:', error);
      return null;
    }

    return data || null;
  } catch (error) {
    console.error('Error in getStudentPhaseProgress:', error);
    return null;
  }
};

/**
 * Manually recalculates progress for a given student
 * @param studentId The student ID
 * @returns True if recalculation was successful
 */
export const recalculateStudentProgress = async (studentId: string): Promise<boolean> => {
  try {
    // First, trigger a recalculation by running a direct RPC call or via Edge Function
    const { error } = await supabase.rpc('recalculate_student_progress', { 
      p_student_id: studentId 
    });
    
    if (error) {
      console.error('Error in recalculate_student_progress RPC:', error);
      
      // Fallback to our client-side implementation
      const progressService = await import('./form/progressUpdateService');
      await progressService.updateStudentProgress(studentId);
    }
    
    return true;
  } catch (error) {
    console.error('Error in recalculateStudentProgress:', error);
    return false;
  }
};
