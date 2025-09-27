
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import SignatureField from '@/components/common/SignatureField';
import { InstructionalCaseSummaryData } from '@/types';

interface CaseSignaturesCardProps {
  formData: InstructionalCaseSummaryData;
  handleChange: <K extends keyof InstructionalCaseSummaryData>(
    key: K, 
    value: InstructionalCaseSummaryData[K]
  ) => void;
  isSubmitting: boolean;
}

const CaseSignaturesCard: React.FC<CaseSignaturesCardProps> = ({
  formData,
  handleChange,
  isSubmitting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signatures</CardTitle>
        <CardDescription>Obtain signatures from the student and FTP</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <SignatureField
            label="Student Signature"
            value={formData.student_signature}
            onChange={(value) => handleChange('student_signature', value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="space-y-2">
          <SignatureField
            label="FTP Signature"
            value={formData.ftp_signature}
            onChange={(value) => handleChange('ftp_signature', value)}
            disabled={isSubmitting}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseSignaturesCard;
