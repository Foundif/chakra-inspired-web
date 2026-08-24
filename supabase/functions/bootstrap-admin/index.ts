// One-time admin bootstrap: creates the admin auth user and grants super_admin
// if no super admin exists yet. Self-limiting — once the user and a super admin
// exist, this function does nothing.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204 });

  const email = Deno.env.get("ADMIN_BOOTSTRAP_EMAIL");
  const password = Deno.env.get("ADMIN_BOOTSTRAP_PASSWORD");
  if (!email || !password) {
    return Response.json({ error: "bootstrap not configured" }, { status: 500 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const { data: list, error: listErr } = await supabase.auth.admin.listUsers({ perPage: 1000 });
  if (listErr) return Response.json({ error: listErr.message }, { status: 500 });

  let user = list.users.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  let created = false;
  if (!user) {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (error || !data.user) {
      return Response.json({ error: error?.message ?? "create failed" }, { status: 500 });
    }
    user = data.user;
    created = true;
  }

  // Grant super_admin only while none exists (first-run bootstrap).
  const { data: sa } = await supabase
    .from("user_roles")
    .select("id")
    .eq("role", "super_admin")
    .limit(1);
  let roleGranted = false;
  if (!sa?.length) {
    const { error } = await supabase
      .from("user_roles")
      .upsert({ user_id: user.id, role: "super_admin" }, { onConflict: "user_id,role" });
    if (error) return Response.json({ error: error.message }, { status: 500 });
    roleGranted = true;
  }

  return Response.json({ ok: true, created, roleGranted });
});
