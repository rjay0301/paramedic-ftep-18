
import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/auth';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Student } from '@/types/coordinator';
import { useCoordinatorData } from '@/hooks/useCoordinatorData';
import { useStudentOperations } from '@/hooks/useStudentOperations';
import CoordinatorLayout from '@/components/coordinator/CoordinatorLayout';
import CoordinatorDashboard from '@/components/coordinator/CoordinatorDashboard';
import StudentList from '@/components/coordinator/StudentList';
import StudentProfile from '@/components/coordinator/StudentProfile';
import { PhaseType } from '@/services/pdf';

const CoordinatorPortal: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeStudent, setActiveStudent] = useState<Student | null>(null);
  
  console.log('CoordinatorPortal - Current user:', user);
  
  const { 
    students, 
    phases, 
    recentActivities, 
    isLoading: isDataLoading, 
    setStudents, 
    refreshStudentData 
  } = useCoordinatorData(user?.id, user?.role);
  
  const { 
    isLoading: isOperationLoading, 
    handleSaveStudentChanges, 
    handleGeneratePdf, 
    handleEditProfile,
    handleRecalculateProgress
  } = useStudentOperations(students, setStudents);

  // Listen for form submission events
  useEffect(() => {
    const handleFormSubmitted = () => {
      // Add a small delay to ensure database has updated
      setTimeout(() => {
        refreshStudentData();
      }, 1000);
    };
    
    // Add event listener
    window.addEventListener('formSubmitted', handleFormSubmitted);
    
    // Remove event listener on cleanup
    return () => {
      window.removeEventListener('formSubmitted', handleFormSubmitted);
    };
  }, [refreshStudentData]);
  
  // Initial data load with auto-refresh
  useEffect(() => {
    if (user?.role === 'coordinator') {
      // Set up periodic refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        refreshStudentData();
      }, 30000);
      
      return () => clearInterval(refreshInterval);
    }
  }, [user?.role, refreshStudentData]);
  
  console.log('CoordinatorPortal - Loaded students:', students);

  useEffect(() => {
    if (user && user.role !== 'coordinator') {
      console.log('Access denied - redirecting user with role:', user.role);
      toast({
        title: "Access Denied",
        description: "Only coordinators can access this page.",
        variant: "destructive"
      });
      navigate('/dashboard');
    }
  }, [user, navigate, toast]);

  const handleViewStudent = (student: Student) => {
    console.log('Viewing student:', student);
    setActiveStudent(student);
    setActiveTab('studentProfile');
  };

  const handleBackToList = () => {
    setActiveStudent(null);
    setActiveTab('students');
    refreshStudentData();
  };
  
  const handleStudentProgressRecalculation = async (studentId: string) => {
    await handleRecalculateProgress(studentId);
    refreshStudentData();
  };

  // Wrapper functions to match the expected function signatures
  const handleStudentPdfGeneration = (studentId: string) => {
    if (activeStudent) {
      handleGeneratePdf('phase', studentId, 'complete' as PhaseType);
    }
  };

  const handleFormPdfGeneration = (formId?: string) => {
    if (formId) {
      handleGeneratePdf('form', formId);
    }
  };

  if (!user || user.role !== 'coordinator') {
    return null;
  }

  return (
    <CoordinatorLayout
      appName="FTEP Workbook"
      coordinatorName={user?.name || "Program Coordinator"}
      coordinatorRole="Program Coordinator"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {isDataLoading ? (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading data...</p>
          </div>
        </div>
      ) : (
        <>
          {activeTab === 'dashboard' && (
            <CoordinatorDashboard 
              students={students}
              phases={phases}
              recentActivities={recentActivities}
            />
          )}

          {activeTab === 'students' && !activeStudent && (
            <StudentList 
              students={students}
              phases={phases}
              onViewStudent={handleViewStudent}
              onGeneratePdf={handleStudentPdfGeneration}
            />
          )}

          {activeTab === 'studentProfile' && activeStudent && (
            <StudentProfile 
              student={activeStudent}
              isLoading={isOperationLoading}
              onBackToList={handleBackToList}
              onSaveChanges={handleSaveStudentChanges}
              onGeneratePdf={handleFormPdfGeneration}
              onEditProfile={handleEditProfile}
              onRecalculateProgress={handleStudentProgressRecalculation}
            />
          )}
        </>
      )}
    </CoordinatorLayout>
  );
};

export default CoordinatorPortal;
