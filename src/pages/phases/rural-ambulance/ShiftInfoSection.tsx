
import React from 'react';
import { format } from 'date-fns';
import { Calendar } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Card, CardHeader, CardContent, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShiftData } from './types';

interface ShiftInfoSectionProps {
  shiftData: ShiftData;
  handleChange: (field: keyof ShiftData, value: any) => void;
  shiftNumber: number;
}

const ShiftInfoSection: React.FC<ShiftInfoSectionProps> = ({
  shiftData,
  handleChange,
  shiftNumber,
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shift {shiftNumber} Information</CardTitle>
        <CardDescription>
          Please enter details about the FTP, crew, and shift.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`ftpName-${shiftNumber}`}>FTP Name *</Label>
            <Input 
              id={`ftpName-${shiftNumber}`}
              value={shiftData.ftpName} 
              onChange={(e) => handleChange('ftpName', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`ftpCorpId-${shiftNumber}`}>FTP Corp ID *</Label>
            <Input 
              id={`ftpCorpId-${shiftNumber}`}
              value={shiftData.ftpCorpId} 
              onChange={(e) => handleChange('ftpCorpId', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label>FTP Role *</Label>
            <RadioGroup 
              value={shiftData.ftpRole} 
              onValueChange={(value) => handleChange('ftpRole', value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="driver" id={`driver-${shiftNumber}`} />
                <Label htmlFor={`driver-${shiftNumber}`}>Driver</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="attendant" id={`attendant-${shiftNumber}`} />
                <Label htmlFor={`attendant-${shiftNumber}`}>Attendant</Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`crewName-${shiftNumber}`}>Crew Name *</Label>
            <Input 
              id={`crewName-${shiftNumber}`}
              value={shiftData.crewName} 
              onChange={(e) => handleChange('crewName', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`crewCorpId-${shiftNumber}`}>Crew Corp ID *</Label>
            <Input 
              id={`crewCorpId-${shiftNumber}`}
              value={shiftData.crewCorpId} 
              onChange={(e) => handleChange('crewCorpId', e.target.value)} 
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
                    !shiftData.date && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {shiftData.date ? format(shiftData.date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <CalendarComponent
                  mode="single"
                  selected={shiftData.date || undefined}
                  onSelect={(date) => handleChange('date', date)}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`alphaUnit-${shiftNumber}`}>Alpha Unit *</Label>
            <Input 
              id={`alphaUnit-${shiftNumber}`}
              value={shiftData.alphaUnit} 
              onChange={(e) => handleChange('alphaUnit', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`hub-${shiftNumber}`}>Hub *</Label>
            <Input 
              id={`hub-${shiftNumber}`}
              value={shiftData.hub} 
              onChange={(e) => handleChange('hub', e.target.value)} 
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`numberOfPatients-${shiftNumber}`}>Number of Patients</Label>
            <Input 
              id={`numberOfPatients-${shiftNumber}`}
              type="number" 
              min="0"
              value={shiftData.numberOfPatients} 
              onChange={(e) => handleChange('numberOfPatients', e.target.value)} 
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ShiftInfoSection;
