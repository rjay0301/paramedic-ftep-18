
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

type ContactInfoSectionProps = {
  profile: {
    email: string;
    phone: string;
  };
  isEditing: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isStudent?: boolean;
};

const ContactInfoSection: React.FC<ContactInfoSectionProps> = ({ profile, isEditing, onInputChange, isStudent }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            {/* Email is always read-only as it's part of auth */}
            <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.email}</div>
          </div>

          <div>
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            {isEditing ? (
              <Input 
                id="phone" 
                name="phone" 
                value={profile.phone || ''} 
                onChange={onInputChange}
                className="mt-1"
                placeholder="Enter your phone number"
              />
            ) : (
              <div className="mt-1 p-2 bg-gray-50 rounded-md">{profile.phone || 'Not specified'}</div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactInfoSection;
