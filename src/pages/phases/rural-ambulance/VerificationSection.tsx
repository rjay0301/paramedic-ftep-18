
import React from 'react';
import { format } from 'date-fns';
import { Calendar, Save, Send } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardHeader, CardContent, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import SignatureField from "@/components/common/SignatureField";
import { ShiftData } from './types';

interface VerificationSectionProps {
  shiftData: ShiftData;
  handleChange: (field: keyof ShiftData, value: any) => void;
  shiftNumber: number;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  isSubmitting: boolean;
}

const VerificationSection: React.FC<VerificationSectionProps> = ({
  shiftData,
  handleChange,
  shiftNumber,
  handleSubmit,
  handleSaveDraft,
  isSubmitting,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Production/Delta Verification</CardTitle>
        <CardDescription>
          Please complete the verification details.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`productionName-${shiftNumber}`}>Production/Delta Name *</Label>
            <Input 
              id={`productionName-${shiftNumber}`}
              value={shiftData.productionName} 
              onChange={(e) => handleChange('productionName', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`productionCorpId-${shiftNumber}`}>Corp ID *</Label>
            <Input 
              id={`productionCorpId-${shiftNumber}`}
              value={shiftData.productionCorpId} 
              onChange={(e) => handleChange('productionCorpId', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !shiftData.productionDate && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {shiftData.productionDate ? format(shiftData.productionDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={shiftData.productionDate || undefined}
                  onSelect={(date) => handleChange('productionDate', date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        
        <div className="space-y-2 mt-4">
          <Label>Production Signature *</Label>
          <SignatureField
            value={shiftData.signature}
            onChange={(value) => handleChange('signature', value)}
            required
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-end space-x-3">
        <Button 
          variant="outline" 
          className="flex items-center"
          onClick={handleSaveDraft}
          disabled={isSubmitting}
        >
          <Save className="mr-2 h-4 w-4" />
          Save Draft
        </Button>
        <Button 
          className="flex items-center"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <Send className="mr-2 h-4 w-4" />
          Submit
        </Button>
      </CardFooter>
    </Card>
  );
};

export default VerificationSection;
