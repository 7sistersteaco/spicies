'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { revalidatePath } from 'next/cache';

export type ContactMessage = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  topic: string | null;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
};

export async function submitContactMessage(data: {
  name: string;
  phone: string;
  email?: string;
  topic?: string;
  message: string;
}): Promise<{ ok: boolean; error?: string }> {
  try {
    if (!data.name?.trim() || !data.phone?.trim() || !data.message?.trim()) {
      return { ok: false, error: 'Name, phone, and message are required.' };
    }

    // Use anon client — public insert allowed by RLS
    const supabase = createClient();
    const { error } = await supabase.from('contact_messages').insert({
      name: data.name.trim(),
      phone: data.phone.trim(),
      email: data.email?.trim() || null,
      topic: data.topic?.trim() || null,
      message: data.message.trim(),
      status: 'unread'
    });

    if (error) throw error;

    revalidatePath('/admin/messages');
    return { ok: true };
  } catch (err: any) {
    console.error('submitContactMessage error:', err);
    return { ok: false, error: err.message || 'Failed to send message.' };
  }
}

export async function getContactMessages(): Promise<ContactMessage[]> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  } catch (err) {
    console.error('getContactMessages error:', err);
    return [];
  }
}

export async function markMessageStatus(
  id: string,
  status: 'read' | 'unread' | 'replied'
): Promise<{ ok: boolean }> {
  try {
    const supabase = createAdminClient();
    const { error } = await supabase
      .from('contact_messages')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) throw error;
    revalidatePath('/admin/messages');
    return { ok: true };
  } catch (err) {
    console.error('markMessageStatus error:', err);
    return { ok: false };
  }
}
