
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormData } from '../types';

// Render independent shift
export const renderIndependentShift = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Independent Shift ${form.formNumber}`]],
    body: [
      ['Shift Date', form.content?.shift_date ? new Date(form.content.shift_date).toLocaleDateString() : 'N/A'],
      ['FTP Name', form.content?.ftp_name || 'N/A'],
      ['FTP Role', form.content?.ftp_role || 'N/A'],
      ['Alpha Unit', form.content?.alpha_unit || 'N/A'],
      ['Hub', form.content?.hub || 'N/A'],
      ['Number of Patients', form.content?.number_of_patients || '0'],
      ['Student Objective', form.content?.student_objective || 'N/A'],
      ['FTP Objective', form.content?.ftp_objective || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};

// Render independent evaluation
export const renderIndependentEvaluation = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Independent Evaluation ${form.formNumber}`]],
    body: [
      ['Date', form.content?.date ? new Date(form.content.date).toLocaleDateString() : 'N/A'],
      ['FTP Name', form.content?.ftp_name || 'N/A'],
      ['Best Performance', form.content?.best_performance || 'N/A'],
      ['Needs Improvement', form.content?.needs_improvement || 'N/A'],
      ['Improvement Plan', form.content?.improvement_plan || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};

// Render independent case summary
export const renderIndependentSummary = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Independent Case Summary ${form.formNumber}`]],
    body: [
      ['CFS Number', form.content?.cfs_number || 'N/A'],
      ['Date', form.content?.date ? new Date(form.content.date).toLocaleDateString() : 'N/A'],
      ['Chief Complaint', form.content?.chief_complaint || 'N/A'],
      ['Priority', form.content?.priority || 'N/A'],
      ['Skills Performed', form.content?.skills_performed || 'N/A'],
      ['Medications Administered', form.content?.medications_administered || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};
