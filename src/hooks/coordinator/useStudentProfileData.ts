
import { useState, useEffect } from 'react';
import { Student, FormData } from '@/types/coordinator';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useStudentProfileData = (student: Student) => {
  const [formData, setFormData] = useState<FormData>({
    hub: student.hub,
    alphaUnit: student.alphaUnit,
    ftpName: student.ftpName,
    ftpContact: student.ftpContact
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Update form data when student prop changes
    setFormData({
      hub: student.hub,
      alphaUnit: student.alphaUnit,
      ftpName: student.ftpName,
      ftpContact: student.ftpContact
    });
  }, [student]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsLoading(true);

      // Update the student record
      const { error } = await supabase
        .from('students')
        .update({
          alpha_unit_text: formData.alphaUnit,
          hub_name: formData.hub, // Update hub_name directly
          ftp_name: formData.ftpName,
          ftp_contact: formData.ftpContact
        })
        .eq('id', student.id);

      if (error) {
        console.error('Error updating student:', error);
        toast.error('Failed to update student information');
        return;
      }

      // Only show one notification
      toast.success('Student information updated successfully');
    } catch (error) {
      console.error('Error in handleSaveChanges:', error);
      toast.error('An error occurred while updating student information');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleInputChange,
    handleSaveChanges
  };
};
