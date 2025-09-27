
import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { AssessmentStatus, ShiftData } from './types';

interface AssessmentSectionProps {
  shiftData: ShiftData;
  handleChange: (field: keyof ShiftData, value: any) => void;
  handleAssessmentChange: (assessment: keyof ShiftData['assessments'], value: AssessmentStatus) => void;
  shiftNumber: number;
}

const AssessmentSection: React.FC<AssessmentSectionProps> = ({
  shiftData,
  handleChange,
  handleAssessmentChange,
  shiftNumber,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Rural Ambulance Hands-On Operation Assessment</CardTitle>
        <CardDescription>
          Please assess competency in the following areas.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <AssessmentItem 
            label="Loading of the stretcher" 
            assessment={shiftData.assessments.loadingStretcher}
            onChange={(value) => handleAssessmentChange('loadingStretcher', value)}
          />
          
          <AssessmentItem 
            label="Unloading of the stretcher" 
            assessment={shiftData.assessments.unloadingStretcher}
            onChange={(value) => handleAssessmentChange('unloadingStretcher', value)}
          />
          
          <AssessmentItem 
            label="Use of safety and securing features" 
            assessment={shiftData.assessments.safetyFeatures}
            onChange={(value) => handleAssessmentChange('safetyFeatures', value)}
          />
          
          <AssessmentItem 
            label="Cabin compartment familiarization" 
            assessment={shiftData.assessments.cabinFamiliarization}
            onChange={(value) => handleAssessmentChange('cabinFamiliarization', value)}
          />
          
          <div className="space-y-2">
            <Label htmlFor={`comments-${shiftNumber}`}>Comments</Label>
            <Textarea 
              id={`comments-${shiftNumber}`}
              rows={4} 
              placeholder="Enter any additional comments or observations..." 
              value={shiftData.comments} 
              onChange={(e) => handleChange('comments', e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface AssessmentItemProps {
  label: string;
  assessment: AssessmentStatus;
  onChange: (value: AssessmentStatus) => void;
}

const AssessmentItem: React.FC<AssessmentItemProps> = ({ label, assessment, onChange }) => {
  return (
    <div className="p-4 border rounded-md">
      <div className="mb-2">
        <Label className="font-medium">{label} *</Label>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          size="sm"
          variant={assessment === 'competent' ? 'default' : 'outline'}
          className="flex-1 flex items-center justify-center gap-1 min-w-[120px] max-w-[180px]"
          onClick={() => onChange('competent')}
        >
          <CheckCircle className={assessment === 'competent' ? 'text-white' : 'text-gray-400'} size={16} />
          <span>Competent</span>
        </Button>
        <Button
          type="button"
          size="sm"
          variant={assessment === 'not_competent' ? 'default' : 'outline'}
          className="flex-1 flex items-center justify-center gap-1 min-w-[120px] max-w-[180px]"
          onClick={() => onChange('not_competent')}
        >
          <XCircle className={assessment === 'not_competent' ? 'text-white' : 'text-gray-400'} size={16} />
          <span>Not Yet Competent</span>
        </Button>
      </div>
    </div>
  );
};

export default AssessmentSection;
