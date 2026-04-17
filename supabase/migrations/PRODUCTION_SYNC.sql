-- Create branding bucket (Public)
insert into storage.buckets (id, name, public)
values ('branding', 'branding', true)
on conflict (id) do update set public = excluded.public;

-- RLS Policies for branding bucket
drop policy if exists "Public access branding select" on storage.objects;
drop policy if exists "Service role branding insert" on storage.objects;
drop policy if exists "Service role branding update" on storage.objects;
drop policy if exists "Service role branding delete" on storage.objects;

create policy "Public access branding select"
on storage.objects for select
using (bucket_id = 'branding');

create policy "Service role branding insert"
on storage.objects for insert
with check (auth.role() = 'service_role' and bucket_id = 'branding');

create policy "Service role branding update"
on storage.objects for update
using (auth.role() = 'service_role' and bucket_id = 'branding')
with check (auth.role() = 'service_role' and bucket_id = 'branding');

create policy "Service role branding delete"
on storage.objects for delete
using (auth.role() = 'service_role' and bucket_id = 'branding');
-- Create admin_notifications table
CREATE TABLE IF NOT EXISTS public.admin_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL, -- e.g., 'new_order', 'new_prebook', 'payment_success', 'status_update'
    reference_id UUID, -- order_id or prebook_id
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Add index for unread notifications
CREATE INDEX IF NOT EXISTS idx_admin_notifications_is_read ON public.admin_notifications(is_read) WHERE is_read = false;
CREATE INDEX IF NOT EXISTS idx_admin_notifications_created_at ON public.admin_notifications(created_at DESC);

-- Enable RLS (Admin only access)
ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

-- Policy to allow service role full management
DROP POLICY IF EXISTS "Service role manage admin_notifications" ON public.admin_notifications;
CREATE POLICY "Service role manage admin_notifications" 
ON public.admin_notifications FOR ALL 
USING (true)
WITH CHECK (true);

-- Policy to allow authenticated admin users to read (for fetching in UI)
DROP POLICY IF EXISTS "Admins read notifications" ON public.admin_notifications;
CREATE POLICY "Admins read notifications"
ON public.admin_notifications FOR SELECT
USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE raw_app_meta_data->>'role' = 'admin'
));
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
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'variants') THEN
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
  END IF;
END $$;

-- 3. Cleanup: Remove the deprecated JSON column
ALTER TABLE public.products DROP COLUMN IF EXISTS variants;

-- 4. Enable updated_at trigger
CREATE TRIGGER set_product_variants_updated_at
BEFORE UPDATE ON public.product_variants
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 5. Security & RLS
ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;

-- Anonymous users can read active variants
CREATE POLICY "Public read active variants" 
ON public.product_variants FOR SELECT 
USING (is_active = true);

-- Service role (Admin) has full access
CREATE POLICY "Admin full access variants" 
ON public.product_variants FOR ALL 
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- 6. Indexes for performance
CREATE INDEX IF NOT EXISTS product_variants_product_id_idx ON public.product_variants (product_id);
CREATE INDEX IF NOT EXISTS product_variants_active_idx ON public.product_variants (is_active);
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
DO $$
BEGIN
  -- Primary image from products.image_url
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'image_url') THEN
    INSERT INTO public.product_images (product_id, image_url, sort_order, is_primary)
    SELECT 
      id as product_id,
      image_url,
      0 as sort_order,
      true as is_primary
    FROM public.products
    WHERE image_url IS NOT NULL;
  END IF;

  -- Secondary images from products.images JSONB (if any remained)
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'images') THEN
    INSERT INTO public.product_images (product_id, image_url, sort_order, is_primary)
    SELECT 
      p.id as product_id,
      v->>'url' as image_url,
      (row_number() OVER (PARTITION BY p.id ORDER BY v->>'url')) + 1 as sort_order,
      false as is_primary
    FROM public.products p, jsonb_array_elements(p.images) v
    WHERE v->>'url' IS NOT NULL 
    AND (
      NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'products' AND column_name = 'image_url')
      OR v->>'url' <> p.image_url
    );
  END IF;
END $$;

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
-- Cleanup orphaned JSONB columns after migration to relational tables
ALTER TABLE public.products DROP COLUMN IF EXISTS images;
ALTER TABLE public.products DROP COLUMN IF EXISTS variants;
-- Add whatsapp_number to branding_settings
ALTER TABLE public.branding_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Update the existing row if it's missing (optional, but good for consistency)
UPDATE public.branding_settings SET whatsapp_number = '919876543210' WHERE id = 1 AND whatsapp_number IS NULL;
-- Add hero and banner override support to branding_settings
ALTER TABLE public.branding_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE public.branding_settings ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
-- Add attributes JSONB column to products table
-- This column stores: seoTitle, seoDescription, highlightTitle, highlightBody,
-- tastingNotes, bestFor, usageTips — used by AdminProductForm, TeaAttributes,
-- SpiceAttributes, and the data normalizer.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Back-fill any existing rows with an empty object (DEFAULT handles new rows)
UPDATE public.products SET attributes = '{}'::jsonb WHERE attributes IS NULL;
-- Contact messages inbox
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'unread', -- unread | read | replied
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: only service role / admin can read; insert is open (public contact form)
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (contact form)
CREATE POLICY "allow_public_insert_contact_messages"
  ON public.contact_messages FOR INSERT
  WITH CHECK (true);

-- Only authenticated admins can select / update
CREATE POLICY "allow_admin_select_contact_messages"
  ON public.contact_messages FOR SELECT
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

CREATE POLICY "allow_admin_update_contact_messages"
  ON public.contact_messages FOR UPDATE
  USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
  );

NOTIFY pgrst, 'reload schema';
