-- Cleanup orphaned JSONB columns after migration to relational tables
ALTER TABLE public.products DROP COLUMN IF EXISTS images;
ALTER TABLE public.products DROP COLUMN IF EXISTS variants;
