
import React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { InstructionalCaseSummaryData } from '@/types';

interface CaseAdditionalInfoCardProps {
  formData: InstructionalCaseSummaryData;
  handleChange: <K extends keyof InstructionalCaseSummaryData>(
    key: K, 
    value: InstructionalCaseSummaryData[K]
  ) => void;
  isSubmitting: boolean;
}

const CaseAdditionalInfoCard: React.FC<CaseAdditionalInfoCardProps> = ({
  formData,
  handleChange,
  isSubmitting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>Provide additional details about the case</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="performed-well">What was performed well</Label>
          <Textarea
            id="performed-well"
            value={formData.performed_well || ''}
            onChange={(e) => handleChange('performed_well', e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="areas-to-improve">Areas to improve</Label>
          <Textarea
            id="areas-to-improve"
            value={formData.areas_to_improve || ''}
            onChange={(e) => handleChange('areas_to_improve', e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ftp-feedback">FTP Feedback</Label>
          <Textarea
            id="ftp-feedback"
            value={formData.ftp_feedback || ''}
            onChange={(e) => handleChange('ftp_feedback', e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="skills-performed">Skills Performed</Label>
          <Textarea
            id="skills-performed"
            value={formData.skills_performed}
            onChange={(e) => handleChange('skills_performed', e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medications-administered">Medications Administered</Label>
          <Textarea
            id="medications-administered"
            value={formData.medications_administered}
            onChange={(e) => handleChange('medications_administered', e.target.value)}
            rows={3}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseAdditionalInfoCard;
