
import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { IndependentCaseSummaryData } from '@/types/independentSummaries';

interface BasicInfoCardProps {
  summaryData: IndependentCaseSummaryData;
  handleChange: <K extends keyof IndependentCaseSummaryData>(field: K, value: IndependentCaseSummaryData[K]) => void;
  summaryNumber: number;
}

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({
  summaryData,
  handleChange,
  summaryNumber,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Case Summary {summaryNumber} Information</CardTitle>
        <CardDescription>
          Enter the basic information for this case summary
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`cfs-number-${summaryNumber}`}>CFS Number *</Label>
            <Input
              id={`cfs-number-${summaryNumber}`}
              placeholder="Enter CFS Number"
              value={summaryData.cfs_number}
              onChange={(e) => handleChange('cfs_number', e.target.value)}
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
                    !summaryData.date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {summaryData.date ? format(summaryData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={summaryData.date || undefined}
                  onSelect={(date) => handleChange('date', date)}
                  disabled={(date) => date > new Date()}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor={`chief-complaint-${summaryNumber}`}>Chief Complaint</Label>
          <Textarea
            id={`chief-complaint-${summaryNumber}`}
            placeholder="Enter patient's chief complaint"
            value={summaryData.chief_complaint}
            onChange={(e) => handleChange('chief_complaint', e.target.value)}
            rows={3}
          />
        </div>
        
        <div className="space-y-2">
          <Label>Priority to Hospital</Label>
          <RadioGroup 
            value={summaryData.priority} 
            onValueChange={(value) => handleChange('priority', value as 'P1' | 'P2')}
            className="flex space-x-4"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="P1" id={`p1-${summaryNumber}`} />
              <Label htmlFor={`p1-${summaryNumber}`}>P1</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="P2" id={`p2-${summaryNumber}`} />
              <Label htmlFor={`p2-${summaryNumber}`}>P2</Label>
            </div>
          </RadioGroup>
        </div>
      </CardContent>
    </Card>
  );
};

export default BasicInfoCard;
