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
