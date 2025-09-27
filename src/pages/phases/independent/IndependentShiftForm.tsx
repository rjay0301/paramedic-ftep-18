import React from 'react';
import { format } from 'date-fns';
import { CalendarIcon, CheckCircle, XCircle, Save, Send } from 'lucide-react';
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
import { IndependentPhaseData, TeamLeadershipAssessment } from '@/types';

interface IndependentShiftFormProps {
  shiftData: IndependentPhaseData;
  handleChange: (field: keyof IndependentPhaseData, value: any) => void;
  handleTeamLeadershipChange: (field: keyof TeamLeadershipAssessment, value: boolean | string) => void;
  handleSubmit: () => void;
  handleSaveDraft: () => void;
  shiftNumber: number;
  isSubmitting: boolean;
}

const IndependentShiftForm: React.FC<IndependentShiftFormProps> = ({
  shiftData,
  handleChange,
  handleTeamLeadershipChange,
  handleSubmit,
  handleSaveDraft,
  shiftNumber,
  isSubmitting,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Shift {shiftNumber} Information</CardTitle>
          <CardDescription>Fill in the required details about your shift</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`ftp-name-${shiftNumber}`}>FTP Name *</Label>
              <Input
                id={`ftp-name-${shiftNumber}`}
                value={shiftData.ftp_name}
                onChange={(e) => handleChange('ftp_name', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor={`ftp-corp-id-${shiftNumber}`}>Corp ID *</Label>
              <Input
                id={`ftp-corp-id-${shiftNumber}`}
                value={shiftData.ftp_corp_id}
                onChange={(e) => handleChange('ftp_corp_id', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`ftp-role-${shiftNumber}`}>FTP Role *</Label>
              <Select 
                value={shiftData.ftp_role} 
                onValueChange={(value) => handleChange('ftp_role', value)}
              >
                <SelectTrigger id={`ftp-role-${shiftNumber}`} className="h-10 md:h-auto text-base touch-manipulation">
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
              <Input
                id={`crew-name-${shiftNumber}`}
                value={shiftData.crew_name}
                onChange={(e) => handleChange('crew_name', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`crew-corp-id-${shiftNumber}`}>Crew Corp ID *</Label>
              <Input
                id={`crew-corp-id-${shiftNumber}`}
                value={shiftData.crew_corp_id}
                onChange={(e) => handleChange('crew_corp_id', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 md:h-auto text-base touch-manipulation",
                      !shiftData.shift_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shiftData.shift_date ? format(new Date(shiftData.shift_date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={shiftData.shift_date ? new Date(shiftData.shift_date) : undefined}
                    onSelect={(date) => handleChange('shift_date', date?.toISOString() || null)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`alpha-unit-${shiftNumber}`}>Alpha Unit *</Label>
              <Input
                id={`alpha-unit-${shiftNumber}`}
                value={shiftData.alpha_unit}
                onChange={(e) => handleChange('alpha_unit', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`hub-${shiftNumber}`}>Hub *</Label>
              <Input
                id={`hub-${shiftNumber}`}
                value={shiftData.hub}
                onChange={(e) => handleChange('hub', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`patients-${shiftNumber}`}>Number of Patients *</Label>
              <Input
                id={`patients-${shiftNumber}`}
                type="number"
                min="0"
                value={shiftData.number_of_patients.toString()}
                onChange={(e) => handleChange('number_of_patients', parseInt(e.target.value) || 0)}
                className="h-10 md:h-auto text-base touch-manipulation"
                pattern="[0-9]*"
                inputMode="numeric"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Objectives</CardTitle>
          <CardDescription>Document student and FTP objectives</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`student-objective-${shiftNumber}`}>Student Objective *</Label>
            <Textarea
              id={`student-objective-${shiftNumber}`}
              value={shiftData.student_objective}
              onChange={(e) => handleChange('student_objective', e.target.value)}
              rows={4}
              className="text-base touch-manipulation"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor={`ftp-objective-${shiftNumber}`}>FTP Objective *</Label>
            <Textarea
              id={`ftp-objective-${shiftNumber}`}
              value={shiftData.ftp_objective}
              onChange={(e) => handleChange('ftp_objective', e.target.value)}
              rows={4}
              className="text-base touch-manipulation"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Team Leadership Assessment</CardTitle>
          <CardDescription>Evaluate the student's leadership performance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {[
            { id: 'isTeamLeader', displayId: 'isTeamLeader', legacyId: 'performed_as_team_leader', label: 'Did the student perform as the team leader on all cases?' },
            { id: 'providedClearDirection', displayId: 'providedClearDirection', legacyId: 'provided_clear_direction', label: 'Did the student provide clear direction to his/her crew?' },
            { id: 'diagnosisAndTreatmentCorrect', displayId: 'diagnosisAndTreatmentCorrect', legacyId: 'diagnosis_and_plan_correct', label: "Were the student's provisional diagnosis and treatment plan correct?" },
            { id: 'actionsTimely', displayId: 'actionsTimely', legacyId: 'actions_timely', label: "Were the student's actions done in a timely manner?" },
            { id: 'actionsSafe', displayId: 'actionsSafe', legacyId: 'actions_safe', label: "Were the student's actions safe for the patient and the ambulance crew?" },
            { id: 'actionsAlignedWithSOPs', displayId: 'actionsAlignedWithSOPs', legacyId: 'actions_within_guidelines', label: "Were the student's actions in line with HMCAS SOPs and CPGs?" }
          ].map(({ id, displayId, legacyId, label }) => (
            <div key={id} className="p-3 border rounded-md">
              <div className="mb-2">
                <Label className="font-medium text-base">{label}</Label>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant={shiftData.team_leadership[displayId as keyof TeamLeadershipAssessment] ? 'default' : 'outline'}
                  className="flex items-center justify-center gap-1 h-10 w-full"
                  onClick={() => {
                    handleTeamLeadershipChange(displayId as keyof TeamLeadershipAssessment, true);
                    // Also update legacy field for backwards compatibility
                    if (legacyId) {
                      handleTeamLeadershipChange(legacyId as keyof TeamLeadershipAssessment, true);
                    }
                  }}
                >
                  <CheckCircle className={shiftData.team_leadership[displayId as keyof TeamLeadershipAssessment] ? 'text-white' : 'text-gray-400'} size={16} />
                  <span>Yes</span>
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant={!shiftData.team_leadership[displayId as keyof TeamLeadershipAssessment] ? 'default' : 'outline'}
                  className="flex items-center justify-center gap-1 h-10 w-full"
                  onClick={() => {
                    handleTeamLeadershipChange(displayId as keyof TeamLeadershipAssessment, false);
                    // Also update legacy field for backwards compatibility
                    if (legacyId) {
                      handleTeamLeadershipChange(legacyId as keyof TeamLeadershipAssessment, false);
                    }
                  }}
                >
                  <XCircle className={!shiftData.team_leadership[displayId as keyof TeamLeadershipAssessment] ? 'text-white' : 'text-gray-400'} size={16} />
                  <span>No</span>
                </Button>
              </div>
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor={`negative-events-${shiftNumber}`}>If any answers were "No", please describe the events below:</Label>
            <Textarea
              id={`negative-events-${shiftNumber}`}
              value={shiftData.team_leadership.comments || ''}
              onChange={(e) => {
                // Update both the new and legacy field names
                handleTeamLeadershipChange('comments', e.target.value);
                handleTeamLeadershipChange('explanation', e.target.value);
                // For backward compatibility
                handleTeamLeadershipChange('negativeEventsDescription', e.target.value);
              }}
              rows={4}
              className="text-base touch-manipulation"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg md:text-xl">Verification</CardTitle>
          <CardDescription>Sign off on the shift evaluation</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`production-name-${shiftNumber}`}>Delta/Production Name *</Label>
              <Input
                id={`production-name-${shiftNumber}`}
                value={shiftData.production_name}
                onChange={(e) => handleChange('production_name', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor={`production-corp-id-${shiftNumber}`}>Production Corp ID *</Label>
              <Input
                id={`production-corp-id-${shiftNumber}`}
                value={shiftData.production_corp_id}
                onChange={(e) => handleChange('production_corp_id', e.target.value)}
                className="h-10 md:h-auto text-base touch-manipulation"
              />
            </div>

            <div className="space-y-2">
              <Label>Production Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal h-10 md:h-auto text-base touch-manipulation",
                      !shiftData.production_date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {shiftData.production_date ? format(new Date(shiftData.production_date), "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={shiftData.production_date ? new Date(shiftData.production_date) : undefined}
                    onSelect={(date) => handleChange('production_date', date?.toISOString() || null)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                    className="p-3 pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="pt-4">
            <SignatureField
              label="FTP Signature *"
              value={shiftData.signature}
              onChange={(value) => handleChange('signature', value)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 sm:justify-between">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 sm:h-10 bg-white border border-gray-300 text-[#221F26] hover:bg-gray-50 flex items-center justify-center gap-2"
          >
            <Save size={18} />
            <span className="font-medium">Save Draft</span>
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-12 sm:h-10 bg-[#1EAEDB] hover:bg-[#1EAEDB]/90 text-white flex items-center justify-center gap-2"
          >
            <Send size={18} />
            <span className="font-medium">{isSubmitting ? 'Submitting...' : 'Submit'}</span>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default IndependentShiftForm;
