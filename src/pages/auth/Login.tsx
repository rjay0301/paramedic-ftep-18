
import React, { useEffect, useState } from 'react';
import { ArrowRight, Info, Shield } from 'lucide-react';
import AuthHeader from '@/components/auth/AuthHeader';
import LoginForm from '@/components/auth/LoginForm';
import SignupForm from '@/components/auth/SignupForm';
import ErrorDisplay from '@/components/auth/ErrorDisplay';
import PendingApprovalAlert from '@/components/auth/PendingApprovalAlert';
import { useLoginState } from '@/hooks/useLoginState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { clearAuthData } from '@/contexts/auth/authUtils';
import { useInitialAdminSetup } from '@/hooks/admin/useInitialAdminSetup';
import { useAuth } from '@/contexts/auth';
const Login = () => {
  const navigate = useNavigate();
  const { user, session, isLoading: authLoading } = useAuth();
  const { needsSetup, checkIfAdminExists } = useInitialAdminSetup();
  const [showAdminSetup, setShowAdminSetup] = useState(false);
  const {
    isLogin,
    isLoading,
    authError,
    pendingApproval,
    handleSignIn,
    handleSignUp,
    toggleForm
  } = useLoginState();

  // Clean up auth state only when needed (not on regular visits)
  useEffect(() => {
    const cleanupAuthState = async () => {
      try {
        // Generate a browser instance ID for debugging if we don't have one
        if (!localStorage.getItem('ftep_browser_instance_id')) {
          const uniqueId = Math.random().toString(36).substring(2, 15);
          localStorage.setItem('ftep_browser_instance_id', uniqueId);
          console.log(`Login page - New browser instance: ${uniqueId}`);
        }
        
        // Get browser instance ID for logging
        const browserInstanceId = localStorage.getItem('ftep_browser_instance_id')?.slice(0, 8) || 'unknown';
        console.log(`[Browser ${browserInstanceId}] Login page mounted`);
        
        // Only check if we were explicitly told to logout (via URL param)
        const urlParams = new URLSearchParams(window.location.search);
        const shouldLogout = urlParams.get('logout') === 'true';
        
        if (shouldLogout) {
          // If logout param is present, clear session
          await supabase.auth.signOut();
          clearAuthData();
          console.log(`[Browser ${browserInstanceId}] Login page - Signed out existing session via URL param`);
        }
        
        // Check if we need admin setup
        const needsAdminSetup = await checkIfAdminExists();
        setShowAdminSetup(needsAdminSetup);
      } catch (error) {
        console.warn('Login page - Error cleaning up auth state:', error);
      }
    };
    
    cleanupAuthState();
    
    // Track page visit for debugging
    console.log('Login page visit:', new Date().toISOString());
  }, []);

  // Redirect authenticated users to their dashboards
  useEffect(() => {
    if (authLoading) return;
    if (user && session && user.status === 'active' && user.role) {
      const target = user.role === 'admin' ? '/admin' : user.role === 'coordinator' ? '/coordinator' : '/dashboard';
      console.log(`Login: Redirecting authenticated user with role ${user.role} to ${target}`);
      navigate(target, { replace: true });
    }
  }, [user, session, authLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-blue-50 to-primary-100">
      <div className="w-full max-w-md p-8 mx-4 glass-panel rounded-xl animate-scale-in shadow-lg">
        <AuthHeader 
          title="Paramedic FTEP" 
          subtitle={
            pendingApproval 
              ? "Your account is pending approval" 
              : isLogin 
                ? "Sign in to access your forms" 
                : "Create a new account"
          } 
        />
        
        <ErrorDisplay error={null} authError={authError} />
        
        {pendingApproval ? (
          <PendingApprovalAlert />
        ) : (
          <>
            {showAdminSetup && (
              <Alert className="mb-6 bg-blue-50 border-blue-200">
                <Shield className="h-4 w-4 text-blue-500" />
                <AlertTitle>System Setup Required</AlertTitle>
                <AlertDescription className="text-sm text-gray-600">
                  No administrator account detected. Set up the first administrator to manage users.
                </AlertDescription>
                <Button 
                  className="w-full mt-2" 
                  variant="outline"
                  onClick={() => navigate('/admin-setup')}
                >
                  Create Administrator Account
                </Button>
              </Alert>
            )}
            
            <Alert className="mb-6 bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertTitle>Welcome to the FTEP Platform</AlertTitle>
              <AlertDescription className="text-sm text-gray-600">
                After registration, an administrator will assign your role in the system.
                You will be redirected to the appropriate dashboard based on your assigned role.
              </AlertDescription>
            </Alert>
            
            {isLogin ? (
              <LoginForm 
                onLogin={handleSignIn} 
                loading={isLoading} 
                error={authError} 
              />
            ) : (
              <SignupForm 
                onSignup={handleSignUp} 
                loading={isLoading} 
              />
            )}
          </>
        )}
        
        <div className="text-center mt-4">
          <button
            type="button"
            onClick={toggleForm}
            className="inline-flex items-center text-primary-600 hover:text-primary-800 text-sm"
          >
            {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
            <ArrowRight size={16} className="ml-1" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
