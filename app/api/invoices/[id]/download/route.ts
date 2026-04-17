import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { ensureInvoice } from '@/lib/invoices/createInvoice';
import { isAdmin } from '@/app/actions/admin';

export const runtime = 'nodejs';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const supabase = createAdminClient();
  
  // 1. Fetch invoice first
  const { data: invoice } = await supabase
    .from('invoices')
    .select('id, pdf_path, invoice_code, order_id')
    .eq('id', params.id)
    .maybeSingle();

  if (!invoice) {
    return NextResponse.json({ ok: false, error: 'Invoice not found.' }, { status: 404 });
  }

  // 2. Security Check (Admin or Valid Public Token)
  const isAuthorizedAdmin = await isAdmin();
  
  if (!isAuthorizedAdmin) {
    const url = new URL(request.url);
    const token = url.searchParams.get('token');
    
    // Check if order has this public token
    const { data: order } = await supabase
      .from('orders')
      .select('public_token')
      .eq('id', invoice.order_id)
      .maybeSingle();

    if (!order || !token || order.public_token !== token) {
      return NextResponse.json({ ok: false, error: 'Unauthorized.' }, { status: 401 });
    }
  }

  // 3. Ensure PDF exists
  let pdfPath = invoice.pdf_path;
  if (!pdfPath) {
    const created = await ensureInvoice(invoice.order_id);
    pdfPath = created.pdf_path;
  }

  if (!pdfPath) {
    return NextResponse.json({ ok: false, error: 'Invoice not available.' }, { status: 404 });
  }

  // 4. Download and Stream
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
