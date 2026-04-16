-- 7 Sisters Tea Co. - Razorpay fields for orders table
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_order_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_payment_id TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS razorpay_signature TEXT;

-- Index for lookup
CREATE INDEX IF NOT EXISTS orders_razorpay_order_id_idx ON public.orders (razorpay_order_id);
