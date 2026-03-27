// supabase/functions/send-followups/index.ts
// Deploy with: supabase functions deploy send-followups
// Schedule via Supabase Dashboard > Edge Functions > Schedules (daily at 9am)

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')!
const SITE_URL = 'https://shenbrian.github.io/humanexodus'

serve(async () => {
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

  // Find sessions that are ~30 days old, have an email, and haven't been followed up yet
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyOneDaysAgo = new Date()
  thirtyOneDaysAgo.setDate(thirtyOneDaysAgo.getDate() - 31)

  const { data: sessions, error } = await supabase
    .from('sessions')
    .select('*')
    .not('email', 'is', null)
    .gte('created_at', thirtyOneDaysAgo.toISOString())
    .lte('created_at', thirtyDaysAgo.toISOString())

  if (error) {
    console.error('Error fetching sessions:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

  if (!sessions || sessions.length === 0) {
    return new Response(JSON.stringify({ message: 'No sessions to follow up', sent: 0 }), { status: 200 })
  }

  // Check which ones already have a follow-up
  const sessionIds = sessions.map(s => s.session_id)
  const { data: existing } = await supabase
    .from('follow_ups')
    .select('session_id')
    .in('session_id', sessionIds)

  const alreadyFollowedUp = new Set((existing || []).map(f => f.session_id))
  const toEmail = sessions.filter(s => !alreadyFollowedUp.has(s.session_id))

  let sent = 0

  for (const session of toEmail) {
    const followUpUrl = `${SITE_URL}/followup.html?sid=${session.session_id}`

    const intentLabel = {
      learn_ai: 'Learn AI skills',
      switch_role: 'Switch role',
      stay_same: 'Stay in current role',
      not_sure: 'Not sure'
    }[session.selected_next_move] || session.selected_next_move

    const emailHtml = `
      <div style="font-family: 'IBM Plex Mono', monospace; background: #0a0a0a; color: #e8e8e8; padding: 40px; max-width: 560px;">
        <div style="border-left: 2px solid #c8f562; padding-left: 16px; margin-bottom: 32px;">
          <div style="font-size: 10px; letter-spacing: 0.2em; color: #555; text-transform: uppercase; margin-bottom: 6px;">HumanExodus / 30 day follow-up</div>
          <div style="font-size: 20px; font-weight: 600; color: #c8f562;">What actually happened?</div>
        </div>

        <p style="font-size: 13px; color: #aaa; margin-bottom: 24px; line-height: 1.6;">
          30 days ago you analysed your position as a <strong style="color:#e8e8e8">${session.role_input}</strong>.
          Your AI exposure was rated <strong style="color:#e8e8e8">${session.exposure_level}</strong>,
          and you said you were most likely to: <strong style="color:#c8f562">${intentLabel}</strong>.
        </p>

        <p style="font-size: 13px; color: #aaa; margin-bottom: 32px; line-height: 1.6;">
          What actually happened? Your answer closes the loop — intention vs reality is the most valuable signal in the system.
        </p>

        <a href="${followUpUrl}" style="display:inline-block; background:#c8f562; color:#000; font-family:monospace; font-size:12px; font-weight:600; letter-spacing:0.1em; text-transform:uppercase; padding:14px 28px; text-decoration:none;">
          Report what happened →
        </a>

        <p style="font-size: 11px; color: #444; margin-top: 32px; line-height: 1.5;">
          This is the only email we'll send. No newsletter. No marketing.<br>
          HumanExodus is an open-source research project.
        </p>
      </div>
    `

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'HumanExodus <followup@humanexodus.io>',
        to: session.email,
        subject: '30 days later — what actually happened?',
        html: emailHtml
      })
    })

    if (res.ok) {
      sent++
      console.log(`Sent follow-up to session ${session.session_id}`)
    } else {
      const err = await res.text()
      console.error(`Failed to send to ${session.session_id}:`, err)
    }
  }

  return new Response(JSON.stringify({ sent, total: toEmail.length }), { status: 200 })
})
