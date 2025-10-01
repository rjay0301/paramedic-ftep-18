
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import LoadingScreen from './common/LoadingScreen';
import { UserRole } from '@/contexts/auth/types';
import { toast } from 'sonner';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading, session } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen message="Verifying your access..." timeout={8000} />;
  }

  if (!user || !session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (user.status !== 'active') {
    if (user.status === 'error') {
      toast.error('There was an error loading your profile. Please try signing in again.');
    } else if (user.status === 'pending') {
      toast.warning('Your account is pending administrator approval.');
    }
    return <Navigate to="/login" replace />;
  }

  if (!user.role) {
    toast.warning('Your account role has not been assigned yet. Please contact an administrator.');
    return <Navigate to="/unauthorized" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0 && user.role) {
    if (!allowedRoles.includes(user.role as UserRole)) {
      const redirectPath = user.role === 'admin' ? '/admin'
        : user.role === 'coordinator' ? '/coordinator'
        : '/dashboard';

      if (location.pathname !== redirectPath) {
        toast.info(`Redirecting to your ${user.role} dashboard`);
      }

      return <Navigate to={redirectPath} replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
