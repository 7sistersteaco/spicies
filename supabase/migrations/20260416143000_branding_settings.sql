-- SQL to create branding_settings table
CREATE TABLE IF NOT EXISTS branding_settings (
    id INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
    logo_url TEXT,
    favicon_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initialize with a single row if not exists
INSERT INTO branding_settings (id)
SELECT 1
WHERE NOT EXISTS (SELECT 1 FROM branding_settings WHERE id = 1);

-- Enable RLS
ALTER TABLE branding_settings ENABLE ROW LEVEL SECURITY;

-- Policy to allow anyone to read
CREATE POLICY "Allow public read branding_settings" 
ON branding_settings FOR SELECT 
USING (true);

-- Policy to allow service role to manage
CREATE POLICY "Allow service_role manage branding_settings" 
ON branding_settings FOR ALL 
USING (true)
WITH CHECK (true);
