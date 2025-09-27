
import React from 'react';
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

interface AssignmentContentProps {
  assignmentKey: string;
  value: string;
  isSubmitted: boolean;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const AssignmentContent: React.FC<AssignmentContentProps> = ({
  assignmentKey,
  value,
  isSubmitted,
  onChange
}) => {
  const isEmpty = !value || value.trim() === '';
  const showValidationError = isEmpty && !isSubmitted;
  
  return (
    <div className="space-y-2">
      <Label 
        htmlFor={assignmentKey}
        className={showValidationError ? "text-destructive" : ""}
      >
        Assignment Content
      </Label>
      <Textarea
        id={assignmentKey}
        name={assignmentKey}
        placeholder="Enter your assignment content here..."
        value={value}
        onChange={onChange}
        disabled={isSubmitted}
        className={`min-h-[100px] ${isSubmitted ? "bg-gray-50 text-gray-700" : showValidationError ? "border-destructive" : ""}`}
        required={!isSubmitted}
        aria-required="true"
      />
      
      {showValidationError && (
        <p className="text-sm text-destructive">This field is required</p>
      )}
      
      {isSubmitted && (
        <div className="bg-green-50 p-2 rounded border border-green-200">
          <p className="text-green-700 text-sm">This assignment has been submitted successfully.</p>
        </div>
      )}
    </div>
  );
};

export default AssignmentContent;
