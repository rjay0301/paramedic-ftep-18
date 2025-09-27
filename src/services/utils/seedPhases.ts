
import { supabase } from '../../integrations/supabase/client';

/**
 * Seeds the training_phases table with initial data
 */
export async function seedTrainingPhases() {
  try {
    // Check if we already have phases
    const { data: existingPhases, error: checkError } = await supabase
      .from('training_phases')
      .select('count')
      .single();
      
    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking for existing phases:', checkError);
      return { success: false, error: checkError };
    }
    
    // If we already have phases, don't seed again
    if (existingPhases && existingPhases.count > 0) {
      console.log('Training phases already exist, skipping seed');
      return { success: true, message: 'Phases already exist' };
    }
    
    // Seed data
    const phases = [
      {
        name: 'Assignments',
        description: 'Complete all assignments to demonstrate understanding of theoretical concepts',
        order_index: 1
      },
      {
        name: 'Rural Ambulance',
        description: 'Rural Ambulance Orientation (2 shifts)',
        order_index: 2
      },
      {
        name: 'Observation',
        description: 'Observational Phase (2 shifts)',
        order_index: 3
      },
      {
        name: 'Instructional',
        description: 'Instructional Phase (6 shifts)',
        order_index: 4
      },
      {
        name: 'Instructional Evaluation',
        description: 'Instructional Shift Evaluation (6 shifts)',
        order_index: 5
      },
      {
        name: 'Instructional Summaries',
        description: 'Instructional Case Summaries (20 cases)',
        order_index: 6
      },
      {
        name: 'Independent',
        description: 'Independent Phase (6 shifts)',
        order_index: 7
      },
      {
        name: 'Independent Evaluation',
        description: 'Independent Shift Evaluation (6 shifts)',
        order_index: 8
      },
      {
        name: 'Independent Summaries',
        description: 'Independent Case Summaries (10 cases)',
        order_index: 9
      },
      {
        name: 'Declaration',
        description: 'Declaration of Readiness',
        order_index: 10
      },
      {
        name: 'Reflective',
        description: 'Reflective Practice Report',
        order_index: 11
      },
      {
        name: 'Final Evaluation',
        description: 'Final Evaluation (4 shifts)',
        order_index: 12
      }
    ];
    
    // Insert phases
    const { data, error } = await supabase
      .from('training_phases')
      .insert(phases)
      .select();
      
    if (error) {
      console.error('Error seeding training phases:', error);
      return { success: false, error };
    }
    
    console.log('Training phases seeded successfully:', data?.length);
    return { success: true, data };
  } catch (error) {
    console.error('Unexpected error seeding training phases:', error);
    return { success: false, error };
  }
}
