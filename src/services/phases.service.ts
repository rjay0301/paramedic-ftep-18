
import { supabase } from '../integrations/supabase/client';

export const phasesService = {
  async getAllPhases() {
    const { data, error } = await supabase
      .from('training_phases')
      .select('*')
      .order('order_index', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getPhaseById(phaseId: string) {
    const { data, error } = await supabase
      .from('training_phases')
      .select('*')
      .eq('id', phaseId)
      .single();

    if (error) throw error;
    return data;
  }
};
