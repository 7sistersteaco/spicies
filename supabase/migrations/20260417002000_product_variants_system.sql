-- 7 Sisters Tea Co. - Product Variants System Upgrade
-- Transition from JSONB-based variants to a relational table for accurate stock & pricing control.

-- 1. Create the product_variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  label text NOT NULL,
  sku text,
  weight_grams int DEFAULT 0,
  price_inr int NOT NULL DEFAULT 0,
  compare_at_inr int,
  stock_qty int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2. Migrate existing variants from JSONB to rows
-- We handle both camelCase (from code) and snake_case (from init seed) keys
INSERT INTO public.product_variants (
  product_id, 
  label, 
  sku, 
  weight_grams, 
  price_inr, 
  compare_at_inr, 
  stock_qty, 
  is_active
)
SELECT 
  p.id as product_id,
  COALESCE(v->>'weight_label', v->>'weightLabel', 'Standard') as label,
  v->>'sku' as sku,
  COALESCE((v->>'weight_grams')::int, (v->>'weightGrams')::int, 0) as weight_grams,
  COALESCE((v->>'price_inr')::int, (v->>'priceInr')::int, 0) as price_inr,
  COALESCE((v->>'compare_at_inr')::int, (v->>'compareAtInr')::int) as compare_at_inr,
  COALESCE((v->>'stock_qty')::int, (v->>'stockQty')::int, 0) as stock_qty,
  COALESCE((v->>'is_active')::boolean, (v->>'isActive')::boolean, true) as is_active
FROM public.products p, jsonb_array_elements(p.variants) v;

-- 3. Cleanup: Remove the deprecated JSON column
ALTER TABLE public.products DROP COLUMN IF EXISTS variants;

-- 4. Enable updated_at trigger
CREATE TRIGGER set_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Security & RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Anonymous users can read active variants
DROP POLICY IF EXISTS "Public read active variants" ON public.product_variants;
CREATE POLICY "Public read active variants" 
ON public.product_variants FOR SELECT 
USING (is_active = true);

-- Service role (Admin) has full access
DROP POLICY IF EXISTS "Admin full access variants" ON public.product_variants;
CREATE POLICY "Admin full access variants" 
ON public.product_variants FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants (product_id);
CREATE INDEX IF NOT EXISTS product_variants_active_idx ON public.product_variants (is_active);
