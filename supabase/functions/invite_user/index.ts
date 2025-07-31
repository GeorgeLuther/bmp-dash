import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.5";

serve(async (req) => {
  try {
    const body = await req.json();
    const { email, personnel_id } = body;

    if (!email || !personnel_id) {
      return new Response(
        JSON.stringify({ error: "Missing email or personnel_id" }),
        { status: 400 }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Step 1: Invite the user by email
    const { data: user, error } =
      await supabase.auth.admin.inviteUserByEmail(email);
    if (error || !user) {
      return new Response(
        JSON.stringify({ error: error?.message || "User invite failed" }),
        {
          status: 500,
        }
      );
    }

    // Step 2: Link to personnel
    const { error: linkError } = await supabase.rpc(
      "associate_personnel_to_auth",
      {
        user_id: user.id,
        personnel_id,
      }
    );

    if (linkError) {
      return new Response(JSON.stringify({ error: linkError.message }), {
        status: 500,
      });
    }

    return new Response(JSON.stringify({ success: true, user_id: user.id }), {
      status: 200,
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
