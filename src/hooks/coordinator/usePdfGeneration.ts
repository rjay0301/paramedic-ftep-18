
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { generatePhasePdf } from '@/services/pdf';
import { Student } from '@/types/coordinator';
import { PhaseType } from '@/services/pdf';
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const usePdfGeneration = () => {
  const { toast } = useToast();
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const handleGeneratePhasePdf = async (student: Student, phaseType: PhaseType) => {
    try {
      setIsPdfGenerating(true);
      toast({
        title: "Generating PDF",
        description: `Creating ${phaseType} report for ${student.name}...`,
      });
      
      await generatePhasePdf(student, phaseType);
      
      toast({
        title: "PDF Generated",
        description: "Your PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('PDF generation error:', error);
      toast({
        title: "PDF Generation Failed",
        description: "Failed to generate the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleFormPdfGeneration = async (formId: string) => {
    try {
      setIsPdfGenerating(true);
      
      toast({
        title: "Generating Form PDF",
        description: "Creating PDF for the selected form...",
      });
      
      // Get the form submission details
      const { data: assignment, error: submissionError } = await sb
        .from('assignments')
        .select('*')
        .eq('id', formId)
        .single();
      
      if (submissionError || !assignment) {
        throw new Error('Failed to retrieve assignment');
      }
      
      console.log("Form submission details:", submission);
      
      // Get the actual form data
      const formData = assignment;
      
      if (!formData) {
        throw new Error('Failed to retrieve form data');
      }
      
      console.log("Form data retrieved:", formData);
      
      // Get complete student information
      const { data: student, error: studentError } = await sb
        .from('students')
        .select('id, full_name, email')
        .eq('id', assignment.student_id)
        .single();
      
      if (studentError || !student) {
        throw new Error('Failed to retrieve student information');
      }

      console.log("Student information retrieved:", student);
      
      // Process form content for better display
      let processedContent = formData;
      
      // Special handling for assignments
      if ((formData as any).content) {
        console.log('Processing assignment content for PDF:', (formData as any).content);
        
        let assignmentData: {
          assignmentNumber?: number;
          assignmentTitle?: string;
          assignmentDescription?: string;
          assignmentQuestion?: string;
          assignmentAnswer?: string;
        } = {};
        
        // Get assignment metadata from the assignment number
        switch(assignment.assignment_number) {
          case 1:
            assignmentData.assignmentTitle = "Ambulance Inventory";
            assignmentData.assignmentDescription = "Complete a full inventory of the ambulance during the shift.";
            assignmentData.assignmentQuestion = "Describe all the places on the ambulance where the following equipment can be found and how many of each item are on the ambulance: AP airway roll, Body Bag, Spare Oxygen Bottles, KED, Scoop Stretcher, Pelvic Sling, Chest triage bag.";
            break;
          case 2:
            assignmentData.assignmentTitle = "FTP Observation";
            assignmentData.assignmentDescription = "Observe your FTP in their completion of start and end of shift duties.";
            assignmentData.assignmentQuestion = "Closely observe your FTP in his/her completion of the start and end of shift duties and read SOP 4.2. Write down 4 things you learned about the process:";
            break;
          case 3:
            assignmentData.assignmentTitle = "Patient Assessment";
            assignmentData.assignmentDescription = "Read CPG regarding medical and trauma adult patient assessment.";
            assignmentData.assignmentQuestion = "Provide a quick description of medical and trauma adult patient assessment:";
            break;
          case 4:
            assignmentData.assignmentTitle = "Ambulance Parking at RTA";
            assignmentData.assignmentDescription = "Read SOP 4.7A regarding ambulance parking at RTA scenes.";
            assignmentData.assignmentQuestion = "Write down specifically how the ambulance should be parked on the scene of an RTA. What should you assess for when you first arrive?";
            break;
          case 5:
            assignmentData.assignmentTitle = "Non-Transport and Release of Patients";
            assignmentData.assignmentDescription = "Read SOP 4.8D regarding non-transport and release of patients.";
            assignmentData.assignmentQuestion = "What specifically do you need to document on your ePCR for a patient refusal? When should CTL be contacted? Who needs to sign the PCR?";
            break;
          case 6:
            assignmentData.assignmentTitle = "CCD Update";
            assignmentData.assignmentDescription = "Read SOP 4.8C regarding CCD Update.";
            assignmentData.assignmentQuestion = "Write down the format for updating CCD and briefly state what information should be included in ALL updates:";
            break;
          default:
            assignmentData.assignmentTitle = `Assignment ${assignment.assignment_number}`;
            assignmentData.assignmentDescription = "Complete the assignment as instructed.";
            break;
        }
        
        assignmentData.assignmentNumber = assignment.assignment_number;
        
        const contentVal: any = (formData as any).content;
        // Extract the answer from the content
        if (typeof contentVal === 'object' && contentVal !== null) {
          const assignmentContent = contentVal as Record<string, any>;
          
          if (assignmentContent.content) {
            if (typeof assignmentContent.content === 'string') {
              assignmentData.assignmentAnswer = assignmentContent.content;
            } else if (typeof assignmentContent.content === 'object' && assignmentContent.content !== null) {
              assignmentData.assignmentAnswer = JSON.stringify(assignmentContent.content, null, 2);
            }
          } else {
            for (const key of ['answer', 'response', 'text', 'value', 'assignmentAnswer']) {
              if (typeof assignmentContent[key] === 'string') {
                assignmentData.assignmentAnswer = assignmentContent[key];
                break;
              }
            }
            if (!assignmentData.assignmentAnswer) {
              assignmentData.assignmentAnswer = JSON.stringify(assignmentContent, null, 2);
            }
          }
        } else if (typeof contentVal === 'string') {
          assignmentData.assignmentAnswer = contentVal;
        } else {
          try {
            assignmentData.assignmentAnswer = JSON.stringify(contentVal);
          } catch (e) {
            assignmentData.assignmentAnswer = "Content not available in a readable format";
          }
        }
        
        processedContent = {
          ...(formData as any),
          assignmentData
        };
      }
      
      // Generate PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Set up document properties
      pdf.setProperties({
        title: `${student.full_name} - assignment #${assignment.assignment_number}`,
        subject: 'FTEP Workbook Form',
        author: 'HMCAS FTEP System',
        creator: 'HMCAS FTEP System'
      });
      
      // Add logo and title
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('HMCAS Field Training & Evaluation Program', 20, 20);
      
      pdf.setFontSize(14);
      const formTypeFormatted = submission.form_type
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
        
      pdf.text(formTypeFormatted, 20, 30);
      
      // Add student information
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Create a table for student information
      autoTable(pdf, {
        startY: 35,
        head: [['Student Information']],
        body: [
          ['Name', student.full_name || 'N/A'],
          ['Corp ID', student.corp_id || 'N/A'],
          ['Alpha Unit', student.alpha_unit_text || 'N/A'],
          ['Hub', student.hub_name || 'N/A'],
          ['FTP Name', student.ftp_name || 'N/A'],
          ['FTP Contact', student.ftp_contact || 'N/A'],
          ['Submission Date', submission.submitted_at ? new Date(submission.submitted_at).toLocaleDateString() : 'N/A'],
          ['Form Number', `#${submission.form_number}`]
        ],
        theme: 'grid',
        headStyles: { fillColor: [41, 128, 185], textColor: 255, fontStyle: 'bold' },
        margin: { left: 20, right: 20 }
      });
      
      // Handle special case for assignments
      if (submission.form_type === 'assignments' && processedContent.assignmentData) {
        const assignmentData = processedContent.assignmentData;
        
        autoTable(pdf, {
          startY: 100,
          head: [['Assignment Information']],
          body: [
            ['Title', assignmentData.assignmentTitle || 'N/A'],
            ['Description', assignmentData.assignmentDescription || 'N/A'],
            ['Question', assignmentData.assignmentQuestion || 'N/A']
          ],
          theme: 'grid',
          headStyles: { fillColor: [100, 100, 100], textColor: 255 },
          margin: { left: 20, right: 20 }
        });
        
        // @ts-ignore - We know this property exists
        const finalY = pdf.lastAutoTable.finalY;
        
        autoTable(pdf, {
          startY: finalY + 10,
          head: [['Answer']],
          body: [['']],
          theme: 'grid',
          headStyles: { fillColor: [100, 100, 100], textColor: 255 },
          margin: { left: 20, right: 20 }
        });
        
        // @ts-ignore - We know this property exists
        const answerY = pdf.lastAutoTable.finalY;
        
        // Add the content with proper formatting
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        const answerText = assignmentData.assignmentAnswer || 'No answer provided';
        const textLines = pdf.splitTextToSize(answerText, pdf.internal.pageSize.getWidth() - 40);
        pdf.text(textLines, 20, answerY + 10);
      } else {
        // Add form content as a table for other form types
        autoTable(pdf, {
          startY: 100,
          head: [['Form Content']],
          body: Object.entries(formData).map(([key, value]) => {
            // Skip technical fields
            if (['id', 'student_id', 'created_at', 'updated_at', 'submitted_at', 'status'].includes(key)) {
              return null;
            }
            
            // Format the value based on its type
            let displayValue = value;
            if (key === 'content' && typeof value === 'object' && value !== null) {
              // Special handling for content field
              const contentObj = value as Record<string, any>;
              if (contentObj.content) {
                displayValue = typeof contentObj.content === 'string' 
                  ? contentObj.content 
                  : JSON.stringify(contentObj.content, null, 2);
              } else {
                displayValue = JSON.stringify(contentObj, null, 2);
              }
            } else if (typeof value === 'object' && value !== null) {
              displayValue = JSON.stringify(value, null, 2);
            } else if (typeof value === 'boolean') {
              displayValue = value ? 'Yes' : 'No';
            } else if (value === null || value === undefined) {
              displayValue = 'N/A';
            }
            
            return [
              key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
              displayValue
            ];
          }).filter(Boolean),
          theme: 'grid',
          headStyles: { fillColor: [100, 100, 100], textColor: 255 },
          columnStyles: {
            0: { cellWidth: 60, fontStyle: 'bold' },
            1: { cellWidth: 'auto' }
          },
          margin: { left: 20, right: 20 }
        });
      }
      
      // Add footer
      const pageCount = pdf.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(100);
        pdf.text(
          `FTEP Workbook - ${student.full_name} - ${submission.form_type.replace(/_/g, ' ')} #${submission.form_number} - Page ${i} of ${pageCount}`,
          pdf.internal.pageSize.getWidth() / 2,
          pdf.internal.pageSize.getHeight() - 10,
          { align: 'center' }
        );
      }
      
      // Generate file name
      const fileName = `${student.full_name}-${submission.form_type}-${submission.form_number}.pdf`;
      
      // Save the PDF
      pdf.save(fileName);
      
      toast({
        title: "PDF Generated",
        description: "Your form PDF has been downloaded successfully.",
      });
    } catch (error) {
      console.error('Form PDF generation error:', error);
      toast({
        title: "Form PDF Generation Failed",
        description: "Failed to generate the form PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return {
    isPdfGenerating,
    handleGeneratePhasePdf,
    handleFormPdfGeneration
  };
};
