
export interface Form {
  id: string;
  title: string;
  phase: string;
  description?: string;
  order_index?: number;
  created_at: string;
}

export interface FormSubmission {
  id: string;
  student_id: string;
  form_id: string;
  form_type: string;
  form_number: number;
  status: 'draft' | 'submitted' | 'completed';
  data?: any;
  submitted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface StudentProgress {
  student_id: string;
  completed_forms: number;
  total_forms: number;
  percentage: number;
  updated_at: string;
}

export interface PhaseProgress {
  id: string;
  student_id: string;
  phase_name: string;
  total_items: number;
  completed_items: number;
  is_complete: boolean;
  completion_percentage: number;
  created_at: string;
  updated_at: string;
}

export interface StudentOverallProgress {
  id: string;
  student_id: string;
  completed_phases: number;
  total_phases: number;
  completed_forms: number;
  total_forms: number;
  overall_percentage: number;
  is_complete: boolean;
  created_at: string;
  updated_at: string;
}
