// Edge Function: backfill_placeholder_auth_users
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

serve(async (_req) => {
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL"),
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false } }
  );

  // Step 1: Query emails flagged for create_account = true
  const { data: rows, error: queryError } = await supabase
    .from("personnel_emails")
    .select(`id, personnel_id, address`)
    .eq("create_account", true);

  if (queryError) {
    return new Response(JSON.stringify({ error: queryError.message }), { status: 500 });
  }

  const results = [];

  for (const row of rows) {
    const email = row.address;
    const oldPersonnelId = row.personnel_id;

    // Step 2: Create Supabase Auth user
    const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      password: crypto.randomUUID(),
      ban_duration: "876000h" // temporarily disable login
    });

    if (!authUser || authError) {
      results.push({ email, oldPersonnelId, error: authError?.message });
      continue;
    }

    const newAuthId = authUser.user.id;

    // Step 3: Update personnel record
    const { error: updatePersonnelError } = await supabase
      .from("personnel")
      .update({ id: newAuthId })
      .eq("id", oldPersonnelId);

    if (updatePersonnelError) {
      results.push({ email, oldPersonnelId, newAuthId, error: updatePersonnelError.message });
      continue;
    }

    // Step 4: Update personnel_emails record
    const { error: updateEmailError } = await supabase
      .from("personnel_emails")
      .update({
        personnel_id: newAuthId,
        create_account: false,
        is_disabled: true,
        is_verified: false,
        is_invited: false
      })
      .eq("id", row.id);

    results.push({
      email,
      oldPersonnelId,
      newAuthId,
      success: !updatePersonnelError && !updateEmailError
    });
  }

  return new Response(JSON.stringify({ results }, null, 2), {
    headers: { "Content-Type": "application/json" }
  });
});
