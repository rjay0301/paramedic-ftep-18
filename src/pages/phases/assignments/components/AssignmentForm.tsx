
import React from 'react';
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from "@/components/ui/card";
import AssignmentHeader from './AssignmentHeader';
import AssignmentActions from './AssignmentActions';

interface AssignmentFormProps {
  assignmentTab: string;
  value: string;
  isSubmitted: boolean;
  isDisabled: boolean;
  onChange: (value: string) => void;
  onSaveDraft: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  isSaving: boolean;
}

const AssignmentForm: React.FC<AssignmentFormProps> = ({
  assignmentTab,
  value,
  isSubmitted,
  isDisabled,
  onChange,
  onSaveDraft,
  onSubmit,
  isSubmitting,
  isSaving
}) => {
  const getAssignmentDetails = () => {
    switch (assignmentTab) {
      case 'assignment1':
        return {
          title: 'Ambulance Inventory',
          description: 'Complete a full inventory of the ambulance during the shift.',
          label: 'Describe all the places on the ambulance where the following equipment can be found and how many of each item are on the ambulance:',
          listItems: [
            'AP airway roll (the content)',
            'Body Bag',
            'Spare Oxygen Bottles',
            'KED',
            'Scoop Stretcher',
            'Pelvic Sling',
            'Chest triage bag (the content)'
          ]
        };
      case 'assignment2':
        return {
          title: 'FTP Observation',
          description: 'Observe your FTP in their completion of start and end of shift duties.',
          label: 'Closely observe your FTP in his/her completion of the start and end of shift duties and read SOP 4.2. Write down 4 things you learned about the process:'
        };
      case 'assignment3':
        return {
          title: 'Patient Assessment',
          description: 'Read CPG regarding medical and trauma adult patient assessment.',
          label: 'Provide a quick description of medical and trauma adult patient assessment:'
        };
      case 'assignment4':
        return {
          title: 'Ambulance Parking at RTA',
          description: 'Read SOP 4.7A regarding ambulance parking at RTA scenes.',
          label: 'Write down specifically how the ambulance should be parked on the scene of an RTA. What should you assess for when you first arrive?'
        };
      case 'assignment5':
        return {
          title: 'Non-Transport and Release of Patients',
          description: 'Read SOP 4.8D regarding non-transport and release of patients.',
          label: 'What specifically do you need to document on your ePCR for a patient refusal? When should CTL be contacted? Who needs to sign the PCR?'
        };
      case 'assignment6':
        return {
          title: 'CCD Update',
          description: 'Read SOP 4.8C regarding CCD Update.',
          label: 'Write down the format for updating CCD and briefly state what information should be included in ALL updates:'
        };
      default:
        return {
          title: '',
          description: '',
          label: ''
        };
    }
  };

  const details = getAssignmentDetails();
  const isEmpty = !value || value.trim() === '';
  const showValidationError = isEmpty && !isSubmitted && !isDisabled;

  return (
    <Card>
      <CardHeader>
        <AssignmentHeader
          assignmentNumber={assignmentTab.replace('assignment', '')}
          title={details.title}
          description={details.description}
        />
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={assignmentTab} className={showValidationError ? "text-destructive" : ""}>
            {details.label}
            {details.listItems && (
              <ul className="list-disc pl-5 mt-2 text-sm">
                {details.listItems.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            )}
          </Label>
          <Textarea
            id={assignmentTab}
            rows={5}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={isSubmitted || isDisabled}
            className={isSubmitted ? "bg-gray-50 text-gray-700" : showValidationError ? "border-destructive" : ""}
            required={!isSubmitted}
            aria-required="true"
          />
          {showValidationError && (
            <p className="text-sm text-destructive mt-1">This field is required</p>
          )}
        </div>
        
        {isSubmitted && (
          <div className="bg-green-50 p-2 rounded border border-green-200">
            <p className="text-green-700 text-sm">This assignment has been submitted successfully.</p>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="flex justify-end space-x-3 pt-4">
        {!isSubmitted && (
          <AssignmentActions
            isSubmitted={isSubmitted}
            isSubmitting={isSubmitting}
            isSaving={isSaving}
            onSave={onSaveDraft}
            onSubmit={onSubmit}
            isDisabled={isEmpty}
          />
        )}
      </CardFooter>
    </Card>
  );
};

export default AssignmentForm;
