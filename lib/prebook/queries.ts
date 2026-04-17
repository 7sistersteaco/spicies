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
  page?: number;
  pageSize?: number;
};

export const getPrebookRequests = async (
  filters: PrebookQueryFilters = {}
): Promise<{ data: PrebookRequestRow[]; error?: string; totalCount?: number }> => {
  const { page = 1, pageSize = 20 } = filters;
  const offset = (page - 1) * pageSize;

  const supabase = createAdminClient();
  
  // Base request for data
  let request = supabase
    .from('prebook_requests')
    .select('id,full_name,phone,product_name,selected_weight,quantity,fulfillment_method,status,created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

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

  const { data, error, count } = await request;

  if (error || !data) {
    return { data: [], error: 'Unable to load pre-book requests.' };
  }

  return { data: data as PrebookRequestRow[], totalCount: count ?? 0 };
};

export const updatePrebookStatus = async (id: string, status: PrebookStatus) => {
  const supabase = createAdminClient();
  return supabase.from('prebook_requests').update({ status }).eq('id', id);
};
