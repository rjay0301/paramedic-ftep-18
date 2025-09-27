
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const PendingApprovalAlert = () => {
  return (
    <Alert className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
      <div className="flex">
        <AlertCircle className="h-5 w-5 text-yellow-500 mr-2" />
        <div>
          <AlertTitle className="font-medium text-yellow-700">Account Pending Approval</AlertTitle>
          <AlertDescription className="text-sm text-yellow-600">
            <p>Your account is currently pending administrator approval. Once approved, you'll be able to log in.</p>
            <p className="mt-2">After approval, an administrator will assign you a role as either:</p>
            <ul className="list-disc pl-5 mt-1">
              <li>Student - access to forms and training materials</li>
              <li>Coordinator - access to student management and oversight tools</li>
            </ul>
            <p className="mt-2">Please check back later or contact an administrator for assistance.</p>
          </AlertDescription>
        </div>
      </div>
    </Alert>
  );
};

export default PendingApprovalAlert;
