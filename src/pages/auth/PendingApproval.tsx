
import React from 'react';
import { ArrowLeft, CheckCircle, UserCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import { Link } from 'react-router-dom';

const PendingApproval = () => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
            <UserCheck className="h-6 w-6 text-primary-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">Account Pending Approval</CardTitle>
          <CardDescription>
            Your account has been created but requires administrator approval
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="rounded-md bg-amber-50 p-4 border border-amber-200">
            <div className="flex">
              <div className="flex-shrink-0">
                <CheckCircle className="h-5 w-5 text-amber-400" aria-hidden="true" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-amber-700">
                  Your registration was successful, but an administrator needs to assign you a role before you can access the system.
                </p>
              </div>
            </div>
          </div>
          
          <div className="space-y-2 text-sm text-gray-600">
            <p>What happens next:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>An administrator will review your account</li>
              <li>You will be assigned a role as either a student, coordinator, or admin</li>
              <li>Once approved, you can log in with your credentials</li>
            </ol>
          </div>
          
          <div className="pt-2 space-y-3">
            <Button 
              variant="outline" 
              className="w-full"
              onClick={handleSignOut}
            >
              Sign Out
            </Button>
            
            <Link to="/login" className="block text-center text-sm text-primary-600 hover:text-primary-700">
              <span className="flex items-center justify-center">
                <ArrowLeft className="h-3 w-3 mr-1" />
                Back to login
              </span>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PendingApproval;
