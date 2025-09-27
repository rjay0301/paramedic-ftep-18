
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/auth';
import { ProfileData } from '@/types/profile';

export const useFetchProfile = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        
        // First get student data
        const { data: studentData, error } = await supabase
          .from('students')
          .select('*')
          .eq('profile_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching student data:', error);
          return;
        }

        if (studentData) {
          console.log("Student data fetched:", studentData);
          
          // Use hub_name directly from student record if available
          let hubName = studentData.hub_name || '';
          
          // Fallback to getting hub name from hub_id if hub_name is not available
          if (!hubName && studentData.hub_id) {
            const { data: hubData } = await supabase
              .from('hubs')
              .select('name')
              .eq('id', studentData.hub_id)
              .single();
            
            if (hubData) {
              hubName = hubData.name;
              
              // Update the hub_name in students table for future use
              await supabase
                .from('students')
                .update({ hub_name: hubName })
                .eq('id', studentData.id);
            }
          }
          
          // Get user metadata from auth.users
          const { data: userData } = await supabase.auth
            .admin.getUserById(studentData.profile_id);
            
          const userMetadata = userData?.user?.user_metadata || {};
          
          // Always set department to "Training" for students
          const department = studentData.role === 'student' ? 'Training' : (userMetadata.department || '');
          
          // Map student data to ProfileData format
          const mappedData: ProfileData = {
            id: studentData.id,
            full_name: userMetadata.full_name || studentData.full_name || '',
            email: userData?.user?.email || studentData.email || '',
            phone: userMetadata.contact_number || '',
            department: department,
            hub: hubName || '',
            unit: studentData.alpha_unit_text || '',
            corp_id: userMetadata.corp_id || studentData.corp_id || '',
            role: studentData.role || '',
            updated_at: studentData.updated_at,
            created_at: studentData.created_at,
            join_date: studentData.program_start_date || '',
            ftp_name: studentData.ftp_name || '',
            emergency_contact: studentData.ftp_contact || ''
          };
          setProfileData(mappedData);
        }
      } catch (error) {
        console.error('Error in fetchProfileData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
    
    const studentSubscription = supabase
      .channel('student-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'students',
          filter: `profile_id=eq.${user.id}`
        },
        (payload) => {
          console.log('Student updated in real-time:', payload);
          
          // Get hub name if hub_id exists (inside async IIFE)
          (async () => {
            // Use hub_name directly from updated data if available
            let hubName = payload.new.hub_name || '';
            
            if (!hubName && payload.new.hub_id) {
              const { data: hubData } = await supabase
                .from('hubs')
                .select('name')
                .eq('id', payload.new.hub_id)
                .single();
              
              if (hubData) {
                hubName = hubData.name;
              }
            }
            
            // Get user metadata from auth.users
            const { data: userData } = await supabase.auth
              .admin.getUserById(payload.new.profile_id);
              
            const userMetadata = userData?.user?.user_metadata || {};
            
            // Always set department to "Training" for students
            const department = payload.new.role === 'student' ? 'Training' : (userMetadata.department || '');
            
            // Map the updated student data to ProfileData format
            const updatedData = payload.new;
            const mappedData: ProfileData = {
              id: updatedData.id,
              full_name: userMetadata.full_name || updatedData.full_name || '',
              email: userData?.user?.email || updatedData.email || '',
              phone: userMetadata.contact_number || '',
              department: department,
              hub: hubName || '',
              unit: updatedData.alpha_unit_text || '',
              corp_id: userMetadata.corp_id || updatedData.corp_id || '',
              role: updatedData.role || '',
              updated_at: updatedData.updated_at,
              created_at: updatedData.created_at,
              join_date: updatedData.program_start_date || '',
              ftp_name: updatedData.ftp_name || '',
              emergency_contact: updatedData.ftp_contact || ''
            };
            setProfileData(mappedData);
          })();
        }
      )
      .subscribe();
    
    return () => {
      supabase.removeChannel(studentSubscription);
    };
  }, [user?.id]);

  return { profileData, isLoading };
};
