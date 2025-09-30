
import { supabase } from '@/integrations/supabase/client';
import { HubData } from '@/types/forms';

/**
 * Gets all available hubs
 * @returns Array of hubs or empty array if error
 */
export const getHubs = async (): Promise<HubData[]> => {
  try {
    const { data, error } = await supabase
      .from('hubs')
      .select('id, name')
      .order('name');

    if (error) {
      console.error('Error fetching hubs:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error in getHubs:', error);
    return [];
  }
};

/**
 * Updates a hub's information
 * @param hubId The hub ID
 * @param hubData The hub data to update
 * @returns The updated hub data or null if error
 */
export const updateHub = async (hubId: string, hubData: Partial<HubData>): Promise<HubData | null> => {
  try {
    const { data, error } = await supabase
      .from('hubs')
      .update(hubData)
      .eq('id', hubId)
      .select()
      .single();

    if (error) {
      console.error('Error updating hub:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in updateHub:', error);
    return null;
  }
};

/**
 * Creates a new hub
 * @param hubData The hub data to create
 * @returns The created hub data or null if error
 */
export const createHub = async (hubData: Omit<HubData, 'id'>): Promise<HubData | null> => {
  try {
    const { data, error } = await supabase
      .from('hubs')
      .insert(hubData)
      .select()
      .single();

    if (error) {
      console.error('Error creating hub:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in createHub:', error);
    return null;
  }
};
