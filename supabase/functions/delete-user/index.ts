
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.0";

// Create a Supabase client with the service role key
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseServiceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

serve(async (req) => {
  try {
    // CORS headers
    const corsHeaders = {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
    };

    // Handle OPTIONS request for CORS
    if (req.method === "OPTIONS") {
      return new Response("ok", { headers: corsHeaders });
    }

    // Only allow POST requests
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), { 
        status: 405, 
        headers: corsHeaders 
      });
    }

    // Get the current user to check for admin permissions
    const authHeader = req.headers.get("Authorization") || "";
    const clientToken = authHeader.replace("Bearer ", "");
    
    // Create a client using the requester's token to check their role
    const clientSupabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      global: {
        headers: {
          Authorization: `Bearer ${clientToken}`,
        },
      },
    });
    
    // Verify the user is an admin
    const { data: profile, error: authError } = await clientSupabase
      .from("profiles")
      .select("role")
      .single();
      
    if (authError || profile?.role !== "admin") {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: "Unauthorized: Only admins can delete users" 
        }),
        { status: 403, headers: corsHeaders }
      );
    }

    // Get user ID from request body
    const { userId } = await req.json();
    
    if (!userId) {
      return new Response(
        JSON.stringify({ success: false, error: "User ID is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    // First run the database cleanup function to remove user data
    const { error: dbError } = await supabase.rpc("delete_user", { user_id: userId });
    
    if (dbError) {
      console.error("Database cleanup failed:", dbError);
      return new Response(
        JSON.stringify({ success: false, error: `Database cleanup failed: ${dbError.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }
    
    // Then delete the user from auth.users using Admin API directly
    try {
      // This uses the service role key implicitly via the supabase client
      await supabase.auth.admin.deleteUser(userId);
      console.log("User successfully deleted from auth system");
    } catch (authDeleteError) {
      console.warn("Error deleting from auth system:", authDeleteError);
      // Continue anyway as the DB deletion worked and auth user might already be gone
    }

    return new Response(
      JSON.stringify({ success: true, message: "User and associated data successfully deleted" }),
      { status: 200, headers: corsHeaders }
    );
  } catch (error) {
    console.error("Error handling delete user request:", error);
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
