
import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAdminUsers } from '@/hooks/admin/useAdminUsers';
import { User, Search, Check, X, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import CreateUserDialog from './CreateUserDialog';

const UsersManagement: React.FC = () => {
  const { users, loading, error, refreshUsers, updateUserRole, updateUserStatus } = useAdminUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [createUserDialogOpen, setCreateUserDialogOpen] = useState(false);

  // Filter users based on search term
  const filteredUsers = users.filter(user => 
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await updateUserRole(userId, newRole);
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error('Failed to update user role');
      console.error('Error updating user role:', error);
    }
  };

  const handleStatusChange = async (userId: string, newStatus: 'active' | 'inactive') => {
    try {
      await updateUserStatus(userId, newStatus);
      toast.success(`User status updated to ${newStatus}`);
    } catch (error) {
      toast.error('Failed to update user status');
      console.error('Error updating user status:', error);
    }
  };

  const handleCreateUserSuccess = () => {
    setCreateUserDialogOpen(false);
    refreshUsers();
    toast.success('User created successfully');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading users...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">Error loading users: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle>User Management</CardTitle>
          <Button 
            onClick={() => setCreateUserDialogOpen(true)} 
            className="bg-green-600 hover:bg-green-700"
          >
            <UserPlus size={16} className="mr-2" />
            Create User
          </Button>
        </CardHeader>
        <CardContent>
          <div className="flex items-center mb-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search users..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="ml-2"
              onClick={refreshUsers}
            >
              Refresh
            </Button>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[150px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-gray-500" />
                          {user.full_name || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>{user.email || 'N/A'}</TableCell>
                      <TableCell>
                        <select
                          className="border rounded px-2 py-1 text-sm bg-white"
                          value={user.role || ''}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        >
                          <option value="">Not Assigned</option>
                          <option value="student">Student</option>
                          <option value="coordinator">Coordinator</option>
                          <option value="admin">Admin</option>
                        </select>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                            user.status === 'active' ? 'bg-green-500' : 'bg-red-500'
                          }`}></span>
                          {user.status || 'N/A'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {user.status === 'active' ? (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="h-8 text-red-500 border-red-200 hover:bg-red-50"
                            onClick={() => handleStatusChange(user.id, 'inactive')}
                          >
                            <X size={16} className="mr-1" />
                            Deactivate
                          </Button>
                        ) : (
                          <Button 
                            size="sm" 
                            variant="outline"
                            className="h-8 text-green-500 border-green-200 hover:bg-green-50"
                            onClick={() => handleStatusChange(user.id, 'active')}
                          >
                            <Check size={16} className="mr-1" />
                            Activate
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                      No users found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <CreateUserDialog
        open={createUserDialogOpen}
        onClose={() => setCreateUserDialogOpen(false)}
        onSuccess={handleCreateUserSuccess}
      />
    </div>
  );
};

export default UsersManagement;
