
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CreateUserParams {
  fullName: string;
  email: string;
  password: string;
  role: string;
}

export const useCreateUser = () => {
  const [isCreating, setIsCreating] = useState(false);

  const createUser = async ({ fullName, email, password, role }: CreateUserParams) => {
    setIsCreating(true);
    
    try {
      // 1. Create user in auth system
      const { data: authData, error: authError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm email
        user_metadata: { full_name: fullName, role }
      });

      if (authError) {
        throw authError;
      }

      if (!authData?.user) {
        throw new Error('Failed to create user account');
      }
      
      // 2. Set user role in profile (should be handled by trigger, but let's ensure it's set)
      const { error: profileError } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', authData.user.id);

      if (profileError) {
        console.error('Error updating profile role:', profileError);
        toast.error('User created but role assignment had an issue');
      }
      
      toast.success('User created successfully');
      return { success: true, user: authData.user };
      
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.message || 'Failed to create user');
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return {
    createUser,
    isCreating
  };
};
