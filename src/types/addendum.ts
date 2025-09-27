
import { FormStatus } from './forms';
import { FormDataValue } from './index';

export interface AddendumForm {
  id?: string;
  student_id: string;
  form_type: string;
  content: Record<string, FormDataValue>;
  status: FormStatus;
  submitted_at?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type AddendumFormType = 
  | 'instructional-copy'
  | 'instructional-evaluation-copy'
  | 'independent-copy'
  | 'independent-evaluation-copy'
  | 'final-evaluation-copy';
