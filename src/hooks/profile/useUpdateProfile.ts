
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { toast } from 'sonner';
import type { ProfileInputData } from '@/types/profile';

export const useUpdateProfile = () => {
  const { user } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const saveProfile = async (profileData: ProfileInputData): Promise<boolean> => {
    if (!user?.id) return false;

    try {
      setIsSaving(true);
      console.log('Saving profile data:', profileData);

      const { data: studentData } = await supabase
        .from('students')
        .select('id, role')
        .eq('profile_id', user.id)
        .single();

      if (!studentData) {
        console.error('No student record found for user');
        return false;
      }

      const isStudent = studentData?.role === 'student';
      
      if (isStudent) {
        // Student can update their name, phone and email
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: profileData.full_name,
            contact_number: profileData.phone,
          }
        });

        if (metadataError) {
          console.error('Error updating user metadata:', metadataError);
          return false;
        }
        
        // Update student record with the fixed department
        const { error } = await supabase
          .from('students')
          .update({
            full_name: profileData.full_name
          })
          .eq('id', studentData.id);

        if (error) {
          console.error('Error updating student data:', error);
          return false;
        }
      } else {
        // Coordinator actions for student profiles
        const { error: metadataError } = await supabase.auth.updateUser({
          data: {
            full_name: profileData.full_name,
            contact_number: profileData.phone
          }
        });

        if (metadataError) {
          console.error('Error updating user metadata:', metadataError);
          return false;
        }
        
        // Update both the student record fields and the hub_name field
        const { error } = await supabase
          .from('students')
          .update({
            alpha_unit_text: profileData.unit,
            hub_name: profileData.hub,
            ftp_name: profileData.ftp_name,
            ftp_contact: profileData.emergency_contact,
            full_name: profileData.full_name
          })
          .eq('id', studentData.id);

        if (error) {
          console.error('Error updating student data:', error);
          return false;
        }
      }

      // Show a single success toast instead of multiple
      toast.success('Profile updated successfully');
      return true;
    } catch (error) {
      console.error('Exception in saveProfile:', error);
      toast.error('An error occurred while updating the profile');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return { saveProfile, isSaving };
};
