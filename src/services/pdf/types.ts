
import { Student } from '@/types/coordinator';

// Define phase types for PDF generation
export type PhaseType = 
  | 'initial'
  | 'instructional'
  | 'independent'
  | 'reflective'
  | 'declaration'
  | 'evaluation'
  | 'addendum'
  | 'complete';

// Interface for form data structure
export interface FormData {
  id: string;
  formType: string;
  formNumber: number;
  submittedAt: string;
  content: any;
}

// Function type for rendering a form in PDF
export type FormRenderer = (
  pdf: import('jspdf').jsPDF, 
  form: FormData, 
  currentY: number
) => Promise<number>;

// Configuration for PDF generation
export interface PdfGenerationConfig {
  student: Student;
  phaseType: PhaseType;
}
