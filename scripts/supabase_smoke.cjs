const fs = require('fs');
const PDFDocument = require('pdfkit');
const { createClient } = require('@supabase/supabase-js');

const envPath = '.env.local';
const raw = fs.readFileSync(envPath, 'utf8');
raw.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const [key, ...rest] = trimmed.split('=');
  if (!key) return;
  process.env[key] = rest.join('=').trim();
});

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error('Missing Supabase env vars.');
  process.exit(1);
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false }
});

const run = async () => {
  const suffix = Date.now();
  const email = `smoke-${suffix}@7sisterstea.com`;

  const { data: customer, error: customerError } = await supabase
    .from('customers')
    .insert({ full_name: 'Smoke Test', email, phone: '9999999999' })
    .select('id')
    .single();

  if (customerError) throw customerError;

  const { data: address, error: addressError } = await supabase
    .from('addresses')
    .insert({
      full_name: 'Smoke Test',
      phone: '9999999999',
      email,
      line1: 'Test Street 1',
      city: 'Guwahati',
      state: 'Assam',
      pincode: '781001',
      country: 'IN'
    })
    .select('id')
    .single();

  if (addressError) throw addressError;

  const { data: order, error: orderError } = await supabase
    .from('orders')
    .insert({
      customer_id: customer.id,
      customer_name: 'Smoke Test',
      customer_email: email,
      customer_phone: '9999999999',
      status: 'paid',
      payment_status: 'paid',
      currency: 'INR',
      subtotal_inr: 199,
      shipping_inr: 0,
      tax_inr: 0,
      discount_inr: 0,
      total_inr: 199,
      shipping_address_id: address.id,
      billing_address_id: address.id,
      notes: 'Smoke test order'
    })
    .select('id, order_code')
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await supabase.from('order_items').insert({
    order_id: order.id,
    product_name: 'Assam Strong CTC Tea',
    variant_label: '100g',
    variant_sku: '7S-CTC-100G',
    unit_price_inr: 199,
    qty: 1,
    line_total_inr: 199
  });

  if (itemsError) throw itemsError;

  const { error: paymentError } = await supabase.from('payments').insert({
    order_id: order.id,
    provider: 'razorpay',
    provider_order_id: `smoke_${suffix}`,
    provider_payment_id: `pay_${suffix}`,
    amount_inr: 199,
    currency: 'INR',
    status: 'paid',
    captured_at: new Date().toISOString()
  });

  if (paymentError) throw paymentError;

  const { data: invoice, error: invoiceError } = await supabase
    .from('invoices')
    .insert({ order_id: order.id, status: 'issued', total_inr: 199, currency: 'INR' })
    .select('id, invoice_code')
    .single();

  if (invoiceError) throw invoiceError;

  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  const done = new Promise((resolve) => doc.on('end', () => resolve(Buffer.concat(chunks))));

  doc.fontSize(16).text('7 Sisters Tea Co.');
  doc.fontSize(12).text(`Invoice ${invoice.invoice_code}`);
  doc.moveDown();
  doc.text('Assam Strong CTC Tea x1 - INR 199');
  doc.text('Total: INR 199');
  doc.end();

  const pdfBuffer = await done;
  const path = `invoices/${invoice.id}.pdf`;

  const { error: uploadError } = await supabase.storage
    .from('invoices')
    .upload(path, pdfBuffer, { contentType: 'application/pdf', upsert: true });

  if (uploadError) throw uploadError;

  const { error: updateError } = await supabase.from('invoices').update({ pdf_path: path }).eq('id', invoice.id);
  if (updateError) throw updateError;

  console.log(JSON.stringify({ order_id: order.id, order_code: order.order_code, invoice_id: invoice.id, invoice_path: path }));
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
