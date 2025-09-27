
import React from 'react';
import { Student } from '@/types/coordinator';
import StudentProfileContainer from './profile/StudentProfileContainer';
import { useStudentProfileData } from '@/hooks/coordinator/useStudentProfileData';
import { usePdfGeneration } from '@/hooks/coordinator/usePdfGeneration';

interface StudentProfileProps {
  student: Student;
  isLoading: boolean;
  onBackToList: () => void;
  onSaveChanges: (student: Student) => Promise<boolean>;
  onGeneratePdf: (formId?: string) => void;
  onEditProfile: (studentId: string) => void;
  onRecalculateProgress?: (studentId: string) => Promise<void>;
}

const StudentProfile: React.FC<StudentProfileProps> = ({ 
  student, 
  isLoading: parentIsLoading, 
  onBackToList, 
  onSaveChanges,
  onGeneratePdf,
  onEditProfile,
  onRecalculateProgress
}) => {
  const {
    formData,
    isLoading,
    handleInputChange,
    handleSaveChanges
  } = useStudentProfileData(student);

  const {
    isPdfGenerating,
    handleGeneratePhasePdf,
    handleFormPdfGeneration
  } = usePdfGeneration();

  return (
    <StudentProfileContainer
      student={student}
      isLoading={isLoading || parentIsLoading || isPdfGenerating}
      isPdfGenerating={isPdfGenerating}
      onBackToList={onBackToList}
      onSaveChanges={onSaveChanges}
      onEditProfile={onEditProfile}
      onRecalculateProgress={onRecalculateProgress ? () => onRecalculateProgress(student.id) : undefined}
      onGeneratePhasePdf={(phaseType) => handleGeneratePhasePdf(student, phaseType)}
      onGenerateFormPdf={(formId) => formId ? onGeneratePdf(formId) : undefined}
      formData={formData}
      onInputChange={handleInputChange}
      handleSaveChanges={handleSaveChanges}
    />
  );
};

export default StudentProfile;
