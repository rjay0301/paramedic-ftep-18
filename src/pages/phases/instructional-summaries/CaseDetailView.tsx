import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { InstructionalCaseSummaryData } from '@/types';
import { Separator } from '@/components/ui/separator';

interface CaseDetailViewProps {
  summary: InstructionalCaseSummaryData;
  onEdit: () => void;
}

const CaseDetailView: React.FC<CaseDetailViewProps> = ({ summary, onEdit }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Case Summary {summary.summary_number}</CardTitle>
            <Badge variant={summary.status === 'submitted' ? 'default' : 'outline'}>
              {summary.status === 'submitted' ? 'Submitted' : 'Draft'}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium">CFS Number</p>
              <p className="text-sm">{summary.cfs_number || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-sm font-medium">Date</p>
              <p className="text-sm">
                {summary.date ? format(new Date(summary.date), 'PPP') : 'Not provided'}
              </p>
            </div>
          </div>
          
          <div>
            <p className="text-sm font-medium">Chief Complaint</p>
            <p className="text-sm">{summary.chief_complaint || 'Not provided'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Priority to Hospital</p>
            <p className="text-sm">{summary.priority}</p>
          </div>
          
          <Separator className="my-4" />
          
          <div>
            <p className="text-sm font-medium">Skills Performed</p>
            <p className="text-sm whitespace-pre-line">{summary.skills_performed || 'None recorded'}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium">Medications Administered</p>
            <p className="text-sm whitespace-pre-line">{summary.medications_administered || 'None recorded'}</p>
          </div>
          
          <Separator className="my-4" />
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">What was performed well</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{summary.performed_well || 'Not provided'}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">Areas to improve</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{summary.areas_to_improve || 'Not provided'}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-1">FTP Feedback</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{summary.ftp_feedback || 'Not provided'}</p>
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={onEdit}
            disabled={summary.status === 'submitted'}
          >
            {summary.status === 'submitted' ? 'Submitted (Read Only)' : 'Edit Summary'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CaseDetailView;
