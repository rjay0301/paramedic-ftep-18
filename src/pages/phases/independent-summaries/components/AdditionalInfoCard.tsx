
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { IndependentCaseSummaryData } from '@/types/independentSummaries';

interface AdditionalInfoCardProps {
  summaryData: IndependentCaseSummaryData;
  handleChange: <K extends keyof IndependentCaseSummaryData>(field: K, value: IndependentCaseSummaryData[K]) => void;
  summaryNumber: number;
}

const AdditionalInfoCard: React.FC<AdditionalInfoCardProps> = ({
  summaryData,
  handleChange,
  summaryNumber,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Additional Information</CardTitle>
        <CardDescription>
          Skills performed and medications administered
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`skills-performed-${summaryNumber}`}>Skills Performed by Student</Label>
            <Textarea
              id={`skills-performed-${summaryNumber}`}
              placeholder="List skills performed during this case"
              value={summaryData.skills_performed}
              onChange={(e) => handleChange('skills_performed', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`medications-administered-${summaryNumber}`}>Medications Administered by Student</Label>
            <Textarea
              id={`medications-administered-${summaryNumber}`}
              placeholder="List medications administered during this case"
              value={summaryData.medications_administered}
              onChange={(e) => handleChange('medications_administered', e.target.value)}
              rows={3}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AdditionalInfoCard;
