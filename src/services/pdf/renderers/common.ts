
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

// Add section header and return new Y pos
export const addSectionHeader = (pdf: jsPDF, title: string, currentY: number): number => {
  if (currentY > pdf.internal.pageSize.getHeight() - 60) {
    pdf.addPage();
    currentY = 20;
  }
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text(title, 20, currentY);
  
  return currentY + 20;
};

// Extract content from various formats
export const extractFormContent = (content: any, defaultMessage: string = 'No content available'): string => {
  if (!content) {
    return defaultMessage;
  }
  
  try {
    // Handle string content
    if (typeof content === 'string') {
      return content;
    }
    
    // Handle object content
    if (typeof content === 'object') {
      // Case: { content: "text" } format
      if (content.content !== undefined) {
        if (typeof content.content === 'string') {
          return content.content;
        } else if (typeof content.content === 'object' && content.content !== null) {
          // Try to find a text field in the content object
          for (const key of ['text', 'value', 'answer', 'message']) {
            if (typeof content.content[key] === 'string') {
              return content.content[key];
            }
          }
          // Fall back to stringifying the content
          return JSON.stringify(content.content);
        }
      }
      
      // Special cases for certain tables
      if (content.assignment_answer) {
        return content.assignment_answer;
      }
      
      // Look for text fields at the top level
      for (const key of ['text', 'value', 'answer', 'message', 'description']) {
        if (typeof content[key] === 'string') {
          return content[key];
        }
      }
      
      // Fall back to the first string value
      for (const key of Object.keys(content)) {
        if (typeof content[key] === 'string') {
          return content[key];
        }
      }
      
      // If nothing else works, stringify it
      return JSON.stringify(content);
    }
    
    // Fall back to string conversion for any other type
    return String(content);
  } catch (e) {
    console.error('Error extracting content:', e);
    return defaultMessage;
  }
};

// Common function to render text content with proper wrapping
export const renderWrappedText = (pdf: jsPDF, text: string, x: number, y: number, maxWidth: number): number => {
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  
  const textLines = pdf.splitTextToSize(text || 'No content', maxWidth - 2*x);
  pdf.text(textLines, x, y);
  
  return y + (textLines.length * 5) + 10;
};
