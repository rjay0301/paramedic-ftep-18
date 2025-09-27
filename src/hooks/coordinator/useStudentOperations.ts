
import { useState } from 'react';
import { Student } from '@/types/coordinator';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { generatePhasePdf } from '@/services/pdf';
import { recalculateAllStudentProgress, updateStudentProgress } from '@/services/form/progressUpdateService';

export const useStudentOperations = (
  students: Student[],
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>
) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSaveStudentChanges = async (updatedStudent: Student) => {
    setIsLoading(true);
    
    try {
      // Update student in Supabase
      const { error } = await supabase
        .from('students')
        .update({
          alpha_unit_text: updatedStudent.alphaUnit,
          hub_name: updatedStudent.hub,
          ftp_name: updatedStudent.ftpName,
          ftp_contact: updatedStudent.ftpContact
        })
        .eq('id', updatedStudent.id);
      
      if (error) {
        throw error;
      }
      
      // Update local state
      setStudents(prevStudents => 
        prevStudents.map(student => 
          student.id === updatedStudent.id ? updatedStudent : student
        )
      );
      
      toast({
        title: "Success",
        description: "Student information updated successfully."
      });

      return true;
    } catch (error) {
      console.error('Error updating student:', error);
      toast({
        title: "Error",
        description: "Failed to update student information.",
        variant: "destructive"
      });
      
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGeneratePdf = async (studentId?: string) => {
    // This is kept for backward compatibility, but we'll use our new PDF service
    if (studentId) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        try {
          setIsLoading(true);
          toast({
            title: "PDF Generation",
            description: "PDF report is being generated and will download shortly."
          });
          
          // Generate a complete workbook PDF
          await generatePhasePdf(student, 'complete');
          
          toast({
            title: "PDF Generated",
            description: "Your PDF has been downloaded."
          });
        } catch (error) {
          console.error('Error generating PDF:', error);
          toast({
            title: "Error",
            description: "Failed to generate PDF.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    } else {
      toast({
        title: "PDF Generation",
        description: "Please select a specific phase to generate a PDF for."
      });
    }
  };

  const handleEditProfile = (studentId: string) => {
    toast({
      title: "Edit Profile",
      description: "Profile editing functionality would open here."
    });
  };
  
  const handleRecalculateProgress = async (studentId?: string) => {
    try {
      setIsLoading(true);
      toast({
        title: "Recalculating Progress",
        description: studentId 
          ? "Recalculating progress for the student..." 
          : "Recalculating progress for all students..."
      });
      
      if (studentId) {
        // Recalculate for specific student
        await updateStudentProgress(studentId);
        
        // Refresh student data
        const { data, error } = await supabase
          .from('student_overall_progress')
          .select('*')
          .eq('student_id', studentId)
          .single();
          
        if (data && !error) {
          // Update local state
          setStudents(prevStudents => 
            prevStudents.map(student => 
              student.id === studentId 
                ? { 
                    ...student, 
                    progress: data.overall_percentage || 0,
                    phase: getPhaseFromProgress(data.overall_percentage || 0)
                  } 
                : student
            )
          );
        }
      } else {
        // Recalculate for all students
        await recalculateAllStudentProgress();
        
        // We need to refetch all students to get updated progress
        // This is handled by the useStudentsData hook which should reload
      }
      
      toast({
        title: "Success",
        description: "Progress recalculated successfully."
      });
    } catch (error) {
      console.error('Error recalculating progress:', error);
      toast({
        title: "Error",
        description: "Failed to recalculate progress.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper to map progress percentage to phase name
  const getPhaseFromProgress = (progressPercentage: number): string => {
    if (progressPercentage >= 90) return 'Final Evaluation';
    if (progressPercentage >= 75) return 'Independent Phase';
    if (progressPercentage >= 50) return 'Instructional Phase';
    if (progressPercentage >= 25) return 'Observational Phase';
    if (progressPercentage > 0) return 'Rural Ambulance';
    return 'Not Started';
  };

  return {
    isLoading,
    handleSaveStudentChanges,
    handleGeneratePdf,
    handleEditProfile,
    handleRecalculateProgress
  };
};
