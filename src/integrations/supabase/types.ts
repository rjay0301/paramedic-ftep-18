export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      addendum_forms: {
        Row: {
          content: Json | null
          created_at: string
          form_type: string
          id: string
          status: string
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          content?: Json | null
          created_at?: string
          form_type: string
          id?: string
          status?: string
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json | null
          created_at?: string
          form_type?: string
          id?: string
          status?: string
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addendum_forms_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_overall_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "addendum_forms_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_phase_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "addendum_forms_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      assignments: {
        Row: {
          assignment_number: number
          content: Json | null
          created_at: string
          id: string
          status: string
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assignment_number: number
          content?: Json | null
          created_at?: string
          id?: string
          status?: string
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assignment_number?: number
          content?: Json | null
          created_at?: string
          id?: string
          status?: string
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_overall_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_phase_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "assignments_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "admin_user_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_logs_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      coordinators: {
        Row: {
          created_at: string
          department: string | null
          id: string
          position: string | null
          profile_id: string
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          department?: string | null
          id?: string
          position?: string | null
          profile_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          department?: string | null
          id?: string
          position?: string | null
          profile_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordinators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "admin_user_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coordinators_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_drafts: {
        Row: {
          created_at: string
          form_data: Json | null
          form_identifier: string
          form_type: string
          id: string
          last_saved_at: string
          student_id: string
        }
        Insert: {
          created_at?: string
          form_data?: Json | null
          form_identifier: string
          form_type: string
          id?: string
          last_saved_at?: string
          student_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json | null
          form_identifier?: string
          form_type?: string
          id?: string
          last_saved_at?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_drafts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_overall_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "form_drafts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_phase_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "form_drafts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      form_revisions: {
        Row: {
          content: Json | null
          created_at: string
          created_by: string | null
          form_submission_id: string
          id: string
          revision_number: number
        }
        Insert: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          form_submission_id: string
          id?: string
          revision_number: number
        }
        Update: {
          content?: Json | null
          created_at?: string
          created_by?: string | null
          form_submission_id?: string
          id?: string
          revision_number?: number
        }
        Relationships: [
          {
            foreignKeyName: "form_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "admin_user_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_revisions_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "form_revisions_form_submission_id_fkey"
            columns: ["form_submission_id"]
            isOneToOne: false
            referencedRelation: "form_submissions"
            referencedColumns: ["id"]
          },
        ]
      }
      form_submissions: {
        Row: {
          created_at: string
          form_id: string
          form_number: number
          form_type: string
          id: string
          status: string
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_id: string
          form_number: number
          form_type: string
          id?: string
          status?: string
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_id?: string
          form_number?: number
          form_type?: string
          id?: string
          status?: string
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      hubs: {
        Row: {
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      instructional_case_summaries: {
        Row: {
          areas_to_improve: string | null
          cfs_number: string | null
          chief_complaint: string | null
          clinical_performance: Json | null
          created_at: string
          date: string | null
          ftp_feedback: string | null
          ftp_signature: string | null
          id: string
          medications_administered: string | null
          performed_well: string | null
          priority: string | null
          skills_performed: string | null
          status: string
          student_id: string
          student_signature: string | null
          summary_number: number
          updated_at: string
        }
        Insert: {
          areas_to_improve?: string | null
          cfs_number?: string | null
          chief_complaint?: string | null
          clinical_performance?: Json | null
          created_at?: string
          date?: string | null
          ftp_feedback?: string | null
          ftp_signature?: string | null
          id?: string
          medications_administered?: string | null
          performed_well?: string | null
          priority?: string | null
          skills_performed?: string | null
          status?: string
          student_id: string
          student_signature?: string | null
          summary_number: number
          updated_at?: string
        }
        Update: {
          areas_to_improve?: string | null
          cfs_number?: string | null
          chief_complaint?: string | null
          clinical_performance?: Json | null
          created_at?: string
          date?: string | null
          ftp_feedback?: string | null
          ftp_signature?: string | null
          id?: string
          medications_administered?: string | null
          performed_well?: string | null
          priority?: string | null
          skills_performed?: string | null
          status?: string
          student_id?: string
          student_signature?: string | null
          summary_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructional_case_summaries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_overall_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "instructional_case_summaries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_phase_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "instructional_case_summaries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          corp_id: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          role: string
          status: string
          updated_at: string
        }
        Insert: {
          corp_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          role?: string
          status?: string
          updated_at?: string
        }
        Update: {
          corp_id?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      student_progress: {
        Row: {
          completed_forms: number
          created_at: string
          id: string
          percentage: number
          student_id: string
          total_forms: number
          updated_at: string
        }
        Insert: {
          completed_forms?: number
          created_at?: string
          id?: string
          percentage?: number
          student_id: string
          total_forms?: number
          updated_at?: string
        }
        Update: {
          completed_forms?: number
          created_at?: string
          id?: string
          percentage?: number
          student_id?: string
          total_forms?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "student_overall_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "student_phase_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_submissions: {
        Row: {
          created_at: string
          form_data: Json | null
          id: string
          phase_id: string
          reviewed_at: string | null
          reviewer_id: string | null
          status: string
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          form_data?: Json | null
          id?: string
          phase_id: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          form_data?: Json | null
          id?: string
          phase_id?: string
          reviewed_at?: string | null
          reviewer_id?: string | null
          status?: string
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_submissions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "student_phase_progress"
            referencedColumns: ["phase_id"]
          },
          {
            foreignKeyName: "student_submissions_phase_id_fkey"
            columns: ["phase_id"]
            isOneToOne: false
            referencedRelation: "training_phases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_submissions_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "admin_user_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_submissions_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_overall_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "student_phase_progress"
            referencedColumns: ["student_id"]
          },
          {
            foreignKeyName: "student_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          alpha_unit_text: string | null
          created_at: string
          email: string | null
          ftp_contact: string | null
          ftp_name: string | null
          full_name: string | null
          hub_id: string | null
          hub_name: string | null
          id: string
          profile_id: string
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          alpha_unit_text?: string | null
          created_at?: string
          email?: string | null
          ftp_contact?: string | null
          ftp_name?: string | null
          full_name?: string | null
          hub_id?: string | null
          hub_name?: string | null
          id?: string
          profile_id: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          alpha_unit_text?: string | null
          created_at?: string
          email?: string | null
          ftp_contact?: string | null
          ftp_name?: string | null
          full_name?: string | null
          hub_id?: string | null
          hub_name?: string | null
          id?: string
          profile_id?: string
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "admin_user_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      training_phases: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          order_index: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          order_index?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          order_index?: number
        }
        Relationships: []
      }
    }
    Views: {
      admin_user_view: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string | null
          record_type: string | null
          role: string | null
          status: string | null
        }
        Relationships: []
      }
      student_overall_progress: {
        Row: {
          completed_forms: number | null
          completed_phases: number | null
          full_name: string | null
          overall_percentage: number | null
          profile_id: string | null
          student_id: string | null
          total_forms: number | null
          total_phases: number | null
        }
        Relationships: [
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "admin_user_view"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      student_phase_progress: {
        Row: {
          completed_items: number | null
          completion_percentage: number | null
          is_complete: boolean | null
          phase_id: string | null
          phase_name: string | null
          student_id: string | null
          total_items: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_user_role: {
        Args: { p_role: string; p_user_id: string }
        Returns: boolean
      }
      delete_user: {
        Args: { user_id: string }
        Returns: undefined
      }
      get_all_tables: {
        Args: Record<PropertyKey, never>
        Returns: {
          comment: string
          name: string
          record_count: number
          schema: string
        }[]
      }
      get_table_columns: {
        Args: { p_schema_name: string; p_table_name: string }
        Returns: {
          is_nullable: boolean
          is_primary_key: boolean
          name: string
          type: string
        }[]
      }
      recalculate_student_progress: {
        Args: { p_student_id: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
