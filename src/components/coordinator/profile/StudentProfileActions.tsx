
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { UserX, FileArchive, Download } from 'lucide-react';
import { useUserDeletion } from '@/hooks/coordinator/useUserDeletion';
import { userManagementService } from '@/services/userManagement.service';
import DeleteUserDialog from '@/components/coordinator/DeleteUserDialog';
import { toast } from 'sonner';

interface StudentProfileActionsProps {
  studentId: string;
  studentName: string;
  profileId: string;
  onStudentDeleted?: () => void;
  onBackToList?: () => void;
}

const StudentProfileActions: React.FC<StudentProfileActionsProps> = ({
  studentId,
  studentName,
  profileId,
  onStudentDeleted,
  onBackToList
}) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteUser, isDeleting } = useUserDeletion();

  useEffect(() => {
    const checkAdmin = async () => {
      const adminStatus = await userManagementService.checkAdminStatus();
      setIsAdmin(adminStatus);
    };
    
    checkAdmin();
  }, []);

  const handleDeleteConfirm = async () => {
    console.log(`Deleting user: ${studentName} with profile ID: ${profileId} and student ID: ${studentId}`);
    
    if (!profileId) {
      toast.error('No profile ID available for this student');
      setShowDeleteDialog(false);
      return;
    }
    
    const success = await deleteUser(profileId, studentName);
    
    if (success) {
      console.log('User and student data deletion successful, closing dialog');
      setShowDeleteDialog(false);
      
      if (onStudentDeleted) {
        onStudentDeleted();
      }
      
      if (onBackToList) {
        onBackToList();
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:gap-3">
      <Button 
        variant="outline"
        className="w-full sm:w-auto"
      >
        <Download className="mr-2 h-4 w-4" />
        Export PDF
      </Button>
      
      <Button 
        variant="outline"
        className="w-full sm:w-auto"
      >
        <FileArchive className="mr-2 h-4 w-4" />
        Archive
      </Button>
      
      {isAdmin && (
        <Button 
          variant="destructive" 
          className="w-full sm:w-auto"
          onClick={() => setShowDeleteDialog(true)}
        >
          <UserX className="mr-2 h-4 w-4" />
          Delete User & Student Data
        </Button>
      )}
      
      <DeleteUserDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteConfirm}
        userName={studentName}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default StudentProfileActions;
