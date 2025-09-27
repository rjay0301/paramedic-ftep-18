
import { supabase } from '../integrations/supabase/client';

export const submissionsService = {
  async saveSubmission(studentId: string, phaseId: string, formData: any, status: 'draft' | 'submitted' = 'draft') {
    const { data, error } = await supabase
      .from('student_submissions')
      .insert({
        student_id: studentId,
        phase_id: phaseId,
        form_data: formData,
        status: status,
        submitted_at: status === 'submitted' ? new Date().toISOString() : null
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateSubmission(submissionId: string, formData: any, status?: 'draft' | 'submitted') {
    const updateData: any = {
      form_data: formData,
      updated_at: new Date().toISOString()
    };

    if (status) {
      updateData.status = status;
      if (status === 'submitted') {
        updateData.submitted_at = new Date().toISOString();
      }
    }

    const { data, error } = await supabase
      .from('student_submissions')
      .update(updateData)
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getSubmissionById(submissionId: string) {
    const { data, error } = await supabase
      .from('student_submissions')
      .select(`
        *,
        training_phases (
          name,
          description
        )
      `)
      .eq('id', submissionId)
      .single();

    if (error) throw error;
    return data;
  },

  async getStudentSubmissions(studentId: string) {
    const { data, error } = await supabase
      .from('student_submissions')
      .select(`
        *,
        training_phases (
          name,
          description
        )
      `)
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getAllSubmissions() {
    const { data, error } = await supabase
      .from('student_submissions')
      .select(`
        *,
        profiles!student_id (
          full_name,
          role
        ),
        training_phases (
          name,
          description
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async reviewSubmission(submissionId: string, reviewerId: string, status: 'reviewed' | 'approved') {
    const { data, error } = await supabase
      .from('student_submissions')
      .update({
        status: status,
        reviewed_at: new Date().toISOString(),
        reviewer_id: reviewerId,
        updated_at: new Date().toISOString()
      })
      .eq('id', submissionId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
