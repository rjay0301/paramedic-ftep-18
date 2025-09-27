
// Edge Function to handle role updates and create student/coordinator records
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Get the request body
    const { role, userId } = await req.json();
    
    // Validate inputs
    if (!role || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: role and userId' }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 400 
        }
      );
    }

    // Create a Supabase client with the role key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update the user's role in the profiles table
    const { data: profileData, error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({ role })
      .eq('id', userId)
      .select()
      .single();

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return new Response(
        JSON.stringify({ error: 'Failed to update role', details: profileError }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 500 
        }
      );
    }

    // The role update trigger should automatically create student/coordinator records
    // We can check if the records were created properly
    
    if (role === 'student') {
      // Check if student record exists
      const { data: studentData, error: studentError } = await supabaseAdmin
        .from('students')
        .select('id, status')
        .eq('profile_id', userId)
        .maybeSingle();

      if (studentError) {
        console.error('Error checking student record:', studentError);
        return new Response(
          JSON.stringify({ 
            error: 'Role updated but error checking student record', 
            details: studentError 
          }),
          { 
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500 
          }
        );
      }

      if (!studentData) {
        // Create student record manually if trigger didn't work
        const { data: newStudentData, error: newStudentError } = await supabaseAdmin
          .from('students')
          .insert({
            profile_id: userId,
            status: 'active',
            full_name: profileData?.full_name,
            email: profileData?.email
          })
          .select()
          .single();

        if (newStudentError) {
          console.error('Error creating student record:', newStudentError);
          return new Response(
            JSON.stringify({ 
              error: 'Role updated but failed to create student record', 
              details: newStudentError 
            }),
            { 
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
              status: 500 
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Role updated and student record created',
            profile: profileData,
            student: newStudentData
          }),
          { 
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 200 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Role updated and student record exists',
          profile: profileData,
          student: studentData
        }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200 
        }
      );
    } else if (role === 'coordinator') {
      // Check if coordinator record exists
      const { data: coordinatorData, error: coordinatorError } = await supabaseAdmin
        .from('coordinators')
        .select('id, status')
        .eq('profile_id', userId)
        .maybeSingle();

      if (coordinatorError) {
        console.error('Error checking coordinator record:', coordinatorError);
        return new Response(
          JSON.stringify({ 
            error: 'Role updated but error checking coordinator record', 
            details: coordinatorError 
          }),
          { 
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 500 
          }
        );
      }

      if (!coordinatorData) {
        // Create coordinator record manually if trigger didn't work
        const { data: newCoordinatorData, error: newCoordinatorError } = await supabaseAdmin
          .from('coordinators')
          .insert({
            profile_id: userId,
            status: 'active'
          })
          .select()
          .single();

        if (newCoordinatorError) {
          console.error('Error creating coordinator record:', newCoordinatorError);
          return new Response(
            JSON.stringify({ 
              error: 'Role updated but failed to create coordinator record', 
              details: newCoordinatorError 
            }),
            { 
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
              status: 500 
            }
          );
        }
        
        return new Response(
          JSON.stringify({ 
            success: true, 
            message: 'Role updated and coordinator record created',
            profile: profileData,
            coordinator: newCoordinatorData
          }),
          { 
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
            status: 200 
          }
        );
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Role updated and coordinator record exists',
          profile: profileData,
          coordinator: coordinatorData
        }),
        { 
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
          status: 200 
        }
      );
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Role updated successfully',
        profile: profileData
      }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 200 
      }
    );
  } catch (err) {
    console.error('Unexpected error:', err);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: err.message }),
      { 
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
        status: 500 
      }
    );
  }
});
