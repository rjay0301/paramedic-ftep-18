
import React from 'react';
import { useAuth } from '@/contexts/auth';
import { useAddendumForm } from '@/hooks/useAddendumForm';
import { AddendumFormType } from '@/types/addendum';
import { FormDataValue } from '@/types/forms';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface AddendumFormBaseProps {
  formType: AddendumFormType;
  children: React.ReactNode;
  onFormDataChange: (data: Record<string, FormDataValue>) => void;
  formData: Record<string, FormDataValue>;
}

const AddendumFormBase: React.FC<AddendumFormBaseProps> = ({
  formType,
  children,
  onFormDataChange,
  formData
}) => {
  const { user } = useAuth();
  const { form, isLoading, isSubmitting, saveForm } = useAddendumForm(user?.id || '', formType);

  const handleSaveDraft = () => {
    if (!user?.id) {
      toast.error('You must be logged in to save a draft');
      return;
    }
    saveForm({ content: formData, status: 'draft' });
  };

  const handleSubmit = () => {
    if (!user?.id) {
      toast.error('You must be logged in to submit the form');
      return;
    }
    saveForm({ 
      content: formData, 
      status: 'submitted',
      submittedAt: new Date().toISOString() 
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {children}
      
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          variant="outline"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          Save Draft
        </Button>
        <Button
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default AddendumFormBase;
