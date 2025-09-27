
export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: 'student' | 'coordinator' | 'admin';
          full_name: string | null;
          created_at: string;
          email: string | null;
        };
        Insert: {
          id: string;
          role: 'student' | 'coordinator' | 'admin';
          full_name?: string | null;
          created_at?: string;
          email?: string | null;
        };
        Update: {
          id?: string;
          role?: 'student' | 'coordinator' | 'admin';
          full_name?: string | null;
          created_at?: string;
          email?: string | null;
        };
      };
      coordinators: {
        Row: {
          id: string;
          profile_id: string;
          department: string | null;
          position: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          profile_id: string;
          department?: string | null;
          position?: string | null; 
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          profile_id?: string;
          department?: string | null;
          position?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      students: {
        Row: {
          id: string;
          profile_id: string;
          status: string;
          full_name: string | null;
          email: string | null;
        };
        Insert: {
          id?: string;
          profile_id: string;
          status?: string;
          full_name?: string | null;
          email?: string | null;
        };
        Update: {
          id?: string;
          profile_id?: string;
          status?: string;
          full_name?: string | null;
          email?: string | null;
        };
      };
      training_phases: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          order_index: number;
          created_at: string;
        };
      };
      student_submissions: {
        Row: {
          id: string;
          student_id: string;
          phase_id: string;
          form_data: any;
          status: 'draft' | 'submitted' | 'reviewed' | 'approved';
          submitted_at: string | null;
          reviewed_at: string | null;
          reviewer_id: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
    Views: {
      admin_user_view: {
        Row: {
          id: string;
          full_name: string | null;
          email: string | null;
          role: string | null;
          created_at: string | null;
          status: string;
          record_type: string;
        };
      };
    };
    Functions: {
      assign_user_role: {
        Args: {
          p_user_id: string;
          p_role: 'student' | 'coordinator' | 'admin';
        };
        Returns: boolean;
      };
    };
  };
};
