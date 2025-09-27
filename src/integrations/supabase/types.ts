export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      addendum_forms: {
        Row: {
          content: Json
          created_at: string
          form_type: string
          id: string
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          content: Json
          created_at?: string
          form_type: string
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          content?: Json
          created_at?: string
          form_type?: string
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "addendum_forms_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      alpha_units: {
        Row: {
          created_at: string
          hub_id: string | null
          id: string
          status: string
          unit_number: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          hub_id?: string | null
          id?: string
          status?: string
          unit_number: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          hub_id?: string | null
          id?: string
          status?: string
          unit_number?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alpha_units_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
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
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          assignment_number: number
          content?: Json | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          assignment_number?: number
          content?: Json | null
          created_at?: string
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
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
          record_id: string
          table_name: string
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id: string
          table_name: string
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string
          table_name?: string
          user_id?: string | null
        }
        Relationships: []
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
      declarations_of_readiness: {
        Row: {
          created_at: string
          ftp_date: string
          ftp_name: string
          ftp_signature: string | null
          ftp_staff_number: string
          id: string
          status: Database["public"]["Enums"]["form_status"]
          student_declaration_date: string
          student_declaration_name: string
          student_declaration_number: string
          student_declaration_signature: string | null
          student_id: string
          student_name: string
          student_staff_number: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          ftp_date: string
          ftp_name: string
          ftp_signature?: string | null
          ftp_staff_number: string
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_declaration_date: string
          student_declaration_name: string
          student_declaration_number: string
          student_declaration_signature?: string | null
          student_id: string
          student_name: string
          student_staff_number: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          ftp_date?: string
          ftp_name?: string
          ftp_signature?: string | null
          ftp_staff_number?: string
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_declaration_date?: string
          student_declaration_name?: string
          student_declaration_number?: string
          student_declaration_signature?: string | null
          student_id?: string
          student_name?: string
          student_staff_number?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "declarations_of_readiness_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      field_training_paramedics: {
        Row: {
          certification_date: string | null
          created_at: string
          id: string
          profile_id: string
          status: string
          updated_at: string
        }
        Insert: {
          certification_date?: string | null
          created_at?: string
          id?: string
          profile_id: string
          status?: string
          updated_at?: string
        }
        Update: {
          certification_date?: string | null
          created_at?: string
          id?: string
          profile_id?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      final_evaluations: {
        Row: {
          additional_comments: string | null
          clinical_skills: Json
          comments: string | null
          created_at: string
          critical_criteria: Json | null
          date: string
          ftp_evaluator_name: string
          ftp_evaluator_signature: string | null
          id: string
          number_of_patients: number
          operational_skills: Json
          production_signature: string | null
          shift_number: number
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          additional_comments?: string | null
          clinical_skills: Json
          comments?: string | null
          created_at?: string
          critical_criteria?: Json | null
          date: string
          ftp_evaluator_name: string
          ftp_evaluator_signature?: string | null
          id?: string
          number_of_patients: number
          operational_skills: Json
          production_signature?: string | null
          shift_number: number
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          additional_comments?: string | null
          clinical_skills?: Json
          comments?: string | null
          created_at?: string
          critical_criteria?: Json | null
          date?: string
          ftp_evaluator_name?: string
          ftp_evaluator_signature?: string | null
          id?: string
          number_of_patients?: number
          operational_skills?: Json
          production_signature?: string | null
          shift_number?: number
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_signature?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "final_evaluations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      form_drafts: {
        Row: {
          created_at: string
          form_data: Json
          form_identifier: string
          form_type: string
          id: string
          last_saved_at: string
          student_id: string
        }
        Insert: {
          created_at?: string
          form_data: Json
          form_identifier: string
          form_type: string
          id?: string
          last_saved_at?: string
          student_id: string
        }
        Update: {
          created_at?: string
          form_data?: Json
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
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      form_revisions: {
        Row: {
          changed_by: string
          created_at: string
          form_data: Json
          form_submission_id: string
          id: string
          revision_number: number
        }
        Insert: {
          changed_by: string
          created_at?: string
          form_data: Json
          form_submission_id: string
          id?: string
          revision_number: number
        }
        Update: {
          changed_by?: string
          created_at?: string
          form_data?: Json
          form_submission_id?: string
          id?: string
          revision_number?: number
        }
        Relationships: [
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
          approved_at: string | null
          approved_by: string | null
          created_at: string
          form_id: string
          form_number: number
          form_type: string
          id: string
          rejected_at: string | null
          rejected_by: string | null
          rejection_reason: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          form_id: string
          form_number: number
          form_type: string
          id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          approved_at?: string | null
          approved_by?: string | null
          created_at?: string
          form_id?: string
          form_number?: number
          form_type?: string
          id?: string
          rejected_at?: string | null
          rejected_by?: string | null
          rejection_reason?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "form_submissions_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      forms: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          order_index: number | null
          phase: string
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          phase: string
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          order_index?: number | null
          phase?: string
          title?: string
        }
        Relationships: []
      }
      hubs: {
        Row: {
          created_at: string
          id: string
          location: string | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          location?: string | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      independent_case_summaries: {
        Row: {
          cfs_number: string
          chief_complaint: string
          clinical_performance: Json
          created_at: string
          date: string
          ftp_signature: string | null
          id: string
          medications_administered: string | null
          priority: string
          skills_performed: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature: string | null
          submitted_at: string | null
          summary_number: number
          updated_at: string
        }
        Insert: {
          cfs_number: string
          chief_complaint: string
          clinical_performance: Json
          created_at?: string
          date: string
          ftp_signature?: string | null
          id?: string
          medications_administered?: string | null
          priority: string
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature?: string | null
          submitted_at?: string | null
          summary_number: number
          updated_at?: string
        }
        Update: {
          cfs_number?: string
          chief_complaint?: string
          clinical_performance?: Json
          created_at?: string
          date?: string
          ftp_signature?: string | null
          id?: string
          medications_administered?: string | null
          priority?: string
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_signature?: string | null
          submitted_at?: string | null
          summary_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "independent_case_summaries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      independent_shift_evaluations: {
        Row: {
          best_performance: string
          clinical_performance: Json
          created_at: string
          date: string
          discussed_with_ftp: boolean
          ftp_corp_id: string
          ftp_name: string
          ftp_signature: string | null
          id: string
          improvement_plan: string
          medications_administered: string | null
          needs_improvement: string
          operational_performance: Json
          shift_number: number
          skills_performed: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          best_performance: string
          clinical_performance: Json
          created_at?: string
          date: string
          discussed_with_ftp?: boolean
          ftp_corp_id: string
          ftp_name: string
          ftp_signature?: string | null
          id?: string
          improvement_plan: string
          medications_administered?: string | null
          needs_improvement: string
          operational_performance: Json
          shift_number: number
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          best_performance?: string
          clinical_performance?: Json
          created_at?: string
          date?: string
          discussed_with_ftp?: boolean
          ftp_corp_id?: string
          ftp_name?: string
          ftp_signature?: string | null
          id?: string
          improvement_plan?: string
          medications_administered?: string | null
          needs_improvement?: string
          operational_performance?: Json
          shift_number?: number
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_signature?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "independent_shift_evaluations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      independent_shifts: {
        Row: {
          alpha_unit: string
          created_at: string
          crew_corp_id: string
          crew_name: string
          ftp_corp_id: string
          ftp_name: string
          ftp_objective: string
          ftp_role: string
          hub: string
          id: string
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          shift_date: string
          shift_number: number
          signature: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_objective: string
          submitted_at: string | null
          team_leadership: Json
          updated_at: string
        }
        Insert: {
          alpha_unit: string
          created_at?: string
          crew_corp_id: string
          crew_name: string
          ftp_corp_id: string
          ftp_name: string
          ftp_objective: string
          ftp_role: string
          hub: string
          id?: string
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          shift_date: string
          shift_number: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_objective: string
          submitted_at?: string | null
          team_leadership: Json
          updated_at?: string
        }
        Update: {
          alpha_unit?: string
          created_at?: string
          crew_corp_id?: string
          crew_name?: string
          ftp_corp_id?: string
          ftp_name?: string
          ftp_objective?: string
          ftp_role?: string
          hub?: string
          id?: string
          number_of_patients?: number
          production_corp_id?: string
          production_date?: string
          production_name?: string
          shift_date?: string
          shift_number?: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_objective?: string
          submitted_at?: string | null
          team_leadership?: Json
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "independent_shifts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      instructional_case_summaries: {
        Row: {
          cfs_number: string
          chief_complaint: string
          clinical_performance: Json
          created_at: string
          date: string
          ftp_signature: string | null
          id: string
          medications_administered: string | null
          priority: string
          skills_performed: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature: string | null
          submitted_at: string | null
          summary_number: number
          updated_at: string
        }
        Insert: {
          cfs_number: string
          chief_complaint: string
          clinical_performance: Json
          created_at?: string
          date: string
          ftp_signature?: string | null
          id?: string
          medications_administered?: string | null
          priority: string
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature?: string | null
          submitted_at?: string | null
          summary_number: number
          updated_at?: string
        }
        Update: {
          cfs_number?: string
          chief_complaint?: string
          clinical_performance?: Json
          created_at?: string
          date?: string
          ftp_signature?: string | null
          id?: string
          medications_administered?: string | null
          priority?: string
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_signature?: string | null
          submitted_at?: string | null
          summary_number?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructional_case_summaries_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      instructional_shift_evaluations: {
        Row: {
          best_performance: string
          clinical_performance: Json
          created_at: string
          date: string
          discussed_with_ftp: boolean
          ftp_corp_id: string
          ftp_name: string
          ftp_signature: string | null
          id: string
          improvement_plan: string
          medications_administered: string | null
          needs_improvement: string
          operational_performance: Json
          shift_number: number
          skills_performed: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature: string | null
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          best_performance: string
          clinical_performance: Json
          created_at?: string
          date: string
          discussed_with_ftp?: boolean
          ftp_corp_id: string
          ftp_name: string
          ftp_signature?: string | null
          id?: string
          improvement_plan: string
          medications_administered?: string | null
          needs_improvement: string
          operational_performance: Json
          shift_number: number
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          best_performance?: string
          clinical_performance?: Json
          created_at?: string
          date?: string
          discussed_with_ftp?: boolean
          ftp_corp_id?: string
          ftp_name?: string
          ftp_signature?: string | null
          id?: string
          improvement_plan?: string
          medications_administered?: string | null
          needs_improvement?: string
          operational_performance?: Json
          shift_number?: number
          skills_performed?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_signature?: string | null
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructional_shift_evaluations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      instructional_shifts: {
        Row: {
          alpha_unit: string
          created_at: string
          crew_corp_id: string
          crew_name: string
          feedback: string
          ftp_corp_id: string
          ftp_name: string
          ftp_objective: string
          ftp_role: string
          hub: string
          id: string
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          shift_date: string
          shift_number: number
          signature: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_objective: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          alpha_unit: string
          created_at?: string
          crew_corp_id: string
          crew_name: string
          feedback: string
          ftp_corp_id: string
          ftp_name: string
          ftp_objective: string
          ftp_role: string
          hub: string
          id?: string
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          shift_date: string
          shift_number: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_objective: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          alpha_unit?: string
          created_at?: string
          crew_corp_id?: string
          crew_name?: string
          feedback?: string
          ftp_corp_id?: string
          ftp_name?: string
          ftp_objective?: string
          ftp_role?: string
          hub?: string
          id?: string
          number_of_patients?: number
          production_corp_id?: string
          production_date?: string
          production_name?: string
          shift_date?: string
          shift_number?: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_objective?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "instructional_shifts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      observational_shifts: {
        Row: {
          alpha_unit: string
          best_performance: string
          created_at: string
          crew_corp_id: string
          crew_name: string
          ftp_corp_id: string
          ftp_name: string
          ftp_objective: string
          ftp_role: string
          hub: string
          id: string
          needs_improvement: string
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          shift_date: string
          shift_number: number
          signature: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_objective: string
          submitted_at: string | null
          updated_at: string
        }
        Insert: {
          alpha_unit: string
          best_performance: string
          created_at?: string
          crew_corp_id: string
          crew_name: string
          ftp_corp_id: string
          ftp_name: string
          ftp_objective: string
          ftp_role: string
          hub: string
          id?: string
          needs_improvement: string
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          shift_date: string
          shift_number: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_objective: string
          submitted_at?: string | null
          updated_at?: string
        }
        Update: {
          alpha_unit?: string
          best_performance?: string
          created_at?: string
          crew_corp_id?: string
          crew_name?: string
          ftp_corp_id?: string
          ftp_name?: string
          ftp_objective?: string
          ftp_role?: string
          hub?: string
          id?: string
          needs_improvement?: string
          number_of_patients?: number
          production_corp_id?: string
          production_date?: string
          production_name?: string
          shift_date?: string
          shift_number?: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_objective?: string
          submitted_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "observational_shifts_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      reflective_practice_reports: {
        Row: {
          call_narrative: string
          conclusion: string
          created_at: string
          date: string
          ftp_signature: string | null
          id: string
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature: string | null
          submitted_at: string | null
          trip_number: string
          updated_at: string
          what_can_be_improved: string
          what_happened: string
          what_learned: string
          what_went_well: string
        }
        Insert: {
          call_narrative: string
          conclusion: string
          created_at?: string
          date: string
          ftp_signature?: string | null
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          student_signature?: string | null
          submitted_at?: string | null
          trip_number: string
          updated_at?: string
          what_can_be_improved: string
          what_happened: string
          what_learned: string
          what_went_well: string
        }
        Update: {
          call_narrative?: string
          conclusion?: string
          created_at?: string
          date?: string
          ftp_signature?: string | null
          id?: string
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          student_signature?: string | null
          submitted_at?: string | null
          trip_number?: string
          updated_at?: string
          what_can_be_improved?: string
          what_happened?: string
          what_learned?: string
          what_went_well?: string
        }
        Relationships: [
          {
            foreignKeyName: "reflective_practice_reports_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      rural_ambulance_orientations: {
        Row: {
          alpha_unit: string
          cabin_familiarization: boolean | null
          comments: string | null
          created_at: string
          crew_corp_id: string
          crew_name: string
          ftp_corp_id: string
          ftp_name: string
          ftp_role: string
          hub: string
          id: string
          loading_stretcher: boolean | null
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          safety_features: boolean | null
          shift_date: string
          shift_number: number
          signature: string | null
          status: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at: string | null
          unloading_stretcher: boolean | null
          updated_at: string
        }
        Insert: {
          alpha_unit: string
          cabin_familiarization?: boolean | null
          comments?: string | null
          created_at?: string
          crew_corp_id: string
          crew_name: string
          ftp_corp_id: string
          ftp_name: string
          ftp_role: string
          hub: string
          id?: string
          loading_stretcher?: boolean | null
          number_of_patients: number
          production_corp_id: string
          production_date: string
          production_name: string
          safety_features?: boolean | null
          shift_date: string
          shift_number: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id: string
          submitted_at?: string | null
          unloading_stretcher?: boolean | null
          updated_at?: string
        }
        Update: {
          alpha_unit?: string
          cabin_familiarization?: boolean | null
          comments?: string | null
          created_at?: string
          crew_corp_id?: string
          crew_name?: string
          ftp_corp_id?: string
          ftp_name?: string
          ftp_role?: string
          hub?: string
          id?: string
          loading_stretcher?: boolean | null
          number_of_patients?: number
          production_corp_id?: string
          production_date?: string
          production_name?: string
          safety_features?: boolean | null
          shift_date?: string
          shift_number?: number
          signature?: string | null
          status?: Database["public"]["Enums"]["form_status"]
          student_id?: string
          submitted_at?: string | null
          unloading_stretcher?: boolean | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rural_ambulance_orientations_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_overall_progress: {
        Row: {
          completed_forms: number
          completed_phases: number
          created_at: string
          id: string
          is_complete: boolean | null
          overall_percentage: number | null
          student_id: string
          total_forms: number
          total_phases: number
          updated_at: string
        }
        Insert: {
          completed_forms?: number
          completed_phases?: number
          created_at?: string
          id?: string
          is_complete?: boolean | null
          overall_percentage?: number | null
          student_id: string
          total_forms: number
          total_phases: number
          updated_at?: string
        }
        Update: {
          completed_forms?: number
          completed_phases?: number
          created_at?: string
          id?: string
          is_complete?: boolean | null
          overall_percentage?: number | null
          student_id?: string
          total_forms?: number
          total_phases?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_overall_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: true
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_phase_progress: {
        Row: {
          completed_items: number
          completion_percentage: number | null
          created_at: string
          id: string
          is_complete: boolean | null
          phase_name: string
          student_id: string
          total_items: number
          updated_at: string
        }
        Insert: {
          completed_items?: number
          completion_percentage?: number | null
          created_at?: string
          id?: string
          is_complete?: boolean | null
          phase_name: string
          student_id: string
          total_items: number
          updated_at?: string
        }
        Update: {
          completed_items?: number
          completion_percentage?: number | null
          created_at?: string
          id?: string
          is_complete?: boolean | null
          phase_name?: string
          student_id?: string
          total_items?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_phase_progress_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      student_progress: {
        Row: {
          completed_forms: number | null
          percentage: number | null
          student_id: string
          total_forms: number | null
          updated_at: string | null
        }
        Insert: {
          completed_forms?: number | null
          percentage?: number | null
          student_id: string
          total_forms?: number | null
          updated_at?: string | null
        }
        Update: {
          completed_forms?: number | null
          percentage?: number | null
          student_id?: string
          total_forms?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      students: {
        Row: {
          alpha_unit_id: string | null
          alpha_unit_text: string | null
          apc_batch: string | null
          contact_number: string | null
          corp_id: string | null
          created_at: string
          email: string | null
          ftp_contact: string | null
          ftp_id: string | null
          ftp_name: string | null
          full_name: string | null
          hub_id: string | null
          hub_name: string | null
          id: string
          password: string | null
          profile_id: string
          program_start_date: string | null
          role: string | null
          status: string
          updated_at: string
        }
        Insert: {
          alpha_unit_id?: string | null
          alpha_unit_text?: string | null
          apc_batch?: string | null
          contact_number?: string | null
          corp_id?: string | null
          created_at?: string
          email?: string | null
          ftp_contact?: string | null
          ftp_id?: string | null
          ftp_name?: string | null
          full_name?: string | null
          hub_id?: string | null
          hub_name?: string | null
          id?: string
          password?: string | null
          profile_id: string
          program_start_date?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          alpha_unit_id?: string | null
          alpha_unit_text?: string | null
          apc_batch?: string | null
          contact_number?: string | null
          corp_id?: string | null
          created_at?: string
          email?: string | null
          ftp_contact?: string | null
          ftp_id?: string | null
          ftp_name?: string | null
          full_name?: string | null
          hub_id?: string | null
          hub_name?: string | null
          id?: string
          password?: string | null
          profile_id?: string
          program_start_date?: string | null
          role?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_alpha_unit_id_fkey"
            columns: ["alpha_unit_id"]
            isOneToOne: false
            referencedRelation: "alpha_units"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_ftp_id_fkey"
            columns: ["ftp_id"]
            isOneToOne: false
            referencedRelation: "field_training_paramedics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_hub_id_fkey"
            columns: ["hub_id"]
            isOneToOne: false
            referencedRelation: "hubs"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Functions: {
      assign_user_role: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["user_role"]
        }
        Returns: boolean
      }
      delete_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_active_student: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_admin_or_coordinator: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_assigned_ftp: {
        Args: { student_id: string }
        Returns: boolean
      }
      is_ftp: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
    }
    Enums: {
      app_role: "student" | "ftp" | "coordinator" | "admin"
      evaluation_score: "3" | "2" | "1" | "N.P."
      form_status: "draft" | "submitted" | "approved" | "rejected"
      user_role: "student" | "coordinator" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["student", "ftp", "coordinator", "admin"],
      evaluation_score: ["3", "2", "1", "N.P."],
      form_status: ["draft", "submitted", "approved", "rejected"],
      user_role: ["student", "coordinator", "admin"],
    },
  },
} as const
