
import React, { useState } from 'react';
import { Student } from '@/types/coordinator';
import { Card, CardContent } from '@/components/ui/card';
import ProfileHeader from './ProfileHeader';
import ProfileStats from './ProfileStats';
import EditableInfo from './EditableInfo';
import CompletedForms from './CompletedForms';
import StudentProfileActions from './StudentProfileActions';
import { PhaseType } from '@/services/pdf';
import { Button } from '@/components/ui/button';
import { RefreshCw, AlertTriangle, Check } from 'lucide-react';
import { progressDiagnosticService } from '@/services/form/utils/progressDiagnosticService';
import { toast } from 'sonner';

interface StudentProfileContainerProps {
  student: Student;
  isLoading: boolean;
  isPdfGenerating: boolean;
  onBackToList: () => void;
  onSaveChanges: (student: Student) => Promise<boolean>;
  onGenerateFormPdf: (formId: string) => void;
  onEditProfile: (studentId: string) => void;
  onGeneratePhasePdf: (phaseType: PhaseType) => void;
  onRecalculateProgress?: () => Promise<void>;
  formData: any;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSaveChanges: () => Promise<void>;
}

const StudentProfileContainer: React.FC<StudentProfileContainerProps> = ({
  student,
  isLoading,
  isPdfGenerating,
  onBackToList,
  onSaveChanges,
  onGenerateFormPdf,
  onEditProfile,
  onGeneratePhasePdf,
  onRecalculateProgress,
  formData,
  onInputChange,
  handleSaveChanges
}) => {
  const [isFixing, setIsFixing] = useState(false);
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null);

  const handleFixProgressData = async () => {
    if (!student?.profile_id) return;
    
    setIsFixing(true);
    try {
      const result = await progressDiagnosticService.fixProgressIssues(student.profile_id);
      if (result.success) {
        toast.success("Progress data has been fixed successfully");
        setDiagnosticInfo(result);
        onRecalculateProgress?.();
      } else {
        toast.error("Failed to fix progress data");
      }
    } catch (error) {
      console.error('Error fixing progress data', error);
      toast.error("An error occurred while fixing progress data");
    } finally {
      setIsFixing(false);
    }
  };

  return (
    <div className="p-3 sm:p-6">
      <div className="mb-4">
        <Button
          variant="outline" 
          size="sm"
          className="mb-4"
          onClick={onBackToList}
        >
          Back to Students
        </Button>
      </div>
      
      <Card className="mb-4 sm:mb-6">
        <ProfileHeader 
          student={student}
          isPdfGenerating={isPdfGenerating}
          onBackToList={onBackToList}
          onEditProfile={onEditProfile}
          onGeneratePhasePdf={onGeneratePhasePdf}
        />
        
        <CardContent className="p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <ProfileStats student={student} />
            
            <div className="flex space-x-2">
              <Button 
                onClick={handleFixProgressData}
                disabled={isFixing || isLoading}
                variant="outline"
                size="sm"
                className="ml-2 flex items-center gap-1"
              >
                <RefreshCw size={16} className={isFixing ? "animate-spin" : ""} />
                <span className="hidden sm:inline">{isFixing ? "Fixing..." : "Fix Progress"}</span>
              </Button>
              
              {onRecalculateProgress && (
                <Button 
                  onClick={onRecalculateProgress}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="ml-2 flex items-center gap-1"
                >
                  <RefreshCw size={16} className={isLoading ? "animate-spin" : ""} />
                  <span className="hidden sm:inline">Recalculate Progress</span>
                </Button>
              )}
            </div>
          </div>
          
          {diagnosticInfo && diagnosticInfo.fixedIssues && diagnosticInfo.fixedIssues.length > 0 && (
            <div className="bg-green-50 border border-green-100 rounded-lg p-4 mb-4">
              <h3 className="text-green-700 font-medium flex items-center">
                <Check size={16} className="mr-2" />
                Progress Issues Fixed
              </h3>
              <ul className="text-green-600 text-sm mt-2 list-disc list-inside">
                {diagnosticInfo.fixedIssues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          {diagnosticInfo && diagnosticInfo.remainingIssues && diagnosticInfo.remainingIssues.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-100 rounded-lg p-4 mb-4">
              <h3 className="text-yellow-700 font-medium flex items-center">
                <AlertTriangle size={16} className="mr-2" />
                Remaining Issues
              </h3>
              <ul className="text-yellow-600 text-sm mt-2 list-disc list-inside">
                {diagnosticInfo.remainingIssues.map((issue: string, i: number) => (
                  <li key={i}>{issue}</li>
                ))}
              </ul>
            </div>
          )}
          
          <EditableInfo 
            formData={formData}
            isLoading={isLoading}
            onInputChange={onInputChange}
            onSave={handleSaveChanges}
          />
          
          <CompletedForms 
            forms={student.forms || []}
            onGenerateFormPdf={onGenerateFormPdf}
          />
          
          <div className="mt-6">
            <StudentProfileActions 
              studentId={student.id} 
              studentName={student.name || ''} 
              profileId={student.profile_id || ''} 
              onStudentDeleted={onBackToList}
              onBackToList={onBackToList}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfileContainer;
