ALTER TABLE public.isp_customers
  ADD COLUMN IF NOT EXISTS payment_link text,
  ADD COLUMN IF NOT EXISTS portal_user_id uuid;

ALTER TABLE public.isp_invoices
  ADD COLUMN IF NOT EXISTS payment_link text;

ALTER TABLE public.site_settings
  ADD COLUMN IF NOT EXISTS upi_id text,
  ADD COLUMN IF NOT EXISTS upi_payee_name text;

ALTER TABLE public.customer_profiles
  ADD COLUMN IF NOT EXISTS customer_id uuid REFERENCES public.isp_customers(id) ON DELETE SET NULL;

CREATE UNIQUE INDEX IF NOT EXISTS isp_customers_customer_code_key
  ON public.isp_customers (lower(customer_code)) WHERE customer_code IS NOT NULL;

CREATE OR REPLACE FUNCTION public.my_customer_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT customer_id FROM public.customer_profiles WHERE id = auth.uid()
$$;

REVOKE EXECUTE ON FUNCTION public.my_customer_id() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.my_customer_id() TO authenticated;

DROP POLICY IF EXISTS "Customer can view own record" ON public.isp_customers;
CREATE POLICY "Customer can view own record" ON public.isp_customers
  FOR SELECT TO authenticated USING (id = public.my_customer_id());

DROP POLICY IF EXISTS "Customer can view own connections" ON public.isp_connections;
CREATE POLICY "Customer can view own connections" ON public.isp_connections
  FOR SELECT TO authenticated USING (customer_id = public.my_customer_id());

DROP POLICY IF EXISTS "Customer can view own invoices" ON public.isp_invoices;
CREATE POLICY "Customer can view own invoices" ON public.isp_invoices
  FOR SELECT TO authenticated USING (customer_id = public.my_customer_id());

DROP POLICY IF EXISTS "Customer can view own payments" ON public.isp_payments;
CREATE POLICY "Customer can view own payments" ON public.isp_payments
  FOR SELECT TO authenticated USING (customer_id = public.my_customer_id());

DROP POLICY IF EXISTS "Customer can view own tickets" ON public.isp_tickets;
CREATE POLICY "Customer can view own tickets" ON public.isp_tickets
  FOR SELECT TO authenticated USING (customer_id = public.my_customer_id());

DROP POLICY IF EXISTS "Customer can raise own tickets" ON public.isp_tickets;
CREATE POLICY "Customer can raise own tickets" ON public.isp_tickets
  FOR INSERT TO authenticated WITH CHECK (customer_id = public.my_customer_id());

DROP POLICY IF EXISTS "Authenticated can view plans" ON public.isp_plans;
CREATE POLICY "Authenticated can view plans" ON public.isp_plans
  FOR SELECT TO authenticated USING (true);