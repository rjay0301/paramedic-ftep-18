import { supabase } from '@/integrations/supabase/client';
const sb = supabase as any;
import { FormDataValue } from '@/types/forms';
import { AddendumForm, AddendumFormType } from '@/types/addendum';

/**
 * Save or update an addendum form
 * @param studentId The student ID
 * @param formType The type of form (e.g., 'instructional-copy')
 * @param content The form content
 * @param status The form status ('draft', 'submitted', etc)
 * @param submittedAt Optional submission timestamp
 * @returns The saved form data
 */
export async function saveAddendumForm(
  studentId: string,
  formType: AddendumFormType,
  content: Record<string, FormDataValue>,
  status: 'draft' | 'submitted' | 'approved' | 'rejected' = 'draft',
  submittedAt?: string
): Promise<any> {
  // Check if the form already exists
  const { data: existingForm } = await sb
    .from('addendum_forms')
    .select('id')
    .eq('student_id', studentId)
    .eq('form_type', formType)
    .single();

  if (existingForm) {
    // Update existing form
    return sb
      .from('addendum_forms')
      .update({
        content,
        status,
        submitted_at: submittedAt ? submittedAt : status === 'submitted' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingForm.id)
      .select()
      .single();
  } else {
    // Create new form
    return sb
      .from('addendum_forms')
      .insert({
        student_id: studentId,
        form_type: formType,
        content,
        status,
        submitted_at: submittedAt ? submittedAt : status === 'submitted' ? new Date().toISOString() : null
      })
      .select()
      .single();
  }
}

/**
 * Get an addendum form
 * @param studentId The student ID
 * @param formType The type of form (e.g., 'instructional-copy')
 * @returns The form data or null if not found
 */
export async function getAddendumForm(
  studentId: string,
  formType: AddendumFormType
): Promise<Record<string, FormDataValue> | null> {
  const { data, error } = await sb
    .from('addendum_forms')
    .select('content')
    .eq('student_id', studentId)
    .eq('form_type', formType)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching addendum form:', error);
    return null;
  }

  return data.content as Record<string, FormDataValue>;
}

/**
 * Get the status of an addendum form
 * @param studentId The student ID
 * @param formType The type of form (e.g., 'instructional-copy')
 * @returns The form status or null if not found
 */
export async function getAddendumFormStatus(
  studentId: string,
  formType: AddendumFormType
): Promise<string | null> {
  const { data, error } = await sb
    .from('addendum_forms')
    .select('status')
    .eq('student_id', studentId)
    .eq('form_type', formType)
    .maybeSingle();

  if (error || !data) {
    console.error('Error fetching addendum form status:', error);
    return null;
  }

  return data.status;
}

/**
 * Delete an addendum form
 * @param studentId The student ID
 * @param formType The type of form (e.g., 'instructional-copy')
 */
export async function deleteAddendumForm(
  studentId: string,
  formType: AddendumFormType
): Promise<void> {
  const { error } = await sb
    .from('addendum_forms')
    .delete()
    .eq('student_id', studentId)
    .eq('form_type', formType);

  if (error) {
    console.error('Error deleting addendum form:', error);
    throw error;
  }
}
