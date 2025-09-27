
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAdminAnalytics } from '@/hooks/admin/useAdminAnalytics';

const AdminAnalytics: React.FC = () => {
  const { stats, loading } = useAdminAnalytics();

  if (loading) {
    return <div className="p-6">Loading analytics data...</div>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">System Analytics</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalUsers}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Active Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.activeStudents}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">Total Coordinators</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.totalCoordinators}</p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>User Role Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            {/* This would be replaced with an actual chart component */}
            <p className="text-gray-500">Chart visualization would go here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminAnalytics;
