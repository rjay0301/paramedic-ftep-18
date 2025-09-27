
import React from 'react';
import { InstructionalPhaseData } from '@/types';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardHeader, CardContent, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import SignatureField from '@/components/common/SignatureField';

interface InstructionalShiftFormProps {
  shiftData: InstructionalPhaseData;
  handleChange: (field: keyof InstructionalPhaseData, value: any) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  shiftNumber: number;
  isSubmitting: boolean;
}

const InstructionalShiftForm: React.FC<InstructionalShiftFormProps> = ({
  shiftData,
  handleChange,
  handleSubmit,
  handleSaveDraft,
  shiftNumber,
  isSubmitting
}) => {
  return <div className="space-y-6">
      {/* Shift Information Section */}
      <Card>
        <CardHeader>
          <CardTitle>Shift {shiftNumber} Information</CardTitle>
          <CardDescription>
            Fill in the required details about your shift
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`ftp-name-${shiftNumber}`}>FTP Name *</Label>
              <Input id={`ftp-name-${shiftNumber}`} placeholder="Enter FTP name" value={shiftData.ftp_name} onChange={e => handleChange('ftp_name', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`ftp-corp-id-${shiftNumber}`}>FTP Corp ID *</Label>
              <Input id={`ftp-corp-id-${shiftNumber}`} placeholder="Enter FTP Corp ID" value={shiftData.ftp_corp_id} onChange={e => handleChange('ftp_corp_id', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`ftp-role-${shiftNumber}`}>FTP Role *</Label>
              <Select value={shiftData.ftp_role} onValueChange={value => handleChange('ftp_role', value)}>
                <SelectTrigger id={`ftp-role-${shiftNumber}`}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="driver">Driver</SelectItem>
                  <SelectItem value="attendant">Attendant</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`crew-name-${shiftNumber}`}>Crew Name *</Label>
              <Input id={`crew-name-${shiftNumber}`} placeholder="Enter crew name" value={shiftData.crew_name} onChange={e => handleChange('crew_name', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`crew-corp-id-${shiftNumber}`}>Crew Corp ID *</Label>
              <Input id={`crew-corp-id-${shiftNumber}`} placeholder="Enter crew Corp ID" value={shiftData.crew_corp_id} onChange={e => handleChange('crew_corp_id', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !shiftData.shift_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shiftData.shift_date ? format(new Date(shiftData.shift_date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="single" 
                    selected={shiftData.shift_date ? new Date(shiftData.shift_date) : undefined} 
                    onSelect={date => handleChange('shift_date', date?.toISOString() || null)} 
                    disabled={date => date > new Date()} 
                    initialFocus 
                    className="p-3 pointer-events-auto" 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`alpha-unit-${shiftNumber}`}>Alpha Unit *</Label>
              <Input id={`alpha-unit-${shiftNumber}`} placeholder="Enter alpha unit" value={shiftData.alpha_unit} onChange={e => handleChange('alpha_unit', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`hub-${shiftNumber}`}>Hub *</Label>
              <Input id={`hub-${shiftNumber}`} placeholder="Enter hub" value={shiftData.hub} onChange={e => handleChange('hub', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`patients-${shiftNumber}`}>Number of Patients *</Label>
              <Input id={`patients-${shiftNumber}`} type="number" min="0" placeholder="Number of patients" value={shiftData.number_of_patients.toString()} onChange={e => handleChange('number_of_patients', parseInt(e.target.value) || 0)} />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Objectives and Feedback Section */}
      <Card>
        <CardHeader>
          <CardTitle>Objectives and Feedback</CardTitle>
          <CardDescription>
            Document learning objectives and improvement areas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`student-objective-${shiftNumber}`}>Student Objective *</Label>
            <Textarea id={`student-objective-${shiftNumber}`} placeholder="What were your objectives for this shift?" value={shiftData.student_objective} onChange={e => handleChange('student_objective', e.target.value)} rows={3} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`ftp-objective-${shiftNumber}`}>FTP Objective *</Label>
            <Textarea id={`ftp-objective-${shiftNumber}`} placeholder="What were the FTP objectives for this shift?" value={shiftData.ftp_objective} onChange={e => handleChange('ftp_objective', e.target.value)} rows={3} />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor={`feedback-${shiftNumber}`}>Feedback/Improvement *</Label>
            <Textarea id={`feedback-${shiftNumber}`} placeholder="Areas of best performance and areas needing improvement..." value={shiftData.feedback} onChange={e => handleChange('feedback', e.target.value)} rows={4} />
          </div>
        </CardContent>
      </Card>
      
      {/* Verification Section */}
      <Card>
        <CardHeader>
          <CardTitle>Verification</CardTitle>
          <CardDescription>
            Production information and signature
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`production-name-${shiftNumber}`}>Delta/Production Name *</Label>
              <Input id={`production-name-${shiftNumber}`} placeholder="Enter production name" value={shiftData.production_name} onChange={e => handleChange('production_name', e.target.value)} />
            </div>
            
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !shiftData.production_date && "text-muted-foreground")}>
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shiftData.production_date ? format(new Date(shiftData.production_date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar 
                    mode="single" 
                    selected={shiftData.production_date ? new Date(shiftData.production_date) : undefined} 
                    onSelect={date => handleChange('production_date', date?.toISOString() || null)} 
                    disabled={date => date > new Date()} 
                    initialFocus 
                    className="p-3 pointer-events-auto" 
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          
          <div className="pt-4">
            <SignatureField label="Delta/Production Signature *" value={shiftData.signature} onChange={value => handleChange('signature', value)} required={true} />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSubmitting}>
            Save Draft
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Shift'}
          </Button>
        </CardFooter>
      </Card>
    </div>;
};

export default InstructionalShiftForm;
