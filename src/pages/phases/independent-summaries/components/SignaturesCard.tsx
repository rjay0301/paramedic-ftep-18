
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SignatureField from '@/components/common/SignatureField';
import { IndependentCaseSummaryData } from '@/types/independentSummaries';

interface SignaturesCardProps {
  summaryData: IndependentCaseSummaryData;
  handleChange: <K extends keyof IndependentCaseSummaryData>(field: K, value: IndependentCaseSummaryData[K]) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  isSubmitting: boolean;
}

const SignaturesCard: React.FC<SignaturesCardProps> = ({
  summaryData,
  handleChange,
  handleSubmit,
  handleSaveDraft,
  isSubmitting,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Signatures</CardTitle>
        <CardDescription>
          By signing below I am attesting that the information on this case summary is true and correct to the best of my knowledge.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="pt-2">
          <SignatureField
            label="FTP Signature *"
            value={summaryData.ftp_signature}
            onChange={(value) => handleChange('ftp_signature', value)}
            required={true}
          />
        </div>
        
        <div className="pt-2">
          <SignatureField
            label="Student Signature *"
            value={summaryData.student_signature}
            onChange={(value) => handleChange('student_signature', value)}
            required={true}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
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
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SignaturesCard;
