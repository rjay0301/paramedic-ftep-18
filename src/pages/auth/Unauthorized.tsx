
import React from 'react';
import { ArrowLeft, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';

const Unauthorized = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const goToDashboard = () => {
    // Redirect based on user role
    if (user?.role === 'coordinator') {
      navigate('/coordinator');
    } else if (user?.role === 'student') {
      navigate('/dashboard');
    } else {
      // If no role assigned, just go to login
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <ShieldAlert className="h-6 w-6 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-semibold">Access Denied</CardTitle>
          <CardDescription>
            {!user?.role 
              ? "Your account doesn't have a role assigned yet" 
              : "You don't have permission to access this resource"}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="rounded-md bg-red-50 p-4 border border-red-200">
            <div className="flex">
              <div className="ml-3">
                <p className="text-sm text-red-700">
                  {!user?.role ? (
                    <>
                      You are logged in as <strong>{user?.name || user?.email}</strong>, but an administrator 
                      needs to assign a role to your account before you can access the application.
                      Please contact your administrator.
                    </>
                  ) : (
                    <>
                      You are logged in as <strong>{user?.name || user?.email}</strong> with the role <strong>{user?.role || 'unknown'}</strong>, 
                      which doesn't have permission to access the page you requested.
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 space-y-3">
            {user?.role && (
              <Button 
                variant="default" 
                className="w-full"
                onClick={goToDashboard}
              >
                Go to Dashboard
              </Button>
            )}
            
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => navigate('/login?logout=true')}
            >
              Sign Out & Log In as Different User
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Unauthorized;
