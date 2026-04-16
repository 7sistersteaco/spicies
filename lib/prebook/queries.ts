import { createAdminClient } from '@/lib/supabase/admin';
import type { PrebookStatus } from '@/lib/prebook/types';

export type PrebookRequestRow = {
  id: string;
  full_name: string;
  phone: string;
  product_name: string;
  selected_weight: string;
  quantity: number;
  fulfillment_method: string;
  status: PrebookStatus;
  created_at: string;
};

export type PrebookQueryFilters = {
  status?: string;
  fulfillment_method?: string;
  query?: string;
};

export const getPrebookRequests = async (
  filters: PrebookQueryFilters = {}
): Promise<{ data: PrebookRequestRow[]; error?: string }> => {
  const supabase = createAdminClient();
  let request = supabase
    .from('prebook_requests')
    .select('id,full_name,phone,product_name,selected_weight,quantity,fulfillment_method,status,created_at')
    .order('created_at', { ascending: false });

  if (filters.status && filters.status !== 'all') {
    request = request.eq('status', filters.status);
  }
  if (filters.fulfillment_method && filters.fulfillment_method !== 'all') {
    request = request.eq('fulfillment_method', filters.fulfillment_method);
  }
  if (filters.query) {
    const term = filters.query.trim();
    if (term.length > 0) {
      request = request.or(
        `full_name.ilike.%${term}%,phone.ilike.%${term}%,product_name.ilike.%${term}%`
      );
    }
  }

  const { data, error } = await request;

  if (error || !data) {
    return { data: [], error: 'Unable to load pre-book requests.' };
  }

  return { data: data as PrebookRequestRow[] };
};

export const updatePrebookStatus = async (id: string, status: PrebookStatus) => {
  const supabase = createAdminClient();
  return supabase.from('prebook_requests').update({ status }).eq('id', id);
};
