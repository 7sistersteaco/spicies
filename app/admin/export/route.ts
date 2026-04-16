import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';

const ADMIN_COOKIE = 'admin_session';

const escapeCsv = (value: unknown) => {
  if (value === null || value === undefined) {
    return '';
  }
  const stringValue = String(value);
  if (/[",\n]/.test(stringValue)) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
};

export async function GET() {
  const isAdmin = cookies().get(ADMIN_COOKIE)?.value === '1';
  if (!isAdmin) {
    return new Response('Unauthorized', { status: 401 });
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from('prebook_requests')
    .select(
      'id,created_at,updated_at,full_name,phone,email,product_name,category,selected_weight,quantity,fulfillment_method,note,source_page,status'
    )
    .order('created_at', { ascending: false });

  if (error || !data) {
    return new Response('Failed to generate CSV', { status: 500 });
  }

  const headers = [
    'id',
    'created_at',
    'updated_at',
    'full_name',
    'phone',
    'email',
    'product_name',
    'category',
    'selected_weight',
    'quantity',
    'fulfillment_method',
    'note',
    'source_page',
    'status'
  ];

  const rows = data.map((row) => headers.map((key) => escapeCsv((row as Record<string, unknown>)[key])));
  const csv = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');

  return new Response(csv, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename="prebook_requests.csv"'
    }
  });
}
