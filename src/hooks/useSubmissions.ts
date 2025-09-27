
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { submissionsService } from '@/services/submissions.service';
import { toast } from 'sonner';

export function useSubmissionById(submissionId: string | undefined) {
  return useQuery({
    queryKey: ['submission', submissionId],
    queryFn: () => submissionId ? submissionsService.getSubmissionById(submissionId) : null,
    enabled: !!submissionId
  });
}

export function useStudentSubmissions(studentId: string | undefined) {
  return useQuery({
    queryKey: ['submissions', 'student', studentId],
    queryFn: () => studentId ? submissionsService.getStudentSubmissions(studentId) : [],
    enabled: !!studentId
  });
}

export function useAllSubmissions() {
  return useQuery({
    queryKey: ['submissions', 'all'],
    queryFn: () => submissionsService.getAllSubmissions()
  });
}

export function useSaveSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      studentId, 
      phaseId, 
      formData, 
      status 
    }: { 
      studentId: string; 
      phaseId: string; 
      formData: any; 
      status?: 'draft' | 'submitted' 
    }) => submissionsService.saveSubmission(studentId, phaseId, formData, status),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['submissions', 'student', variables.studentId] });
      queryClient.invalidateQueries({ queryKey: ['submissions', 'all'] });
      
      const message = variables.status === 'submitted' 
        ? 'Form submitted successfully' 
        : 'Draft saved successfully';
      
      toast.success(message);
      return data;
    },
    onError: (error: Error) => {
      console.error('Error saving submission:', error);
      toast.error('Failed to save submission');
    }
  });
}

export function useUpdateSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      submissionId, 
      formData, 
      status 
    }: { 
      submissionId: string; 
      formData: any; 
      status?: 'draft' | 'submitted' 
    }) => submissionsService.updateSubmission(submissionId, formData, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission', data.id] });
      
      const message = data.status === 'submitted' 
        ? 'Form updated and submitted successfully' 
        : 'Draft updated successfully';
      
      toast.success(message);
      return data;
    },
    onError: (error: Error) => {
      console.error('Error updating submission:', error);
      toast.error('Failed to update submission');
    }
  });
}

export function useReviewSubmission() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ 
      submissionId, 
      reviewerId, 
      status 
    }: { 
      submissionId: string; 
      reviewerId: string; 
      status: 'reviewed' | 'approved' 
    }) => submissionsService.reviewSubmission(submissionId, reviewerId, status),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['submissions'] });
      queryClient.invalidateQueries({ queryKey: ['submission', data.id] });
      
      const message = data.status === 'approved' 
        ? 'Submission approved successfully' 
        : 'Submission reviewed successfully';
      
      toast.success(message);
    },
    onError: (error: Error) => {
      console.error('Error reviewing submission:', error);
      toast.error('Failed to review submission');
    }
  });
}
