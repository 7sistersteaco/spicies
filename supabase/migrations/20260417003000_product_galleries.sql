-- 7 Sisters Tea Co. - Product Galleries & Variant Sorting
-- Upgrading product system to support multi-image galleries and precise variant ordering.

-- 1. Upgrade product_variants table
ALTER TABLE public.product_variants ADD COLUMN IF NOT EXISTS sort_order int DEFAULT 0;

-- 2. Create product_images table
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  image_url text NOT NULL,
  sort_order int DEFAULT 0,
  is_primary boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 3. Data Migration: Move existing image data to the new table
-- Primary image from products.image_url
INSERT INTO public.product_images (product_id, image_url, sort_order, is_primary)
SELECT 
  id as product_id,
  image_url,
  0 as sort_order,
  true as is_primary
FROM public.products
WHERE image_url IS NOT NULL;

-- Secondary images from products.images JSONB (if any remained)
INSERT INTO public.product_images (product_id, image_url, sort_order, is_primary)
SELECT 
  p.id as product_id,
  v->>'url' as image_url,
  (row_number() OVER (PARTITION BY p.id ORDER BY v->>'url')) + 1 as sort_order,
  false as is_primary
FROM public.products p, jsonb_array_elements(p.images) v
WHERE v->>'url' IS NOT NULL 
AND v->>'url' <> p.image_url;

-- 4. Cleanup: Remove deprecated image columns from products table
ALTER TABLE public.products DROP COLUMN IF EXISTS images;
ALTER TABLE public.products DROP COLUMN IF EXISTS image_url;

-- 5. Security & RLS for product_images
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read product images" 
ON public.product_images FOR SELECT 
USING (true);

CREATE POLICY "Admin full access product images" 
ON public.product_images FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 6. Indexes for gallery performance
CREATE INDEX IF NOT EXISTS product_images_product_id_idx ON public.product_images (product_id);
CREATE INDEX IF NOT EXISTS product_images_sort_order_idx ON public.product_images (sort_order);
