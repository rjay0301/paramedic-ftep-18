
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Send, Loader2, Trash2 } from 'lucide-react';

interface AssignmentActionsProps {
  isSubmitted: boolean;
  isSubmitting: boolean;
  isSaving: boolean;
  onSave: () => void;
  onSubmit: () => void;
  onDelete?: () => void;
  isDisabled?: boolean;
}

const AssignmentActions: React.FC<AssignmentActionsProps> = ({
  isSubmitted,
  isSubmitting,
  isSaving,
  onSave,
  onSubmit,
  onDelete,
  isDisabled = false
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button 
        variant="outline" 
        onClick={onSave} 
        disabled={isSubmitting || isSubmitted || isSaving}
      >
        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
        Save Draft
      </Button>
      
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting || isSubmitted || isDisabled || isSaving}
      >
        {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
        Submit
      </Button>
      
      {onDelete && !isSubmitted && (
        <Button 
          variant="destructive" 
          onClick={onDelete} 
          disabled={isSubmitting || isSaving}
          className="ml-auto"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      )}
    </div>
  );
};

export default AssignmentActions;
