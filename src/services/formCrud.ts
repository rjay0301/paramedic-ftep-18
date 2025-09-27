
import { PostgrestFilterBuilder, PostgrestSingleResponse } from '@supabase/postgrest-js';
import { supabase } from '@/integrations/supabase/client';

/**
 * Insert a new record into a table
 * @param table The table name
 * @param data The data to insert
 * @returns The inserted record
 */
export async function insertRecord<T extends Record<string, any>>(
  table: string,
  data: T
): Promise<PostgrestSingleResponse<T>> {
  // Use type assertion to handle dynamic table name and explicitly convert to Promise
  return supabase.from(table as any).insert(data).select().single() as unknown as Promise<PostgrestSingleResponse<T>>;
}

/**
 * Update a record in a table
 * @param table The table name
 * @param id The record ID
 * @param data The data to update
 * @returns The updated record
 */
export async function updateRecord<T extends Record<string, any>>(
  table: string,
  id: string,
  data: T
): Promise<PostgrestSingleResponse<T>> {
  return supabase
    .from(table as any)
    .update(data)
    .eq('id', id)
    .select()
    .single() as unknown as Promise<PostgrestSingleResponse<T>>;
}

/**
 * Get a record by ID
 * @param table The table name
 * @param id The record ID
 * @returns The record
 */
export async function getRecordById<T extends Record<string, any>>(
  table: string,
  id: string
): Promise<PostgrestSingleResponse<T>> {
  return supabase
    .from(table as any)
    .select('*')
    .eq('id', id)
    .single() as unknown as Promise<PostgrestSingleResponse<T>>;
}

/**
 * Delete a record
 * @param table The table name
 * @param id The record ID
 * @returns The delete response
 */
export async function deleteRecord(
  table: string,
  id: string
): Promise<PostgrestSingleResponse<null>> {
  return supabase
    .from(table as any)
    .delete()
    .eq('id', id) as unknown as Promise<PostgrestSingleResponse<null>>;
}
