import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/auth';
import Dashboard from '@/pages/Dashboard';
import Login from '@/pages/auth/Login';
import Unauthorized from '@/pages/auth/Unauthorized';
import PendingApproval from '@/pages/auth/PendingApproval';
import FirstTimeSetup from '@/pages/auth/FirstTimeSetup';
import Profile from '@/pages/Profile';
import NotFound from '@/pages/NotFound';
import ProtectedRoute from '@/components/ProtectedRoute';
import ObservationalPhaseForm from '@/pages/phases/ObservationalPhaseForm';
import PhaseForm from '@/pages/phases/PhaseForm';
import RuralAmbulanceForm from '@/pages/phases/rural-ambulance';
import AssignmentsPage from '@/pages/phases/assignments';
import AssignmentDetailsPage from '@/pages/phases/assignments/details';
import InstructionalEvaluationPage from '@/pages/phases/instructional-evaluation';
import InstructionalSummariesPage from '@/pages/phases/instructional-summaries';
import IndependentEvaluationPage from '@/pages/phases/independent-evaluation';
import IndependentSummariesPage from '@/pages/phases/independent-summaries';
import DeclarationPage from '@/pages/phases/declaration';
import ReflectivePracticePage from '@/pages/phases/reflective';
import FinalEvaluationPage from '@/pages/phases/final-evaluation';
import CoordinatorPortal from '@/pages/CoordinatorPortal';
import UserProfile from '@/pages/UserProfile';
import AdminDashboard from '@/pages/admin/AdminDashboard';

const AppRoutes: React.FC = () => {
  const { isLoading, user } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
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
  );
};

export default AppRoutes;
