
import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BasicInfoSection from './sections/BasicInfoSection';
import ContactInfoSection from './sections/ContactInfoSection';
import FTPInfoSection from './sections/FTPInfoSection';

type ProfileDetailsProps = {
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
  isEditing: boolean;
  isSaving: boolean;
  onEdit: () => void;
  onSave: () => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isStudent?: boolean;
};

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profile,
  isEditing,
  isSaving,
  onEdit,
  onSave,
  onInputChange,
  isStudent = false
}) => {
  return (
    <>
      <div className="ml-auto mt-4 md:mt-0">
        <Button 
          className={`transition-all ${isEditing ? "bg-white text-primary-600 hover:bg-primary-50" : "bg-primary-600 text-white hover:bg-primary-700 border border-primary-300"}`} 
          onClick={isEditing ? onEdit : onEdit}
        >
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>
      
      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6">
          <BasicInfoSection 
            profile={profile}
            isEditing={isEditing}
            onInputChange={onInputChange}
            isStudent={isStudent}
          />
          
          <div className="space-y-4">
            <ContactInfoSection 
              profile={profile}
              isEditing={isEditing}
              onInputChange={onInputChange}
              isStudent={isStudent}
            />
            
            {isStudent && (
              <FTPInfoSection 
                profile={profile}
              />
            )}
          </div>
        </div>
        
        {isEditing && (
          <div className="mt-6 flex justify-end">
            <Button onClick={onSave} disabled={isSaving} className="flex items-center">
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileDetails;
