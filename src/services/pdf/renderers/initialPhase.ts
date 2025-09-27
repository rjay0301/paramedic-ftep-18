
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { FormData } from '../types';

// Render assignment form
export const renderAssignment = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  const content = form.content || {};
  console.log("Rendering assignment with content:", content);
  
  // Extract assignment content from the JSON structure
  let assignmentContent = '';
  if (content.content) {
    try {
      // Handle different content formats
      if (typeof content.content === 'string') {
        assignmentContent = content.content;
      } else if (typeof content.content === 'object' && content.content !== null) {
        // For structured assignment data, format it appropriately
        const assignmentData = content.content;
        if (typeof assignmentData === 'string') {
          assignmentContent = assignmentData;
        } else if (typeof assignmentData === 'object') {
          // Extract content field or the first key's value
          assignmentContent = assignmentData.content || 
                             Object.values(assignmentData)[0] || 
                             JSON.stringify(assignmentData);
        }
      }
    } catch (e) {
      console.error("Error parsing assignment content:", e, content);
      assignmentContent = 'Error parsing assignment content';
    }
  } else {
    // If no content.content exists, try to extract content directly
    try {
      if (typeof content === 'string') {
        assignmentContent = content;
      } else if (typeof content === 'object' && content !== null) {
        assignmentContent = JSON.stringify(content);
      }
    } catch (e) {
      console.error("Error extracting direct content:", e);
      assignmentContent = 'No content available';
    }
  }
  
  console.log("Extracted assignment content:", assignmentContent);
  
  // Use autoTable to render assignment with proper content
  autoTable(pdf, {
    startY: currentY,
    head: [[`Assignment ${form.formNumber}`]],
    body: [
      ['Submission Date', form.submittedAt ? new Date(form.submittedAt).toLocaleDateString() : 'N/A'],
      ['Assignment Content', '']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // Get the final Y position after the table
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY || (currentY + 30);
  
  // Add the actual content below the table with proper formatting
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Split the assignment content into multiple lines if needed
  const textLines = pdf.splitTextToSize(assignmentContent || 'No content available', pdf.internal.pageSize.getWidth() - 40);
  if (finalY + (textLines.length * 5) > pdf.internal.pageSize.getHeight()) {
    pdf.addPage();
    pdf.text(textLines, 20, 20);
    return 20 + (textLines.length * 5) + 10;
  } else {
    pdf.text(textLines, 20, finalY + 10);
    return finalY + (textLines.length * 5) + 20;
  }
};

// Render rural ambulance form
export const renderRuralAmbulance = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Rural Ambulance Orientation - Shift ${form.formNumber}`]],
    body: [
      ['Shift Date', form.content?.shift_date ? new Date(form.content.shift_date).toLocaleDateString() : 'N/A'],
      ['FTP Name', form.content?.ftp_name || 'N/A'],
      ['Loading Stretcher', form.content?.loading_stretcher ? 'Competent' : 'Not Yet Competent'],
      ['Unloading Stretcher', form.content?.unloading_stretcher ? 'Competent' : 'Not Yet Competent'],
      ['Safety Features', form.content?.safety_features ? 'Competent' : 'Not Yet Competent'],
      ['Cabin Familiarization', form.content?.cabin_familiarization ? 'Competent' : 'Not Yet Competent'],
      ['Comments', form.content?.comments || 'None']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};

// Render observational shift
export const renderObservational = async (pdf: jsPDF, form: FormData, currentY: number): Promise<number> => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  autoTable(pdf, {
    startY: currentY,
    head: [[`Observational Shift ${form.formNumber}`]],
    body: [
      ['Shift Date', form.content?.shift_date ? new Date(form.content.shift_date).toLocaleDateString() : 'N/A'],
      ['FTP Name', form.content?.ftp_name || 'N/A'],
      ['FTP Role', form.content?.ftp_role || 'N/A'],
      ['Alpha Unit', form.content?.alpha_unit || 'N/A'],
      ['Hub', form.content?.hub || 'N/A'],
      ['Number of Patients', form.content?.number_of_patients || '0'],
      ['Student Objective', form.content?.student_objective || 'N/A'],
      ['FTP Objective', form.content?.ftp_objective || 'N/A'],
      ['Areas of Best Performance', form.content?.best_performance || 'N/A'],
      ['Areas Needing Improvement', form.content?.needs_improvement || 'N/A']
    ],
    theme: 'grid',
    headStyles: { fillColor: [100, 100, 100], textColor: 255 },
    margin: { left: 20, right: 20 }
  });
  
  // @ts-ignore - We know this property exists but TypeScript doesn't
  const finalY = pdf.lastAutoTable.finalY;
  return finalY + 10;
};
