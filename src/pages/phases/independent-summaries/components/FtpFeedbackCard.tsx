
import React from 'react';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { IndependentCaseSummaryData } from '@/types/independentSummaries';

interface FtpFeedbackCardProps {
  summaryData: IndependentCaseSummaryData;
  handleChange: <K extends keyof IndependentCaseSummaryData>(field: K, value: IndependentCaseSummaryData[K]) => void;
  summaryNumber: number;
}

const FtpFeedbackCard: React.FC<FtpFeedbackCardProps> = ({
  summaryData,
  handleChange,
  summaryNumber,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>FTP Feedback</CardTitle>
        <CardDescription>
          Document best performance and areas needing improvement
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`best-performance-${summaryNumber}`}>Area(s) of Best Performance</Label>
            <Textarea
              id={`best-performance-${summaryNumber}`}
              placeholder="Document areas where the student performed well"
              value={summaryData.best_performance}
              onChange={(e) => handleChange('best_performance', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`needs-improvement-${summaryNumber}`}>Area(s) Needing Improvement</Label>
            <Textarea
              id={`needs-improvement-${summaryNumber}`}
              placeholder="Document areas where the student needs to improve"
              value={summaryData.needs_improvement}
              onChange={(e) => handleChange('needs_improvement', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`improvement-plan-${summaryNumber}`}>Plan for Improvement or Actions Taken</Label>
            <Textarea
              id={`improvement-plan-${summaryNumber}`}
              placeholder="Document plans or actions for improvement"
              value={summaryData.improvement_plan}
              onChange={(e) => handleChange('improvement_plan', e.target.value)}
              rows={3}
            />
          </div>
          
          <div className="flex items-center space-x-2 pt-2">
            <Switch
              id={`discussed-with-ftp-${summaryNumber}`}
              checked={summaryData.discussed_with_ftp}
              onCheckedChange={(checked) => handleChange('discussed_with_ftp', checked)}
            />
            <Label htmlFor={`discussed-with-ftp-${summaryNumber}`}>
              Discussion with FTP confirmed
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default FtpFeedbackCard;
