
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/auth';
import { Loader2 } from 'lucide-react';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileCard from '@/components/profile/ProfileCard';

const Profile = () => {
  const { user, isLoading: authLoading } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const {
    profileData,
    isLoading,
    isSaving,
    handleInputChange,
    saveProfile
  } = useProfileData();
  
  useEffect(() => {
    if (profileData && Object.keys(profileData).length > 0) {
      console.log('Profile data loaded in Profile page:', {
        name: profileData.full_name,
        hub: profileData.hub,
        unit: profileData.unit,
        ftpName: profileData.ftp_name,
        emergencyContact: profileData.emergency_contact
      });
    }
  }, [profileData]);
  
  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-primary" />
      </div>
    );
  }
  
  // Format profile data for the ProfileCard component
  const formattedProfile = {
    name: profileData.full_name || '',
    email: profileData.email || '',
    phone: profileData.phone || '',
    department: profileData.department || '',
    hub: profileData.hub || '',
    unit: profileData.unit || '',
    corporationId: profileData.corp_id || '',
    role: profileData.role === 'student' ? 'Student' : 'Coordinator',
    joinDate: profileData.join_date ? new Date(profileData.join_date).toLocaleDateString() : 'Not Set',
    ftpName: profileData.ftp_name || '',
    emergencyContact: profileData.emergency_contact || ''
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      
      <ProfileCard
        profile={formattedProfile}
        isSaving={isSaving}
        onMenuClick={() => setIsSidebarOpen(true)}
        onSave={saveProfile}
        onInputChange={handleInputChange}
      />
    </div>
  );
};

export default Profile;
