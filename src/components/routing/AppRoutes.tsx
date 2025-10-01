import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import LoadingScreen from '@/components/common/LoadingScreen';
import ProtectedRoute from '@/components/ProtectedRoute';

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Login = lazy(() => import('@/pages/auth/Login'));
const Unauthorized = lazy(() => import('@/pages/auth/Unauthorized'));
const PendingApproval = lazy(() => import('@/pages/auth/PendingApproval'));
const FirstTimeSetup = lazy(() => import('@/pages/auth/FirstTimeSetup'));
const Profile = lazy(() => import('@/pages/Profile'));
const NotFound = lazy(() => import('@/pages/NotFound'));
const ObservationalPhaseForm = lazy(() => import('@/pages/phases/ObservationalPhaseForm'));
const PhaseForm = lazy(() => import('@/pages/phases/PhaseForm'));
const RuralAmbulanceForm = lazy(() => import('@/pages/phases/rural-ambulance'));
const AssignmentsPage = lazy(() => import('@/pages/phases/assignments'));
const AssignmentDetailsPage = lazy(() => import('@/pages/phases/assignments/details'));
const InstructionalEvaluationPage = lazy(() => import('@/pages/phases/instructional-evaluation'));
const InstructionalSummariesPage = lazy(() => import('@/pages/phases/instructional-summaries'));
const IndependentEvaluationPage = lazy(() => import('@/pages/phases/independent-evaluation'));
const IndependentSummariesPage = lazy(() => import('@/pages/phases/independent-summaries'));
const DeclarationPage = lazy(() => import('@/pages/phases/declaration'));
const ReflectivePracticePage = lazy(() => import('@/pages/phases/reflective'));
const FinalEvaluationPage = lazy(() => import('@/pages/phases/final-evaluation'));
const CoordinatorPortal = lazy(() => import('@/pages/CoordinatorPortal'));
const UserProfile = lazy(() => import('@/pages/UserProfile'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));

const AppRoutes: React.FC = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  // Smart redirect based on user role
  const getDefaultRoute = () => {
    if (!user) return '/login';
    if (user.role === 'admin') return '/admin';
    if (user.role === 'coordinator') return '/coordinator';
    return '/dashboard';
  };

  return (
    <Suspense fallback={<LoadingScreen message="Loading page..." />}>
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/pending-approval" element={<PendingApproval />} />
        <Route path="/admin-setup" element={<FirstTimeSetup />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/phases/assignments" element={<AssignmentsPage />} />
          <Route path="/phases/assignments/:id" element={<AssignmentDetailsPage />} />
          <Route path="/phases/rural-ambulance" element={<RuralAmbulanceForm />} />
          <Route path="/phases/observation" element={<ObservationalPhaseForm />} />
          <Route path="/phases/instructional" element={<PhaseForm />} />
          <Route path="/phases/instructional-evaluation" element={<InstructionalEvaluationPage />} />
          <Route path="/phases/instructional-summaries" element={<InstructionalSummariesPage />} />
          <Route path="/phases/independent" element={<PhaseForm />} />
          <Route path="/phases/independent-evaluation" element={<IndependentEvaluationPage />} />
          <Route path="/phases/independent-summaries" element={<IndependentSummariesPage />} />
          <Route path="/phases/declaration" element={<DeclarationPage />} />
          <Route path="/phases/reflective" element={<ReflectivePracticePage />} />
          <Route path="/phases/final-evaluation" element={<FinalEvaluationPage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Coordinator routes */}
        <Route element={<ProtectedRoute allowedRoles={["coordinator"]} />}>
          <Route path="/coordinator" element={<CoordinatorPortal />} />
          <Route path="/coordinator/students/:id" element={<UserProfile />} />
        </Route>

        {/* Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
          <Route path="/admin" element={<AdminDashboard />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
