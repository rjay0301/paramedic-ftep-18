
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { InstructionalCaseSummaryData } from '@/types';

interface CaseBasicInfoCardProps {
  formData: InstructionalCaseSummaryData;
  handleChange: <K extends keyof InstructionalCaseSummaryData>(
    key: K, 
    value: InstructionalCaseSummaryData[K]
  ) => void;
  currentSummary: number;
  isSubmitting: boolean;
}

const CaseBasicInfoCard: React.FC<CaseBasicInfoCardProps> = ({
  formData,
  handleChange,
  currentSummary,
  isSubmitting
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Summary Details</CardTitle>
        <CardDescription>Enter the details for case summary {currentSummary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="cfs-number">CFS Number</Label>
            <Input
              id="cfs-number"
              value={formData.cfs_number}
              onChange={(e) => handleChange('cfs_number', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !formData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.date ? format(new Date(formData.date), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.date ? new Date(formData.date) : undefined}
                  onSelect={(date) => handleChange('date', date?.toISOString() || null)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label htmlFor="chief-complaint">Chief Complaint</Label>
            <Input
              id="chief-complaint"
              value={formData.chief_complaint}
              onChange={(e) => handleChange('chief_complaint', e.target.value)}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <select
              id="priority"
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              value={formData.priority}
              onChange={(e) => handleChange('priority', e.target.value as 'P1' | 'P2')}
              disabled={isSubmitting}
            >
              <option value="P1">P1</option>
              <option value="P2">P2</option>
            </select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CaseBasicInfoCard;
