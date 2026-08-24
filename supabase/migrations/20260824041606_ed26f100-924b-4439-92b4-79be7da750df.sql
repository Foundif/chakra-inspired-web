-- Internal trigger functions: not API-callable
REVOKE EXECUTE ON FUNCTION public.tg_set_updated_at() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_customer() FROM PUBLIC, anon, authenticated;

-- has_role: needed by signed-in users for RLS policy evaluation, not by anonymous visitors
REVOKE EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;

-- claim functions: signed-in users only (guarded internally so only the first admin can self-claim)
REVOKE EXECUTE ON FUNCTION public.claim_super_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.claim_admin() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.claim_super_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.claim_admin() TO authenticated;