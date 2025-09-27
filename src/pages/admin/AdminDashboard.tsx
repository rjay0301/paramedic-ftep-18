
import React, { useState } from 'react';
import { useAuth } from '@/contexts/auth';
import { Navigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import UsersManagement from '@/components/admin/UsersManagement';
import AdminAnalytics from '@/components/admin/AdminAnalytics';
import StudentProgressMonitor from '@/components/admin/StudentProgressMonitor';
import AuditLogsViewer from '@/components/admin/AuditLogsViewer';
import DatabaseRecordsManager from '@/components/admin/DatabaseRecordsManager';
import { toast } from 'sonner';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('users');
  
  // Only administrators can access this page
  if (!user || user.role !== 'admin') {
    toast.error("Admin access required");
    return <Navigate to="/unauthorized" replace />;
  }
  
  return (
    <AdminLayout 
      appName="FTEP Admin Portal" 
      adminName={user?.name || 'Admin'}
      adminRole="Administrator"
      activeTab={activeTab}
      setActiveTab={setActiveTab}
    >
      {activeTab === 'users' && <UsersManagement />}
      {activeTab === 'analytics' && <AdminAnalytics />}
      {activeTab === 'progress' && <StudentProgressMonitor />}
      {activeTab === 'audit-logs' && <AuditLogsViewer />}
      {activeTab === 'database' && <DatabaseRecordsManager />}
    </AdminLayout>
  );
};

export default AdminDashboard;
