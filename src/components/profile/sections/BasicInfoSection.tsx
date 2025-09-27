
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type BasicInfoSectionProps = {
  profile: {
    name: string;
    department: string;
    corporationId: string;
    role: string;
    joinDate: string;
    hub: string;
    unit: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isStudent?: boolean;
};

const BasicInfoSection: React.FC<BasicInfoSectionProps> = ({ profile, isEditing, onInputChange, isStudent }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-sm font-medium">
              Full Name
            </Label>
            {isEditing ? (
              <Input 
                id="name" 
                name="full_name" 
                value={profile.name} 
                onChange={onInputChange}
                className="mt-1"
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.name}</div>
            )}
          </div>
          
          <div>
            <Label htmlFor="department" className="text-sm font-medium">
              Department
            </Label>
            {/* Department is always set to Training for students and not editable */}
            <div className="mt-1 p-2 bg-gray-50 rounded-md">
              {isStudent ? 'Training' : profile.department}
            </div>
          </div>
          
          <div>
            <Label htmlFor="corporationId" className="text-sm font-medium">
              Corporation ID
            </Label>
            {/* Corporation ID is not editable - set during signup */}
            <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.corporationId}</div>
          </div>
          
          <div>
            <Label htmlFor="role" className="text-sm font-medium">
              Role
            </Label>
            {/* Role is not editable - always Student for students */}
            <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.role}</div>
          </div>
          
          {!isStudent && (
            <>
              <div>
                <Label htmlFor="hub" className="text-sm font-medium">
                  Hub
                </Label>
                {isEditing ? (
                  <Input 
                    id="hub" 
                    name="hub" 
                    value={profile.hub} 
                    onChange={onInputChange}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.hub}</div>
                )}
              </div>
              
              <div>
                <Label htmlFor="unit" className="text-sm font-medium">
                  Alpha Unit
                </Label>
                {isEditing ? (
                  <Input 
                    id="unit" 
                    name="unit" 
                    value={profile.unit} 
                    onChange={onInputChange}
                    className="mt-1"
                  />
                ) : (
                  <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.unit}</div>
                )}
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoSection;
