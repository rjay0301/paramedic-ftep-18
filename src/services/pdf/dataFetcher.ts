import { supabase } from '@/integrations/supabase/client';
import { FormData } from './types';
import { getFormTypesByPhase } from './pdfUtils';
import { PhaseType } from './types';

/**
 * Fetch form data based on phase type
 */
export const fetchPhaseFormData = async (studentId: string, phaseType: PhaseType): Promise<FormData[]> => {
  const formTypes = getFormTypesByPhase(phaseType);
  
  if (formTypes.length === 0) {
    return [];
  }
  
  console.log(`Fetching form types for phase ${phaseType}:`, formTypes);
  
  try {
    // Fetch form submissions for the specified form types
    const { data, error } = await supabase
      .from('form_submissions')
      .select(`
        id,
        form_type,
        form_number,
        submitted_at,
        form_id,
        status
      `)
      .eq('student_id', studentId)
      .eq('status', 'submitted')
      .in('form_type', formTypes)
      .order('form_type', { ascending: true })
      .order('form_number', { ascending: true });
    
    if (error) {
      console.error('Error fetching form submissions:', error);
      return [];
    }
    
    console.log(`Found ${data?.length || 0} form submissions`);
    
    if (!data || data.length === 0) {
      return [];
    }
    
    // Fetch actual form content for each submission with detailed logging
    const formsWithContent: FormData[] = [];
    
    for (const submission of data) {
      try {
        console.log(`Fetching content for ${submission.form_type} #${submission.form_number} (ID: ${submission.form_id})`);
        
        // We need to use type assertion here to work with the dynamic form types
        const { data: formData, error: formError } = await (supabase as any)
          .from(submission.form_type)
          .select('*')
          .eq('id', submission.form_id)
          .single();
        
        if (formError) {
          console.error(`Error fetching ${submission.form_type} data:`, formError);
          continue;
        }
        
        if (formData) {
          console.log(`Successfully retrieved content for ${submission.form_type} #${submission.form_number}`);
          
          // For assignments, extract content properly
          let processedContent = formData;
          if (submission.form_type === 'assignments') {
            console.log('Assignment raw content:', (formData as any).content);
            
            // Ensure we have valid content data
            if ((formData as any).content) {
              // Try to parse the content if it's a string
              if (typeof (formData as any).content === 'string' && (formData as any).content.trim().startsWith('{')) {
                try {
                  processedContent = {
                    ...formData,
                    content: JSON.parse((formData as any).content)
                  };
                } catch (e) {
                  // If parsing fails, keep the original content
                }
              }
            }
          }
          
          formsWithContent.push({
            id: submission.id,
            formType: submission.form_type,
            formNumber: submission.form_number,
            submittedAt: submission.submitted_at,
            content: processedContent
          });
        }
      } catch (error) {
        console.error(`Error processing form ${submission.form_type}:`, error);
      }
    }
    
    return formsWithContent;
  } catch (e) {
    console.error("Exception in fetchPhaseFormData:", e);
    return [];
  }
};

/**
 * Fetch data for a specific form by ID
 */
export const fetchFormById = async (formId: string): Promise<FormData | null> => {
  try {
    // First get the submission details to know the form type
    const { data: submission, error: submissionError } = await supabase
      .from('form_submissions')
      .select('*')
      .eq('id', formId)
      .single();
    
    if (submissionError || !submission) {
      console.error('Error fetching form submission:', submissionError);
      return null;
    }
    
    // Then fetch the actual form data
    const { data: formData, error: formError } = await (supabase as any)
      .from(submission.form_type)
      .select('*')
      .eq('id', submission.form_id)
      .single();
    
    if (formError || !formData) {
      console.error('Error fetching form data:', formError);
      return null;
    }
    
    // Extract and process content properly based on form type
    let processedContent = formData;
    if (submission.form_type === 'assignments' && (formData as any).content) {
      console.log('Processing assignment content for form ID:', formId);
      console.log('Raw content:', (formData as any).content);
      
      // Special handling for assignments to ensure content is extracted properly
      if (typeof (formData as any).content === 'string' && (formData as any).content.trim().startsWith('{')) {
        try {
          processedContent = {
            ...formData,
            content: JSON.parse((formData as any).content)
          };
        } catch (e) {
          console.error('Error parsing assignment content:', e);
        }
      }
    }
    
    return {
      id: submission.id,
      formType: submission.form_type,
      formNumber: submission.form_number,
      submittedAt: submission.submitted_at,
      content: processedContent
    };
  } catch (error) {
    console.error('Exception in fetchFormById:', error);
    return null;
  }
};
