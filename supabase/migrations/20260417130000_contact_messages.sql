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
