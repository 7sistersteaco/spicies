import { createAdminClient } from '@/lib/supabase/admin';

export type CustomerFilters = {
  q?: string;
  page?: number;
  pageSize?: number;
};

export const getCustomers = async (filters: CustomerFilters = {}): Promise<{ data: any[]; count: number }> => {
  const { page = 1, pageSize = 20 } = filters;
  const offset = (page - 1) * pageSize;

  const supabase = createAdminClient();
  
  // Select customers with total order count and total spend
  // Since we are on Supabase free tier and can't use complex joins easily without RPC, 
  // we will fetch the customers and then potentially augment or just show basic info.
  // Requirement is pagination + search.
  
  let query = supabase
    .from('customers')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (filters.q) {
    query = query.or(
      `full_name.ilike.%${filters.q}%,email.ilike.%${filters.q}%,phone.ilike.%${filters.q}%`
    );
  }

  const { data, count } = await query;
  
  return { data: data ?? [], count: count ?? 0 };
};
