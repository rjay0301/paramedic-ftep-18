
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileDetails from '@/components/profile/ProfileDetails';
import { ProfileData } from '@/hooks/useProfileData';

type ProfileCardProps = {
  profile: {
    name: string;
    email: string;
    phone: string;
    department: string;
    hub: string;
    unit: string;
    corporationId: string;
    role: string;
    joinDate: string;
    ftpName: string;
    emergencyContact: string;
  };
  isSaving: boolean;
  onMenuClick: () => void;
  onSave: () => Promise<boolean>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const ProfileCard: React.FC<ProfileCardProps> = ({
  profile,
  isSaving,
  onMenuClick,
  onSave,
  onInputChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const isStudent = profile.role === 'Student';
  
  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSave = async () => {
    const success = await onSave();
    if (success) {
      setIsEditing(false);
    }
  };
  
  return (
    <Card className="overflow-hidden mb-6">
      <ProfileHeader 
        name={profile.name}
        role={profile.role}
        corporationId={profile.corporationId}
        department={profile.department}
        onMenuClick={onMenuClick}
      />
      
      <ProfileDetails 
        profile={profile}
        isEditing={isEditing}
        isSaving={isSaving}
        onEdit={handleEditToggle}
        onSave={handleSave}
        onInputChange={onInputChange}
        isStudent={isStudent}
      />
    </Card>
  );
};

export default ProfileCard;
