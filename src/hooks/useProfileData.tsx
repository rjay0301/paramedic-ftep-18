
import { useState, useEffect } from 'react';
import { useFetchProfile } from './profile/useFetchProfile';
import { useUpdateProfile } from './profile/useUpdateProfile';
import type { ProfileData } from '@/types/profile';

export type { ProfileData };

export const useProfileData = () => {
  const { profileData: fetchedProfileData, isLoading } = useFetchProfile();
  const [profileData, setProfileData] = useState<ProfileData>({} as ProfileData);
  const { saveProfile, isSaving } = useUpdateProfile();

  // Update local state when fetched data changes
  useEffect(() => {
    if (fetchedProfileData && Object.keys(fetchedProfileData).length > 0) {
      console.log('Fetched profile data:', fetchedProfileData);
      setProfileData(fetchedProfileData);
    }
  }, [fetchedProfileData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return {
    profileData,
    isLoading,
    isSaving,
    handleInputChange,
    saveProfile: () => saveProfile(profileData)
  };
};
