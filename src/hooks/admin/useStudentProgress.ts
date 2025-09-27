
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface StudentProgressSummary {
  id: string;
  full_name: string | null;
  email: string | null;
  completed_forms: number;
  total_forms: number;
  overall_percentage: number;
  completed_phases: number;
  total_phases: number;
}

interface PhaseProgress {
  id: string;
  student_id: string;
  phase_name: string;
  completed_items: number;
  total_items: number;
  is_complete: boolean;
  completion_percentage: number;
}

export const useStudentProgress = () => {
  const [students, setStudents] = useState<StudentProgressSummary[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [phaseProgress, setPhaseProgress] = useState<PhaseProgress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [phaseLoading, setPhaseLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStudentsProgress = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: students, error: studentsError } = await supabase
        .from('students')
        .select('id, full_name, email, profile_id');

      if (studentsError) throw studentsError;

      // Fetch progress data for each student
      const studentsWithProgress = await Promise.all(
        students.map(async (student) => {
          const { data: progress, error: progressError } = await supabase
            .from('student_overall_progress')
            .select('*')
            .eq('student_id', student.id)
            .single();

          if (progressError && progressError.code !== 'PGRST116') {
            console.error('Error fetching progress for student', student.id, progressError);
            return {
              ...student,
              completed_forms: 0,
              total_forms: 0,
              overall_percentage: 0,
              completed_phases: 0,
              total_phases: 0,
            };
          }

          return {
            ...student,
            completed_forms: progress?.completed_forms || 0,
            total_forms: progress?.total_forms || 0,
            overall_percentage: progress?.overall_percentage || 0,
            completed_phases: progress?.completed_phases || 0,
            total_phases: progress?.total_phases || 0,
          };
        })
      );

      setStudents(studentsWithProgress);
    } catch (err: any) {
      console.error('Error fetching student progress:', err);
      setError(err.message || 'Failed to fetch student progress');
      toast.error('Failed to load student progress');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStudentPhaseProgress = useCallback(async (studentId: string) => {
    if (!studentId) return;
    
    try {
      setPhaseLoading(true);
      
      const { data, error } = await supabase
        .from('student_phase_progress')
        .select('*')
        .eq('student_id', studentId);

      if (error) throw error;

      setPhaseProgress(data || []);
    } catch (err: any) {
      console.error('Error fetching phase progress:', err);
      toast.error('Failed to load phase progress details');
    } finally {
      setPhaseLoading(false);
    }
  }, []);

  const recalculateProgress = async (studentId: string) => {
    try {
      setLoading(true);
      
      // Call recalculate_student_progress function
      const { error } = await supabase.rpc('recalculate_student_progress', {
        p_student_id: studentId
      });

      if (error) throw error;
      
      toast.success('Progress recalculated successfully');
      
      // Refresh data
      await fetchStudentsProgress();
      if (selectedStudent === studentId) {
        await fetchStudentPhaseProgress(studentId);
      }
      
    } catch (err: any) {
      console.error('Error recalculating progress:', err);
      toast.error('Failed to recalculate progress');
    } finally {
      setLoading(false);
    }
  };

  // Load students progress when component mounts
  useEffect(() => {
    fetchStudentsProgress();
  }, [fetchStudentsProgress]);

  // Load phase progress when selected student changes
  useEffect(() => {
    if (selectedStudent) {
      fetchStudentPhaseProgress(selectedStudent);
    } else {
      setPhaseProgress([]);
    }
  }, [selectedStudent, fetchStudentPhaseProgress]);

  return {
    students,
    selectedStudent,
    setSelectedStudent,
    phaseProgress,
    loading,
    phaseLoading,
    error,
    refreshProgress: fetchStudentsProgress,
    recalculateProgress
  };
};
