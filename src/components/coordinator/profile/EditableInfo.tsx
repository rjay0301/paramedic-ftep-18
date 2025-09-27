
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { FormData } from '@/types/coordinator';
import { Loader2 } from 'lucide-react';

interface EditableInfoProps {
  formData: FormData;
  isLoading: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSave: () => void;
}

const EditableInfo: React.FC<EditableInfoProps> = ({
  formData,
  isLoading,
  onInputChange,
  onSave
}) => {
  return (
    <Card className="mb-4 sm:mb-6">
      <div className="p-3 sm:p-4 border-b">
        <h3 className="font-semibold text-sm sm:text-base">Editable Information</h3>
      </div>
      <CardContent className="p-3 sm:p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div>
            <Label htmlFor="hub" className="mb-1 text-xs sm:text-sm">Hub</Label>
            <Input 
              id="hub"
              name="hub"
              type="text" 
              value={formData.hub}
              onChange={onInputChange}
              className="text-sm h-8 sm:h-10"
              disabled={isLoading}
              placeholder="Enter hub name"
            />
          </div>
          <div>
            <Label htmlFor="alphaUnit" className="mb-1 text-xs sm:text-sm">Alpha Unit</Label>
            <Input 
              id="alphaUnit"
              name="alphaUnit"
              type="text" 
              value={formData.alphaUnit}
              onChange={onInputChange}
              className="text-sm h-8 sm:h-10"
              disabled={isLoading}
              placeholder="Enter alpha unit"
            />
          </div>
          <div>
            <Label htmlFor="ftpName" className="mb-1 text-xs sm:text-sm">FTP Name</Label>
            <Input 
              id="ftpName"
              name="ftpName"
              type="text" 
              value={formData.ftpName}
              onChange={onInputChange}
              className="text-sm h-8 sm:h-10"
              disabled={isLoading}
              placeholder="Enter FTP name"
            />
          </div>
          <div>
            <Label htmlFor="ftpContact" className="mb-1 text-xs sm:text-sm">FTP Contact</Label>
            <Input 
              id="ftpContact"
              name="ftpContact"
              type="text" 
              value={formData.ftpContact}
              onChange={onInputChange}
              className="text-sm h-8 sm:h-10"
              disabled={isLoading}
              placeholder="Enter FTP contact"
            />
          </div>
        </div>
        <div className="mt-3 sm:mt-4 flex justify-end">
          <Button 
            onClick={onSave}
            disabled={isLoading}
            className="text-xs sm:text-sm h-8 sm:h-10"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : 'Save Changes'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableInfo;
