import { createAdminClient } from '@/lib/supabase/admin';
import { generateInvoicePdf } from '@/lib/invoices/generateInvoicePdf';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

type OrderRecord = {
  id: string;
  order_code: string | null;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  subtotal_inr: number | null;
  shipping_inr: number | null;
  tax_inr: number | null;
  total_inr: number | null;
  payment_status: string | null;
  created_at: string;
};

type OrderItemRecord = {
  product_name: string | null;
  qty: number | null;
  unit_price_inr: number | null;
  line_total_inr: number | null;
};

type AddressRecord = {
  full_name: string | null;
  phone: string | null;
  email: string | null;
  line1: string | null;
  line2: string | null;
  landmark: string | null;
  city: string | null;
  state: string | null;
  pincode: string | null;
};

const buildAddress = (address: AddressRecord | null) => {
  if (!address) return '';
  const parts = [
    address.line1,
    address.line2,
    address.landmark,
    `${address.city ?? ''} ${address.state ?? ''} ${address.pincode ?? ''}`.trim()
  ]
    .filter(Boolean)
    .join(', ');
  return parts;
};

export const ensureInvoice = async (orderId: string) => {
  const supabase = createAdminClient();
  
  try {
    const { data: existing, error: existingError } = await supabase
      .from('invoices')
      .select('id, invoice_code, pdf_path')
      .eq('order_id', orderId)
      .maybeSingle();
      
    if (existingError) {
      console.error(`[ensureInvoice] Error checking for existing invoice for order ${orderId}:`, existingError);
    }
    
    if (existing?.pdf_path) {
      return existing;
    }

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('id, order_code, customer_name, customer_email, customer_phone, subtotal_inr, shipping_inr, tax_inr, total_inr, payment_status, created_at, shipping_address_id')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      throw new Error(`Order ${orderId} not found for invoice generation.`);
    }

    const { data: items, error: itemsError } = await supabase
      .from('order_items')
      .select('product_name, qty, unit_price_inr, line_total_inr')
      .eq('order_id', orderId);
      
    if (itemsError) {
      throw new Error(`Unable to fetch items for order ${orderId}: ${itemsError.message}`);
    }

    const { data: address, error: addressError } = await supabase
      .from('addresses')
      .select('full_name, phone, email, line1, line2, landmark, city, state, pincode')
      .eq('id', order.shipping_address_id)
      .maybeSingle();

    if (addressError) {
      console.warn(`[ensureInvoice] Warning: Address lookup error for order ${orderId}:`, addressError);
    }

    // Upsert invoice record to prevent duplicates
    let invoice = existing;
    if (!invoice) {
        const { data: created, error: createError } = await supabase
          .from('invoices')
          .insert({
            order_id: orderId,
            status: 'issued',
            total_inr: order.total_inr ?? 0,
            currency: 'INR'
          })
          .select('id, invoice_code, pdf_path')
          .single();
          
        if (createError || !created) {
          throw new Error(`Database error creating invoice record for order ${orderId}: ${createError?.message}`);
        }
        invoice = created;
    }

    const pdfBuffer = await generateInvoicePdf({
      invoiceCode: invoice.invoice_code ?? `INV-${invoice.id}`,
      orderCode: order.order_code ?? order.id,
      issuedAt: new Date(order.created_at).toLocaleDateString('en-IN'),
      customerName: order.customer_name ?? '',
      customerEmail: order.customer_email ?? '',
      customerPhone: order.customer_phone ?? '',
      shippingAddress: buildAddress(address as AddressRecord | null),
      items:
        (items as OrderItemRecord[] | null)?.map((item) => ({
          name: item.product_name ?? 'Item',
          quantity: item.qty ?? 0,
          unitPriceInr: item.unit_price_inr ?? 0,
          totalInr: item.line_total_inr ?? 0
        })) ?? [],
      subtotalInr: order.subtotal_inr ?? 0,
      shippingInr: order.shipping_inr ?? 0,
      taxInr: order.tax_inr ?? 0,
      totalInr: order.total_inr ?? 0,
      paymentMode: 'Razorpay',
      paymentStatus: order.payment_status ?? 'pending',
      company: {
        name: '7 Sisters Tea Co.',
        address: 'Barpeta Road, Assam, India',
        email: 'support@7sisterstea.com',
        phone: `+${WHATSAPP_NUMBER}`
      }
    });

    const path = `invoices/${invoice.id}.pdf`;
    const { error: uploadError } = await supabase.storage.from('invoices').upload(path, pdfBuffer, {
      contentType: 'application/pdf',
      upsert: true
    });
    
    if (uploadError) {
      throw new Error(`Storage error uploading invoice PDF for order ${orderId}: ${uploadError.message}`);
    }

    await supabase.from('invoices').update({ pdf_path: path }).eq('id', invoice.id);

    return { id: invoice.id, invoice_code: invoice.invoice_code, pdf_path: path };
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Unknown error during invoice generation';
    console.error(`[ensureInvoice] Critical Failure for Order ${orderId}:`, msg);
    throw error; // Propagate the error so the caller knows it failed
  }
};
