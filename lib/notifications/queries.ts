import { createAdminClient } from '@/lib/supabase/admin';

export type AdminNotificationType = 'new_order' | 'new_prebook' | 'payment_success' | 'status_update';

export interface AdminNotification {
  id: string;
  type: AdminNotificationType;
  reference_id: string | null;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export async function getAdminNotifications(limit = 10) {
  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('admin_notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('getAdminNotifications error:', error);
    return [];
  }
  return data as AdminNotification[];
}

export async function getUnreadCount() {
  const supabase = createAdminClient();
  const { count, error } = await supabase
    .from('admin_notifications')
    .select('*', { count: 'exact', head: true })
    .eq('is_read', false);

  if (error) return 0;
  return count || 0;
}

export async function createAdminNotification(notif: {
  type: AdminNotificationType;
  reference_id?: string;
  title: string;
  message: string;
}) {
  const supabase = createAdminClient();
  const { error } = await supabase
    .from('admin_notifications')
    .insert([{
      ...notif,
      is_read: false
    }]);

  if (error) {
    console.error('createAdminNotification error:', error);
  }
}

export async function markNotificationsAsRead(ids?: string[]) {
  const supabase = createAdminClient();
  let query = supabase
    .from('admin_notifications')
    .update({ is_read: true });

  if (ids && ids.length > 0) {
    query = query.in('id', ids);
  } else {
    query = query.eq('is_read', false); // Mark all as read
  }

  const { error } = await query;
  if (error) {
    console.error('markNotificationsAsRead error:', error);
  }
}
