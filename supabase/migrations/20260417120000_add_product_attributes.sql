-- Add attributes JSONB column to products table
-- This column stores: seoTitle, seoDescription, highlightTitle, highlightBody,
-- tastingNotes, bestFor, usageTips — used by AdminProductForm, TeaAttributes,
-- SpiceAttributes, and the data normalizer.
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS attributes JSONB NOT NULL DEFAULT '{}'::jsonb;

-- Back-fill any existing rows with an empty object (DEFAULT handles new rows)
UPDATE public.products SET attributes = '{}'::jsonb WHERE attributes IS NULL;
