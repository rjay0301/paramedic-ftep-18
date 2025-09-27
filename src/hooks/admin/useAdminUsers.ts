
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type UserRole = 'student' | 'coordinator' | 'admin' | null;
type UserStatus = 'active' | 'inactive' | 'pending' | 'error';

interface AdminUser {
  id: string;
  full_name: string | null;
  email: string | null;
  role: UserRole;
  status: UserStatus;
  created_at: string | null;
  record_type: string | null;
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch users from the admin_user_view
      const { data, error } = await supabase
        .from('admin_user_view')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }
      
      // Map role to strict union type and ensure nullable fields are handled
      const mapped = (data || []).map((u: any) => ({
        id: u.id,
        full_name: u.full_name ?? null,
        email: u.email ?? null,
        role: (u.role === 'student' || u.role === 'coordinator' || u.role === 'admin') ? (u.role as UserRole) : null,
        status: (u.status as UserStatus) ?? 'pending',
        created_at: u.created_at ?? null,
        record_type: u.record_type ?? null,
      }));

      setUsers(mapped);
    } catch (err: any) {
      console.error('Error fetching users:', err);
      setError(err.message || 'Failed to fetch users');
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  }, []);

  const updateUserRole = async (userId: string, role: string) => {
    try {
      // First update the profile role
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

      if (profileError) throw profileError;

      // Refresh user list
      await fetchUsers();
      
      return true;
    } catch (error: any) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'inactive') => {
    try {
      // Find user to determine their role
      const user = users.find(u => u.id === userId);
      if (!user) throw new Error('User not found');

      if (user.role === 'student') {
        // Update student status
        const { error } = await supabase
          .from('students')
          .update({ status })
          .eq('profile_id', userId);
          
        if (error) throw error;
      } else if (user.role === 'coordinator') {
        // Update coordinator status
        const { error } = await supabase
          .from('coordinators')
          .update({ status })
          .eq('profile_id', userId);
          
        if (error) throw error;
      }
      
      // Refresh user list
      await fetchUsers();
      
      return true;
    } catch (error: any) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  // Load users when component mounts
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    refreshUsers: fetchUsers,
    updateUserRole,
    updateUserStatus
  };
};
