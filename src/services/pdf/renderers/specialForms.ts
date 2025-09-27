
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormData } from '../types';

// Render reflective practice report
export const renderReflectivePractice = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Reflective Practice Report`]],
    body: [
      ['Trip Number', form.content?.trip_number || 'N/A'],
      ['Date', form.content?.date ? new Date(form.content.date).toLocaleDateString() : 'N/A'],
      ['Call Narrative', form.content?.call_narrative || 'N/A'],
      ['What Happened', form.content?.what_happened || 'N/A'],
      ['What Went Well', form.content?.what_went_well || 'N/A'],
      ['What Can Be Improved', form.content?.what_can_be_improved || 'N/A'],
      ['What Learned', form.content?.what_learned || 'N/A'],
      ['Conclusion', form.content?.conclusion || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};

// Render declaration of readiness
export const renderDeclaration = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Declaration of Readiness`]],
    body: [
      ['FTP Name', form.content?.ftp_name || 'N/A'],
      ['FTP Staff Number', form.content?.ftp_staff_number || 'N/A'],
      ['Student Name', form.content?.student_name || 'N/A'],
      ['Student Staff Number', form.content?.student_staff_number || 'N/A'],
      ['FTP Date', form.content?.ftp_date ? new Date(form.content.ftp_date).toLocaleDateString() : 'N/A'],
      ['Student Declaration Date', form.content?.student_declaration_date ? new Date(form.content.student_declaration_date).toLocaleDateString() : 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};

// Render final evaluation
export const renderFinalEvaluation = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Final Evaluation ${form.formNumber}`]],
    body: [
      ['Evaluator Name', form.content?.ftp_evaluator_name || 'N/A'],
      ['Date', form.content?.date ? new Date(form.content.date).toLocaleDateString() : 'N/A'],
      ['Number of Patients', form.content?.number_of_patients || '0'],
      ['Comments', form.content?.comments || 'N/A'],
      ['Additional Comments', form.content?.additional_comments || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};

// Render addendum form
export const renderAddendumForm = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Addendum Form ${form.formNumber}`]],
    body: [
      ['Form Type', form.content?.form_type || 'N/A'],
      ['Submission Date', new Date(form.submittedAt).toLocaleDateString()],
      ['Content', form.content?.content ? JSON.stringify(form.content.content).substring(0, 100) + '...' : 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};
