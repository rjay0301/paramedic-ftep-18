
import { Session, User } from '@supabase/supabase-js';

// Define an extended User type that includes the name property
export interface EnhancedUser extends User {
  name?: string;
  full_name?: string; // Added to match what's being used
  role?: UserRole;
  status?: 'pending' | 'active' | 'inactive' | 'error';
}

export type UserRole = 'student' | 'coordinator' | 'admin' | null;

export interface Profile {
  id: string;
  email: string;
  corp_id?: string;
  role: UserRole;
  status: 'pending' | 'active' | 'inactive';
  full_name?: string | null;
}
