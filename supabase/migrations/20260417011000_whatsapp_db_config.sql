-- Add whatsapp_number to branding_settings
ALTER TABLE public.branding_settings ADD COLUMN IF NOT EXISTS whatsapp_number TEXT;

-- Update the existing row if it's missing (optional, but good for consistency)
UPDATE public.branding_settings SET whatsapp_number = '919876543210' WHERE id = 1 AND whatsapp_number IS NULL;
