
import { jsPDF } from 'jspdf';
import { Student } from '@/types/coordinator';
import { FormData, PdfGenerationConfig } from './types';
import { 
  addSectionHeader,
  renderAssignment,
  renderRuralAmbulance,
  renderObservational,
  renderInstructionalShift,
  renderShiftEvaluation,
  renderCaseSummary,
  renderIndependentShift,
  renderIndependentEvaluation,
  renderIndependentSummary,
  renderReflectivePractice,
  renderDeclaration,
  renderFinalEvaluation,
  renderAddendumForm
} from './renderers';

/**
 * Generate initial phase content
 */
export const renderInitialPhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  // Process assignments
  const assignments = forms.filter(form => form.formType === 'assignments');
  if (assignments.length > 0) {
    currentY = addSectionHeader(pdf, 'Assignments', currentY);
    
    for (const assignment of assignments) {
      currentY = await renderAssignment(pdf, assignment, currentY);
    }
  }
  
  // Process rural ambulance orientations
  const ruralForms = forms.filter(form => form.formType === 'rural_ambulance_orientations');
  if (ruralForms.length > 0) {
    currentY = addSectionHeader(pdf, 'Rural Ambulance Orientation', currentY);
    
    for (const form of ruralForms) {
      currentY = await renderRuralAmbulance(pdf, form, currentY);
    }
  }
  
  // Process observational shifts
  const observations = forms.filter(form => form.formType === 'observational_shifts');
  if (observations.length > 0) {
    currentY = addSectionHeader(pdf, 'Observational Phase', currentY);
    
    for (const observation of observations) {
      currentY = await renderObservational(pdf, observation, currentY);
    }
  }
};

/**
 * Generate instructional phase content
 */
export const renderInstructionalPhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  // Process instructional shifts
  const instructionalShifts = forms.filter(form => form.formType === 'instructional_shifts');
  if (instructionalShifts.length > 0) {
    currentY = addSectionHeader(pdf, 'Instructional Shifts', currentY);
    
    for (const shift of instructionalShifts) {
      currentY = await renderInstructionalShift(pdf, shift, currentY);
    }
  }
  
  // Process shift evaluations
  const evaluations = forms.filter(form => form.formType === 'instructional_shift_evaluations');
  if (evaluations.length > 0) {
    currentY = addSectionHeader(pdf, 'Instructional Shift Evaluations', currentY);
    
    for (const evaluation of evaluations) {
      currentY = await renderShiftEvaluation(pdf, evaluation, currentY);
    }
  }
  
  // Process case summaries
  const summaries = forms.filter(form => form.formType === 'instructional_case_summaries');
  if (summaries.length > 0) {
    currentY = addSectionHeader(pdf, 'Instructional Case Summaries', currentY);
    
    for (const summary of summaries) {
      currentY = await renderCaseSummary(pdf, summary, currentY);
    }
  }
};

/**
 * Generate independent phase content
 */
export const renderIndependentPhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  // Process independent shifts
  const independentShifts = forms.filter(form => form.formType === 'independent_shifts');
  if (independentShifts.length > 0) {
    currentY = addSectionHeader(pdf, 'Independent Shifts', currentY);
    
    for (const shift of independentShifts) {
      currentY = await renderIndependentShift(pdf, shift, currentY);
    }
  }
  
  // Process shift evaluations
  const evaluations = forms.filter(form => form.formType === 'independent_shift_evaluations');
  if (evaluations.length > 0) {
    currentY = addSectionHeader(pdf, 'Independent Shift Evaluations', currentY);
    
    for (const evaluation of evaluations) {
      currentY = await renderIndependentEvaluation(pdf, evaluation, currentY);
    }
  }
  
  // Process case summaries
  const summaries = forms.filter(form => form.formType === 'independent_case_summaries');
  if (summaries.length > 0) {
    currentY = addSectionHeader(pdf, 'Independent Case Summaries', currentY);
    
    for (const summary of summaries) {
      currentY = await renderIndependentSummary(pdf, summary, currentY);
    }
  }
};

/**
 * Generate reflective content
 */
export const renderReflectivePhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  if (forms.length > 0) {
    currentY = addSectionHeader(pdf, 'Reflective Practice Report', currentY);
    
    for (const form of forms) {
      currentY = await renderReflectivePractice(pdf, form, currentY);
    }
  }
};

/**
 * Generate declaration content
 */
export const renderDeclarationPhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  if (forms.length > 0) {
    currentY = addSectionHeader(pdf, 'Declaration of Readiness', currentY);
    
    for (const form of forms) {
      currentY = await renderDeclaration(pdf, form, currentY);
    }
  }
};

/**
 * Generate evaluation content
 */
export const renderEvaluationPhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  if (forms.length > 0) {
    currentY = addSectionHeader(pdf, 'Final Evaluations', currentY);
    
    for (const form of forms) {
      currentY = await renderFinalEvaluation(pdf, form, currentY);
    }
  }
};

/**
 * Generate addendum content
 */
export const renderAddendumPhase = async (
  pdf: jsPDF, 
  forms: FormData[], 
  config: PdfGenerationConfig
): Promise<void> => {
  let currentY = 100; // Start position after header
  
  if (forms.length > 0) {
    currentY = addSectionHeader(pdf, 'Addendum Forms', currentY);
    
    for (const form of forms) {
      currentY = await renderAddendumForm(pdf, form, currentY);
    }
  }
};

/**
 * Generate complete workbook
 */
export const renderCompleteWorkbook = async (pdf: jsPDF, student: Student): Promise<void> => {
  // This will be a complete workbook with all phases
  pdf.addPage();
  pdf.setFontSize(18);
  pdf.text('Complete FTEP Workbook', 20, 30);
  pdf.setFontSize(10);
  pdf.text('This PDF contains the complete FTEP workbook for the student.', 20, 40);
  
  pdf.text('The complete workbook includes all submitted forms from all phases:', 20, 60);
  pdf.text('- Initial Forms (Assignments, Rural Ambulance, Observation)', 25, 70);
  pdf.text('- Instructional Phase (Shifts, Evaluations, Case Summaries)', 25, 80);
  pdf.text('- Independent Phase (Shifts, Evaluations, Case Summaries)', 25, 90);
  pdf.text('- Reflective Practice Report', 25, 100);
  pdf.text('- Declaration of Readiness', 25, 110);
  pdf.text('- Final Evaluations', 25, 120);
  pdf.text('- Addendum Forms (if any)', 25, 130);
};
