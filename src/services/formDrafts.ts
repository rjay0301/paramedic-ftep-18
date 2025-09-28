
import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;

/**
 * Save a form as a draft
 * @param formType The form type
 * @param formIdentifier A unique identifier for the form
 * @param studentId The student ID
 * @param formData The form data
 * @returns The saved draft
 */
export async function saveFormDraft<T extends Record<string, any>>(
  formType: string,
  formIdentifier: string,
  studentId: string,
  formData: T
): Promise<any> {
  // Check if a draft already exists
  const { data: existingDraft } = await sb
    .from('form_drafts')
    .select('*')
    .eq('form_type', formType)
    .eq('form_identifier', formIdentifier)
    .eq('student_id', studentId)
    .single();

  if (existingDraft) {
    // Update existing draft
    return sb
      .from('form_drafts')
      .update({
        form_data: formData,
        last_saved_at: new Date().toISOString(),
      })
      .eq('id', existingDraft.id)
      .select()
      .single();
  } else {
    // Create new draft
    return sb
      .from('form_drafts')
      .insert({
        form_type: formType,
        form_identifier: formIdentifier,
        student_id: studentId,
        form_data: formData,
      })
      .select()
      .single();
  }
}

/**
 * Get a form draft
 * @param formType The form type
 * @param formIdentifier A unique identifier for the form
 * @param studentId The student ID
 * @returns The form draft
 */
export async function getFormDraft<T extends Record<string, any>>(
  formType: string,
  formIdentifier: string,
  studentId: string
): Promise<T | null> {
  const { data, error } = await sb
    .from('form_drafts')
    .select('form_data')
    .eq('form_type', formType)
    .eq('form_identifier', formIdentifier)
    .eq('student_id', studentId)
    .single();

  if (error || !data) {
    return null;
  }

  return data.form_data as T;
}

/**
 * Delete a form draft
 * @param formType The form type
 * @param formIdentifier A unique identifier for the form
 * @param studentId The student ID
 */
export async function deleteFormDraft(
  formType: string,
  formIdentifier: string,
  studentId: string
): Promise<void> {
  await sb
    .from('form_drafts')
    .delete()
    .eq('form_type', formType)
    .eq('form_identifier', formIdentifier)
    .eq('student_id', studentId);
}
