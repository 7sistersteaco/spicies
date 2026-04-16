import PDFDocument from 'pdfkit';

type InvoiceCompany = {
  name: string;
  address: string;
  email: string;
  phone: string;
};

type InvoiceItem = {
  name: string;
  quantity: number;
  unitPriceInr: number;
  totalInr: number;
};

type InvoiceData = {
  invoiceCode: string;
  orderCode: string;
  issuedAt: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: string;
  items: InvoiceItem[];
  subtotalInr: number;
  shippingInr: number;
  taxInr: number;
  totalInr: number;
  paymentMode: string;
  paymentStatus: string;
  company: InvoiceCompany;
};

export const generateInvoicePdf = async (data: InvoiceData): Promise<Buffer> => {
  const doc = new PDFDocument({ size: 'A4', margin: 50 });
  const chunks: Buffer[] = [];

  doc.on('data', (chunk) => chunks.push(chunk));

  doc.fontSize(18).text(data.company.name, { align: 'left' });
  doc.fontSize(10).text(data.company.address);
  doc.text(`Email: ${data.company.email}`);
  doc.text(`Phone: ${data.company.phone}`);

  doc.moveDown();
  doc.fontSize(14).text(`Invoice ${data.invoiceCode}`, { align: 'right' });
  doc.fontSize(10).text(`Order: ${data.orderCode}`, { align: 'right' });
  doc.text(`Date: ${data.issuedAt}`, { align: 'right' });

  doc.moveDown();
  doc.fontSize(12).text('Bill To');
  doc.fontSize(10).text(data.customerName);
  doc.text(data.customerEmail);
  doc.text(data.customerPhone);
  doc.text(data.shippingAddress);

  doc.moveDown();
  doc.fontSize(12).text('Items');
  doc.moveDown(0.5);

  data.items.forEach((item) => {
    doc.fontSize(10).text(`${item.name} x${item.quantity}`, { continued: true });
    doc.text(`INR ${item.totalInr}`, { align: 'right' });
  });

  doc.moveDown();
  doc.fontSize(10).text(`Subtotal: INR ${data.subtotalInr}`, { align: 'right' });
  doc.text(`Shipping: INR ${data.shippingInr}`, { align: 'right' });
  doc.text(`Tax: INR ${data.taxInr}`, { align: 'right' });
  doc.fontSize(12).text(`Total: INR ${data.totalInr}`, { align: 'right' });

  doc.moveDown();
  doc.fontSize(10).text(`Payment Mode: ${data.paymentMode}`);
  doc.text(`Payment Status: ${data.paymentStatus}`);

  doc.end();

  return await new Promise((resolve) => {
    doc.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
