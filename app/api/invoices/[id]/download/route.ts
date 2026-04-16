import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInvoice } from '@/lib/invoices/createInvoice';

const ADMIN_COOKIE = 'admin_session';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  const url = new URL(request.url);
  const token = url.searchParams.get('token');
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, pdf_path, invoice_code, order_id')
    .eq('id', params.id)
    .maybeSingle();

  if (!invoice) {
    return NextResponse.json({ ok: false, error: 'Invoice not found.' }, { status: 404 });
  }

  const { data: { user } } = await supabase.auth.getUser();
  const isAdminSession = user?.app_metadata?.role === 'admin';

  if (!isAdminSession) {
    const { data: order } = await supabase.from('orders').select('public_token').eq('id', invoice.order_id).maybeSingle();
    if (!order || !token || order.public_token !== token) {
      return NextResponse.json({ ok: false, error: 'Unauthorized scan or link.' }, { status: 401 });
    }
  }

  let pdfPath = invoice.pdf_path;
  if (!pdfPath) {
    const created = await ensureInvoice(invoice.order_id);
    pdfPath = created.pdf_path;
  }

  if (!pdfPath) {
    return NextResponse.json({ ok: false, error: 'Invoice not available.' }, { status: 404 });
  }

  const { data, error } = await supabase.storage.from('invoices').download(pdfPath);
  if (error || !data) {
    return NextResponse.json({ ok: false, error: 'Unable to download invoice.' }, { status: 500 });
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  return new NextResponse(buffer, {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="invoice-${invoice.invoice_code ?? invoice.id}.pdf"`
    }
  });
}
