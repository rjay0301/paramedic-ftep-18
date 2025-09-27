
import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/auth';
import { useAssignmentDetails } from '@/hooks/assignments/useAssignmentDetails';

// Import components
import AssignmentContent from './components/AssignmentContent';
import AssignmentActions from './components/AssignmentActions';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';

const AssignmentDetails: React.FC = () => {
  const { assignmentKey } = useParams<{ assignmentKey: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const { 
    assignments,
    isSaving,
    isSubmitting,
    isDisabled,
    isDeleting,
    showDeleteDialog,
    submittedAssignments,
    fetchAssignmentData,
    handleInputChange,
    handleSave,
    handleSubmit,
    handleDelete,
    confirmDelete,
    cancelDelete,
    setShowDeleteDialog
  } = useAssignmentDetails(assignmentKey, navigate);

  useEffect(() => {
    if (user && assignmentKey) {
      fetchAssignmentData();
    }
  }, [user, assignmentKey]);

  const handleGoBack = () => {
    navigate('/phases/assignments');
  };

  const handleOpenChangeDialog = (open: boolean) => {
    if (!open) cancelDelete();
    setShowDeleteDialog(open);
  };

  if (!assignmentKey || !assignments[assignmentKey]) {
    return (
      <div className="container mx-auto p-4">
        <h2 className="text-xl font-bold mb-4">Assignment Not Found</h2>
        <p>The requested assignment was not found.</p>
        <Button onClick={handleGoBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Assignments
        </Button>
      </div>
    );
  }

  const isSubmitted = submittedAssignments.includes(assignmentKey);
  const isEmpty = !assignments[assignmentKey].content || assignments[assignmentKey].content.trim() === '';

  return (
    <div className="container mx-auto p-4">
      <Card className="max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
          <Button variant="ghost" onClick={handleGoBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h2 className="text-2xl font-bold">Assignment {assignmentKey.replace('assignment', '')}</h2>
        </CardHeader>
        <Separator />
        
        <CardContent className="space-y-4 py-6">
          <AssignmentContent 
            assignmentKey={assignmentKey}
            value={assignments[assignmentKey].content}
            isSubmitted={isSubmitted}
            onChange={handleInputChange}
          />
        </CardContent>
        
        <CardFooter className="pt-0">
          <AssignmentActions 
            isSaving={isSaving}
            isSubmitting={isSubmitting}
            isSubmitted={isSubmitted}
            isDisabled={isEmpty}
            onSave={handleSave}
            onSubmit={handleSubmit}
            onDelete={handleDelete}
          />
        </CardFooter>
      </Card>
      
      <DeleteConfirmationDialog 
        isOpen={showDeleteDialog}
        isDeleting={isDeleting}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
        onOpenChange={handleOpenChangeDialog}
      />
    </div>
  );
};

export default AssignmentDetails;
