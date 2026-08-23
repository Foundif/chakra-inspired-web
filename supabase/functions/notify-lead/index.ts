// Sends a new-lead notification email to the business inbox via Resend gateway.
import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';
const TO_EMAIL = 'info@srikanishenterprises.com';
const FROM_EMAIL = 'Sri Kanish Leads <leads@srikanishenterprises.com>';

interface LeadPayload {
  name?: string;
  phone?: string;
  email?: string;
  company?: string;
  product_interest?: string;
  quantity?: string;
  message?: string;
  source?: string;
  page_path?: string;
}

function esc(s: unknown) {
  return String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY not configured');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    const lead = (await req.json()) as LeadPayload;
    if (!lead?.name || !lead?.phone) {
      return new Response(JSON.stringify({ error: 'name and phone required' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const rows: [string, unknown][] = [
      ['Name', lead.name], ['Phone', lead.phone], ['Email', lead.email],
      ['Company', lead.company], ['Product', lead.product_interest],
      ['Quantity', lead.quantity], ['Message', lead.message],
      ['Source', lead.source], ['Page', lead.page_path],
    ];
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#fff;color:#111">
        <h2 style="color:#e85d3a;margin:0 0 16px">New Lead — Sri Kanish Enterprises</h2>
        <table style="width:100%;border-collapse:collapse">
          ${rows.filter(([, v]) => v).map(([k, v]) => `
            <tr><td style="padding:8px 10px;background:#f5f5f5;font-weight:600;width:130px">${esc(k)}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #eee">${esc(v)}</td></tr>`).join('')}
        </table>
        <p style="margin-top:24px;color:#666;font-size:12px">Submitted ${new Date().toLocaleString()}</p>
      </div>`;

    const subject = `New Lead: ${lead.name}${lead.product_interest ? ` — ${lead.product_interest}` : ''}`;

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'X-Connection-Api-Key': RESEND_API_KEY,
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: [TO_EMAIL],
        reply_to: lead.email || undefined,
        subject,
        html,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(`Resend error ${res.status}: ${JSON.stringify(data)}`);

    return new Response(JSON.stringify({ ok: true, id: data?.id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('notify-lead error', e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
