-- Add hero and banner override support to branding_settings
ALTER TABLE public.branding_settings ADD COLUMN IF NOT EXISTS hero_image_url TEXT;
ALTER TABLE public.branding_settings ADD COLUMN IF NOT EXISTS banner_image_url TEXT;
