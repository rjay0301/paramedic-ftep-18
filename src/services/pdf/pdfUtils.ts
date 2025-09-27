
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Student } from '@/types/coordinator';
import { PhaseType } from './types';

/**
 * Format phase title for display
 */
export const formatPhaseTitle = (phaseType: PhaseType): string => {
  switch (phaseType) {
    case 'initial':
      return 'Initial Forms';
    case 'instructional':
      return 'Instructional Phase';
    case 'independent':
      return 'Independent Phase';
    case 'reflective':
      return 'Reflective Practice';
    case 'declaration':
      return 'Declaration of Readiness';
    case 'evaluation':
      return 'Final Evaluation';
    case 'addendum':
      return 'Addendum Forms';
    case 'complete':
      return 'Complete Workbook';
    default:
      return 'FTEP Report';
  }
};

/**
 * Add header to PDF document
 */
export const addHeader = (pdf: jsPDF, student: Student, phaseType: PhaseType): void => {
  // Add title
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('HMCAS Field Training & Evaluation Program', 20, 20);
  
  pdf.setFontSize(14);
  pdf.text(formatPhaseTitle(phaseType), 20, 30);
  
  // Add student information
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  // Create a table for student information
  autoTable(pdf, {
    startY: 35,
    head: [['Student Information']],
    body: [
      ['Name', student.name],
      ['Alpha Unit', student.alphaUnit || 'N/A'],
      ['Hub', student.hub || 'N/A'],
      ['FTP Name', student.ftpName || 'N/A'],
      ['FTP Contact', student.ftpContact || 'N/A'],
      ['Report Generated', new Date().toLocaleDateString()]
    ],
    theme: 'grid',
    headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
    columnStyles: {
      0: { cellWidth: 40, fontStyle: 'bold' },
      1: { cellWidth: 'auto' }
    },
    margin: { left: 20, right: 20 }
  });
};

/**
 * Get form types by phase
 */
export const getFormTypesByPhase = (phaseType: PhaseType): string[] => {
  switch (phaseType) {
    case 'initial':
      return ['assignments', 'rural_ambulance_orientations', 'observational_shifts'];
    case 'instructional':
      return ['instructional_shifts', 'instructional_shift_evaluations', 'instructional_case_summaries'];
    case 'independent':
      return ['independent_shifts', 'independent_shift_evaluations', 'independent_case_summaries'];
    case 'reflective':
      return ['reflective_practice_reports'];
    case 'declaration':
      return ['declarations_of_readiness'];
    case 'evaluation':
      return ['final_evaluations'];
    case 'addendum':
      return ['addendum_forms'];
    case 'complete':
      // Include all form types for complete workbook
      return [
        'assignments',
        'rural_ambulance_orientations',
        'observational_shifts',
        'instructional_shifts',
        'instructional_shift_evaluations',
        'instructional_case_summaries',
        'independent_shifts',
        'independent_shift_evaluations',
        'independent_case_summaries',
        'reflective_practice_reports',
        'declarations_of_readiness',
        'final_evaluations',
        'addendum_forms'
      ];
    default:
      return [];
  }
};
