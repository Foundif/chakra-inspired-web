// Verifies a customer ID + phone against the customer records and returns the
// portal email to sign in with. No self sign-up: accounts exist only for
// customers imported by staff.
import { createClient } from "npm:@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const PORTAL_DOMAIN = "portal.chakrafibernet.local";
const digits = (v: string) => v.replace(/\D/g, "");

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const body = await req.json().catch(() => ({}));
    const code = String(body?.customer_code ?? "").trim();
    const phoneRaw = String(body?.phone ?? "").trim();
    const phone = digits(phoneRaw);

    if (!code || code.length > 64 || phone.length < 6 || phone.length > 15) {
      return json({ error: "Enter a valid customer ID and mobile number." }, 400);
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
      { auth: { persistSession: false } },
    );

    const { data: customers, error } = await admin
      .from("isp_customers")
      .select("id, full_name, phone, customer_code, portal_user_id")
      .ilike("customer_code", code)
      .limit(2);
    if (error) throw error;

    const customer = (customers ?? []).find((c) => digits(String(c.phone ?? "")).endsWith(phone.slice(-10)));
    if (!customer) {
      return json({ error: "Customer ID and mobile number do not match our records." }, 401);
    }

    const email = `${code.toLowerCase().replace(/[^a-z0-9._-]/g, "")}@${PORTAL_DOMAIN}`;
    const password = `cf-${phone}`;
    let userId = customer.portal_user_id as string | null;

    if (userId) {
      await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    } else {
      const { data: created, error: createErr } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: customer.full_name, phone: customer.phone, customer_code: customer.customer_code },
      });
      if (createErr || !created.user) {
        // Account may already exist for this ID — reset its password instead.
        const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
        const existing = list?.users?.find((u) => u.email === email);
        if (!existing) return json({ error: "Could not open your portal account. Please contact support." }, 500);
        userId = existing.id;
        await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
      } else {
        userId = created.user.id;
      }
    }

    await admin.from("customer_profiles").upsert({
      id: userId,
      customer_id: customer.id,
      full_name: customer.full_name,
      phone: customer.phone,
    });
    await admin.from("isp_customers").update({ portal_user_id: userId }).eq("id", customer.id);

    return json({ email, password });
  } catch (e) {
    console.error("customer-login failed", e);
    return json({ error: "Something went wrong. Please try again." }, 500);
  }
});
