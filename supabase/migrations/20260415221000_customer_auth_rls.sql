-- 7 Sisters Tea Co. - Customer Auth & RLS
ALTER TABLE public.customers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- Index for lookup
CREATE INDEX IF NOT EXISTS customers_user_id_idx ON public.customers (user_id);

-- RLS Updates
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own customer record
CREATE POLICY "Users can view own customer record"
ON public.customers FOR SELECT
USING (auth.uid() = user_id);

-- Policy: Users can update their own customer record
CREATE POLICY "Users can update own customer record"
ON public.customers FOR UPDATE
USING (auth.uid() = user_id);

-- Policy: Users can view their own orders
-- We join via customer_id to ensure user_id matches
CREATE POLICY "Users can view own orders"
ON public.orders FOR SELECT
USING (
  customer_id IN (
    SELECT id FROM public.customers WHERE user_id = auth.uid()
  )
);

-- Admin still has full access via service_role (already exists as "Server-only" policies)
