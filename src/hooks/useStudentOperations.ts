
import { useState } from 'react';
import { Student } from '@/types/coordinator';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { PhaseType, generatePhasePdf, generateFormPdf } from '@/services/pdf';
import { updateStudentProgress } from '@/services/form/progressUpdateService';

export const useStudentOperations = (
  students: Student[], 
  setStudents: React.Dispatch<React.SetStateAction<Student[]>>
) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  // Save changes to student info
  const handleSaveStudentChanges = async (student: Student): Promise<boolean> => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      });
      return false;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('students')
        .update({
          alpha_unit_text: student.alphaUnit,
          ftp_name: student.ftpName,
          ftp_contact: student.ftpContact,
          updated_at: new Date().toISOString()
        })
        .eq('id', student.id);

      if (error) {
        console.error('Error updating student:', error);
        toast({
          title: "Update Failed",
          description: error.message,
          variant: "destructive"
        });
        return false;
      }

      // Update local state
      setStudents(prev => 
        prev.map(s => 
          s.id === student.id 
            ? { 
                ...s, 
                alphaUnit: student.alphaUnit,
                ftpName: student.ftpName,
                ftpContact: student.ftpContact,
                lastUpdated: new Date().toLocaleDateString()
              } 
            : s
        )
      );

      toast({
        title: "Student Updated",
        description: "Student information has been updated successfully."
      });
      
      return true;
    } catch (error: any) {
      console.error('Error in handleSaveStudentChanges:', error);
      toast({
        title: "Update Failed",
        description: error.message || "An unexpected error occurred",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Generate PDF for a phase or form
  const handleGeneratePdf = async (type: 'phase' | 'form', id: string, phaseType?: PhaseType) => {
    setIsLoading(true);
    
    try {
      if (type === 'phase' && phaseType) {
        // Find the student from the ID
        const student = students.find(s => s.id === id);
        if (!student) {
          throw new Error(`Student with ID ${id} not found`);
        }
        await generatePhasePdf(student, phaseType);
      } else if (type === 'form') {
        await generateFormPdf(id);
      }
    } catch (error: any) {
      console.error('Error generating PDF:', error);
      toast({
        title: "PDF Generation Failed",
        description: error.message || "Failed to generate PDF",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Edit student profile
  const handleEditProfile = async (studentId: string) => {
    // Implementation for editing student profile
    console.log("Edit profile for student:", studentId);
    // This would typically navigate to a profile edit page or open a modal
  };

  // Recalculate student progress
  const handleRecalculateProgress = async (studentId: string) => {
    if (!user) {
      toast({
        title: "Authentication Error",
        description: "You must be logged in to perform this action.",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await updateStudentProgress(studentId);
      
      toast({
        title: "Progress Recalculated",
        description: "Student progress has been successfully recalculated."
      });
    } catch (error: any) {
      console.error('Error recalculating progress:', error);
      toast({
        title: "Recalculation Failed",
        description: error.message || "Failed to recalculate student progress",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleSaveStudentChanges,
    handleGeneratePdf,
    handleEditProfile,
    handleRecalculateProgress
  };
};
