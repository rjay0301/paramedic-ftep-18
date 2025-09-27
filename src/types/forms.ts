
import { PostgrestError } from '@supabase/supabase-js';

// Define a type for form status
export type FormStatus = 'draft' | 'submitted' | 'completed';

// Define a type for the valid table names in our schema
export type ValidTableName = 
  | 'assignments'
  | 'rural_ambulance_orientations'
  | 'observational_shifts'
  | 'instructional_shifts'
  | 'instructional_shift_evaluations'
  | 'instructional_case_summaries'
  | 'independent_shifts'
  | 'independent_shift_evaluations'
  | 'independent_case_summaries'
  | 'reflective_practice_reports'
  | 'declarations_of_readiness'
  | 'final_evaluations'
  | 'form_submissions'
  | 'form_revisions'
  | 'form_drafts';

// Define a non-recursive type for simple values
export type FormDataValue = 
  | string 
  | number 
  | boolean 
  | null 
  | undefined 
  | string[] 
  | number[] 
  | Record<string, string | number | boolean | null | undefined>;

// Define a type for form data that avoids recursive references
export interface FormData {
  [key: string]: FormDataValue;
}

// Interface for hub data with location as a simple text field
export interface HubData {
  id?: string;
  name: string;
  location?: string;
}
