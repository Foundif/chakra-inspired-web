
-- ENUMS
CREATE TYPE public.isp_customer_status AS ENUM ('active','inactive','suspended');
CREATE TYPE public.isp_conn_status AS ENUM ('active','suspended','disconnected','pending');
CREATE TYPE public.isp_invoice_status AS ENUM ('paid','unpaid','overdue','cancelled');
CREATE TYPE public.isp_ticket_status AS ENUM ('open','in_progress','resolved','closed');
CREATE TYPE public.isp_ticket_priority AS ENUM ('low','medium','high','urgent');

-- PLANS
CREATE TABLE public.isp_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  speed_mbps integer NOT NULL DEFAULT 50,
  price numeric NOT NULL DEFAULT 0,
  billing_cycle text NOT NULL DEFAULT 'monthly',
  data_limit text NOT NULL DEFAULT 'Unlimited',
  tv_channels integer DEFAULT 0,
  ott_apps integer DEFAULT 0,
  description text,
  is_business boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_plans TO authenticated;
GRANT ALL ON public.isp_plans TO service_role;
ALTER TABLE public.isp_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage plans" ON public.isp_plans FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- CUSTOMERS
CREATE TABLE public.isp_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text,
  phone text NOT NULL,
  alt_phone text,
  address text,
  area text,
  city text DEFAULT 'Aruppukottai',
  status public.isp_customer_status NOT NULL DEFAULT 'active',
  joined_on date NOT NULL DEFAULT current_date,
  aadhaar_ref text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_customers TO authenticated;
GRANT ALL ON public.isp_customers TO service_role;
ALTER TABLE public.isp_customers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage customers" ON public.isp_customers FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- CONNECTIONS
CREATE TABLE public.isp_connections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_no text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.isp_customers(id) ON DELETE CASCADE,
  plan_id uuid REFERENCES public.isp_plans(id) ON DELETE SET NULL,
  status public.isp_conn_status NOT NULL DEFAULT 'pending',
  installed_on date,
  expiry_on date,
  router_model text,
  router_mac text,
  ip_address text,
  olt_port text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_connections TO authenticated;
GRANT ALL ON public.isp_connections TO service_role;
ALTER TABLE public.isp_connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage connections" ON public.isp_connections FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- INVOICES
CREATE TABLE public.isp_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_no text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.isp_customers(id) ON DELETE CASCADE,
  connection_id uuid REFERENCES public.isp_connections(id) ON DELETE SET NULL,
  amount numeric NOT NULL DEFAULT 0,
  tax numeric NOT NULL DEFAULT 0,
  period_start date,
  period_end date,
  issued_on date NOT NULL DEFAULT current_date,
  due_on date,
  status public.isp_invoice_status NOT NULL DEFAULT 'unpaid',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_invoices TO authenticated;
GRANT ALL ON public.isp_invoices TO service_role;
ALTER TABLE public.isp_invoices ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage invoices" ON public.isp_invoices FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- PAYMENTS
CREATE TABLE public.isp_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES public.isp_invoices(id) ON DELETE CASCADE,
  customer_id uuid REFERENCES public.isp_customers(id) ON DELETE CASCADE,
  amount numeric NOT NULL DEFAULT 0,
  method text NOT NULL DEFAULT 'cash',
  reference text,
  paid_on date NOT NULL DEFAULT current_date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_payments TO authenticated;
GRANT ALL ON public.isp_payments TO service_role;
ALTER TABLE public.isp_payments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage payments" ON public.isp_payments FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- STAFF
CREATE TABLE public.isp_staff (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  role_title text NOT NULL DEFAULT 'Field Engineer',
  phone text,
  email text,
  area text,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_staff TO authenticated;
GRANT ALL ON public.isp_staff TO service_role;
ALTER TABLE public.isp_staff ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage staff" ON public.isp_staff FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- TICKETS
CREATE TABLE public.isp_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_no text NOT NULL UNIQUE,
  customer_id uuid REFERENCES public.isp_customers(id) ON DELETE SET NULL,
  subject text NOT NULL,
  category text NOT NULL DEFAULT 'technical',
  description text,
  priority public.isp_ticket_priority NOT NULL DEFAULT 'medium',
  status public.isp_ticket_status NOT NULL DEFAULT 'open',
  assigned_to uuid REFERENCES public.isp_staff(id) ON DELETE SET NULL,
  resolution text,
  resolved_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.isp_tickets TO authenticated;
GRANT ALL ON public.isp_tickets TO service_role;
ALTER TABLE public.isp_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins manage tickets" ON public.isp_tickets FOR ALL TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'))
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- ACTIVITY LOG
CREATE TABLE public.isp_activity_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id uuid,
  actor_email text,
  action text NOT NULL,
  entity text,
  entity_id text,
  details text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.isp_activity_log TO authenticated;
GRANT ALL ON public.isp_activity_log TO service_role;
ALTER TABLE public.isp_activity_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "admins read logs" ON public.isp_activity_log FOR SELECT TO authenticated
  USING (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));
CREATE POLICY "admins write logs" ON public.isp_activity_log FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(),'admin') OR has_role(auth.uid(),'super_admin'));

-- updated_at triggers
CREATE TRIGGER isp_plans_updated BEFORE UPDATE ON public.isp_plans FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER isp_customers_updated BEFORE UPDATE ON public.isp_customers FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER isp_connections_updated BEFORE UPDATE ON public.isp_connections FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER isp_invoices_updated BEFORE UPDATE ON public.isp_invoices FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER isp_payments_updated BEFORE UPDATE ON public.isp_payments FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER isp_staff_updated BEFORE UPDATE ON public.isp_staff FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();
CREATE TRIGGER isp_tickets_updated BEFORE UPDATE ON public.isp_tickets FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();

CREATE INDEX ON public.isp_connections(customer_id);
CREATE INDEX ON public.isp_invoices(customer_id);
CREATE INDEX ON public.isp_tickets(status);
