'use server';

import { revalidatePath, revalidateTag } from 'next/cache';
import { isAdmin } from './admin';
import { 
  getAdminNotifications, 
  getUnreadCount, 
  markNotificationsAsRead 
} from '@/lib/notifications/queries';

export async function fetchNotifications() {
  if (!(await isAdmin())) return [];
  return await getAdminNotifications(10);
}

export async function fetchUnreadCount() {
  if (!(await isAdmin())) return 0;
  return await getUnreadCount();
}

export async function markAsRead(ids?: string[]) {
  if (!(await isAdmin())) return { ok: false };
  await markNotificationsAsRead(ids);
  revalidateTag('notifications');
  revalidatePath('/admin', 'layout');
  return { ok: true };
}
