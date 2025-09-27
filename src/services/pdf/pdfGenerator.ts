
import { jsPDF } from 'jspdf';
import { Student } from '@/types/coordinator';
import { PhaseType, PdfGenerationConfig } from './types';
import { addHeader, formatPhaseTitle } from './pdfUtils';
import { fetchPhaseFormData } from './dataFetcher';
import { 
  renderInitialPhase,
  renderInstructionalPhase,
  renderIndependentPhase, 
  renderReflectivePhase,
  renderDeclarationPhase,
  renderEvaluationPhase,
  renderAddendumPhase,
  renderCompleteWorkbook
} from './phaseRenderers';

/**
 * Generates a PDF report for a student based on the specified phase
 * @param student The student information
 * @param phaseType The type of phase to generate PDF for
 * @returns Promise that resolves when PDF is generated
 */
export const generatePhasePdf = async (student: Student, phaseType: PhaseType): Promise<void> => {
  // Initialize PDF with A4 portrait format
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });
  
  // Set up document properties
  pdf.setProperties({
    title: `${student.name} - ${formatPhaseTitle(phaseType)} Report`,
    subject: 'FTEP Workbook Report',
    author: 'HMCAS FTEP System',
    creator: 'HMCAS FTEP System'
  });
  
  // Add header with logo and title
  addHeader(pdf, student, phaseType);
  
  try {
    // Fetch forms data based on phase type with better error handling
    console.log(`Fetching data for student ${student.id}, phase ${phaseType}`);
    const forms = await fetchPhaseFormData(student.id, phaseType);
    console.log(`Retrieved ${forms.length} forms for ${phaseType}`);
    
    if (forms.length === 0) {
      // Add a message if no forms are found
      pdf.setFontSize(12);
      pdf.setTextColor(100);
      pdf.text(
        `No completed ${formatPhaseTitle(phaseType)} forms found for this student.`,
        20, 
        100
      );
    } else {
      // Generate content based on phase type
      const config: PdfGenerationConfig = { student, phaseType };
      
      switch (phaseType) {
        case 'initial':
          await renderInitialPhase(pdf, forms, config);
          break;
        case 'instructional':
          await renderInstructionalPhase(pdf, forms, config);
          break;
        case 'independent':
          await renderIndependentPhase(pdf, forms, config);
          break;
        case 'reflective':
          await renderReflectivePhase(pdf, forms, config);
          break;
        case 'declaration':
          await renderDeclarationPhase(pdf, forms, config);
          break;
        case 'evaluation':
          await renderEvaluationPhase(pdf, forms, config);
          break;
        case 'addendum':
          await renderAddendumPhase(pdf, forms, config);
          break;
        case 'complete':
          await renderCompleteWorkbook(pdf, student);
          break;
      }
    }
    
    // Add footer with page numbers
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(100);
      pdf.text(
        `FTEP Workbook - ${student.name} - Page ${i} of ${pageCount}`,
        pdf.internal.pageSize.getWidth() / 2,
        pdf.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }
    
    // Save the PDF with improved error handling
    pdf.save(`${student.name}-${formatPhaseTitle(phaseType)}.pdf`);
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error('Failed to generate PDF');
  }
};

/**
 * Generates a PDF for a specific form submission
 * @param formId The ID of the form submission to generate a PDF for
 * @returns Promise that resolves when PDF is generated
 */
export const generateFormPdf = async (formId: string): Promise<void> => {
  try {
    console.log(`Generating PDF for form: ${formId}`);
    
    // Get the form submission details from supabase
    const { data: submission, error: submissionError } = await fetch(`/api/forms/details?id=${formId}`)
      .then(res => res.json());
    
    if (submissionError || !submission) {
      console.error('Error fetching form details:', submissionError);
      throw new Error('Failed to fetch form details');
    }
    
    // Create a simple PDF with form details
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    pdf.setProperties({
      title: `Form ${formId}`,
      subject: 'FTEP Form Report',
      author: 'HMCAS FTEP System',
      creator: 'HMCAS FTEP System'
    });
    
    pdf.setFontSize(16);
    pdf.text('Form Report', 20, 20);
    
    pdf.setFontSize(12);
    pdf.text(`Form ID: ${formId}`, 20, 40);
    
    if (submission) {
      pdf.text(`Form Type: ${submission.formType || 'Unknown'}`, 20, 50);
      pdf.text(`Submission Date: ${submission.submittedAt || 'Not submitted'}`, 20, 60);
    }
    
    pdf.save(`form-${formId}.pdf`);
    
  } catch (error) {
    console.error('Error generating form PDF:', error);
    throw new Error('Failed to generate form PDF');
  }
};
