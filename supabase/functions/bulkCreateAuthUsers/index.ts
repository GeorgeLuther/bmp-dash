// @deno-types="npm:@types/node"
import { serve } from 'https://deno.land/std/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Fetch personnel without email records
  const { data: personnel, error } = await supabase
    .from('personnel')
    .select('id, first_name, last_name, preferred_name')
    .not('id', 'in', supabase
      .from('personnel_emails')
      .select('personnel_id')
    )

  if (error) return new Response(JSON.stringify({ error }), { status: 500 })

  const domain = 'bullmetal.app'
  const seen = new Map<string, number>()
  const summaries = []

  for (const person of personnel) {
    const base = (person.preferred_name || person.first_name).toLowerCase()
    const lastInitial = person.last_name[0]?.toLowerCase() || 'x'
    let email = `${base}@${domain}`

    if (seen.has(base)) {
      email = `${base}.${lastInitial}`
      const count = seen.get(email) || 1
      email = `${email}${count > 1 ? count : ''}@${domain}`
      seen.set(base, count + 1)
    } else {
      seen.set(base, 1)
    }

    // Create the auth user
    const { data: authUser, error: authErr } = await supabase.auth.admin.createUser({
      email,
      email_confirm: false,
      password: crypto.randomUUID()
    })

    if (authErr) {
      summaries.push({ person_id: person.id, email, error: authErr.message })
      continue
    }

    const auth_id = authUser.user?.id

    // Update personnel table
    await supabase.from('personnel')
      .update({ id: auth_id })
      .eq('id', person.id)

    // Insert personnel_email
    await supabase.from('personnel_emails').insert({
      id: crypto.randomUUID(),
      personnel_id: auth_id,
      email,
      is_primary: true,
      send_notifications: false
    })

    summaries.push({ person_id: person.id, new_auth_id: auth_id, email })
  }

  return new Response(JSON.stringify({ summaries }, null, 2), { status: 200 })
})
