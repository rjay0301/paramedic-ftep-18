
import React from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Loader2, AlertCircle } from 'lucide-react';

interface DeleteUserDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName: string;
  isDeleting: boolean;
}

const DeleteUserDialog: React.FC<DeleteUserDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  userName,
  isDeleting
}) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={isOpen => {
      if (!isDeleting && !isOpen) {
        onClose();
      }
    }}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Delete User Account
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base">
            Are you sure you want to delete the account for <span className="font-semibold">{userName}</span>?
            <br /><br />
            This action will permanently remove all of the user's data, including:
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li>Authentication credentials</li>
              <li>Profile information</li>
              <li>Student records and associated data</li>
              <li>All submitted forms and drafts</li>
              <li>Progress tracking data</li>
              <li>All evaluation records</li>
              <li>Case summaries</li>
              <li>Authentication records</li>
            </ul>
            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-md text-amber-800 text-sm">
              <strong>Warning:</strong> This action cannot be undone and will permanently erase all user data from both the database and authentication system.
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
            disabled={isDeleting}
            className="bg-destructive hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete User'
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
