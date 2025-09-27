
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { AddendumForm, AddendumFormType } from '@/types/addendum';
import { FormDataValue } from '@/types/forms';  // Add this import
import { saveAddendumForm, getAddendumForm, deleteAddendumForm } from '@/services/addendumService';
import { supabase } from '@/integrations/supabase/client';

export function useAddendumForm(studentId: string, formType: AddendumFormType) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: form, isLoading } = useQuery({
    queryKey: ['addendumForm', studentId, formType],
    queryFn: () => getAddendumForm(studentId, formType),
    enabled: !!studentId, // Only run query if studentId exists
  });

  // Check if form already exists with submitted status
  const { data: formStatus } = useQuery({
    queryKey: ['addendumFormStatus', studentId, formType],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('addendum_forms')
        .select('status')
        .eq('student_id', studentId)
        .eq('form_type', formType)
        .maybeSingle();
        
      if (error) {
        console.error('Error checking form status:', error);
        return null;
      }
      return data?.status;
    },
    enabled: !!studentId,
  });

  const saveMutation = useMutation({
    mutationFn: async ({
      content,
      status,
      submittedAt
    }: {
      content: Record<string, FormDataValue>;
      status: 'draft' | 'submitted';
      submittedAt?: string;
    }) => {
      // Check if form is already submitted to prevent duplicate submissions
      if (status === 'submitted' && formStatus === 'submitted') {
        toast.error('This form has already been submitted');
        return null;
      }
      
      setIsSubmitting(true);
      try {
        const result = await saveAddendumForm(studentId, formType, content, status, submittedAt);
        if (result.error) throw result.error;
        
        // If successfully submitted, update progress
        if (status === 'submitted' && !result.error) {
          await updateProgressAfterSubmission(studentId, formType);
        }
        
        return result.data;
      } finally {
        setIsSubmitting(false);
      }
    },
    onSuccess: (data) => {
      if (data) {
        queryClient.invalidateQueries({ queryKey: ['addendumForm', studentId, formType] });
        queryClient.invalidateQueries({ queryKey: ['addendumFormStatus', studentId, formType] });
        toast.success(data.status === 'draft' ? 'Draft saved' : 'Form submitted successfully');
      }
    },
    onError: (error) => {
      console.error('Error saving addendum form:', error);
      toast.error('Failed to save form: ' + (error.message || 'Unknown error'));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteAddendumForm(studentId, formType),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addendumForm', studentId, formType] });
      queryClient.invalidateQueries({ queryKey: ['addendumFormStatus', studentId, formType] });
      toast.success('Form deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting addendum form:', error);
      toast.error('Failed to delete form: ' + (error.message || 'Unknown error'));
    },
  });

  // Helper function to update student progress after form submission
  const updateProgressAfterSubmission = async (studentId: string, formType: AddendumFormType) => {
    try {
      let phaseName: string;
      
      // Map addendum form type to corresponding phase name
      switch (formType) {
        case 'instructional-copy':
          phaseName = 'instructional';
          break;
        case 'instructional-evaluation-copy':
          phaseName = 'instructional_evaluation';
          break;
        case 'independent-copy':
          phaseName = 'independent';
          break;
        case 'independent-evaluation-copy':
          phaseName = 'independent_evaluation';
          break;
        case 'final-evaluation-copy':
          phaseName = 'final_evaluation';
          break;
        default:
          console.error('Unknown addendum form type:', formType);
          return;
      }
      
      // Count all submitted addendum forms for the phase
      const { data: addendumForms, error: countError } = await supabase
        .from('addendum_forms')
        .select('id')
        .eq('student_id', studentId)
        .eq('form_type', formType)
        .eq('status', 'submitted');
      
      if (countError) {
        console.error(`Error counting addendum forms for ${formType}:`, countError);
        return;
      }
      
      const addendumCount = addendumForms?.length || 0;
      
      // Get current phase progress
      const { data: phaseProgress, error: phaseError } = await supabase
        .from('student_phase_progress')
        .select('completed_items, total_items')
        .eq('student_id', studentId)
        .eq('phase_name', phaseName)
        .single();
      
      if (phaseError) {
        console.error(`Error getting phase progress for ${phaseName}:`, phaseError);
        return;
      }
      
      if (!phaseProgress) {
        console.error(`No phase progress found for ${phaseName}`);
        return;
      }
      
      // Update phase progress with addendum forms
      const totalCompleted = (phaseProgress.completed_items || 0) + addendumCount;
      const completionPercentage = Math.min(
        Math.round((totalCompleted / phaseProgress.total_items) * 100), 
        100
      );
      
      // Update the phase progress
      const { error: updateError } = await supabase
        .from('student_phase_progress')
        .update({
          completed_items: totalCompleted,
          completion_percentage: completionPercentage,
          is_complete: completionPercentage >= 100
        })
        .eq('student_id', studentId)
        .eq('phase_name', phaseName);
      
      if (updateError) {
        console.error(`Error updating progress for phase ${phaseName}:`, updateError);
        return;
      }
      
      // Update overall progress
      await updateOverallProgress(studentId);
      
    } catch (error) {
      console.error('Error updating progress after addendum submission:', error);
    }
  };

  // Helper function to update overall progress
  const updateOverallProgress = async (studentId: string) => {
    try {
      // Get all phase progress for the student
      const { data: phases, error: phasesError } = await supabase
        .from('student_phase_progress')
        .select('phase_name, completed_items, total_items, is_complete')
        .eq('student_id', studentId);
      
      if (phasesError) {
        console.error('Error fetching phase progress:', phasesError);
        return;
      }
      
      if (!phases || phases.length === 0) {
        console.error('No phases found for student:', studentId);
        return;
      }
      
      // Calculate total completed forms and phases
      const completedForms = phases.reduce((sum, phase) => sum + (phase.completed_items || 0), 0);
      const totalForms = phases.reduce((sum, phase) => sum + (phase.total_items || 0), 0);
      const completedPhases = phases.filter(phase => phase.is_complete).length;
      
      // Calculate overall percentage
      const overallPercentage = totalForms > 0 
        ? Math.round((completedForms / totalForms) * 100) 
        : 0;
      
      // Update overall progress
      const { error: updateError } = await supabase
        .from('student_overall_progress')
        .update({
          completed_forms: completedForms,
          completed_phases: completedPhases,
          overall_percentage: overallPercentage,
          is_complete: overallPercentage >= 100
        })
        .eq('student_id', studentId);
      
      if (updateError) {
        console.error('Error updating overall progress:', updateError);
      }
      
    } catch (error) {
      console.error('Error in updateOverallProgress:', error);
    }
  };

  return {
    form,
    formStatus,
    isLoading,
    isSubmitting,
    saveForm: saveMutation.mutate,
    deleteForm: deleteMutation.mutate,
  };
}
