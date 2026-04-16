import { type OrderStatus } from './types';

export type WhatsAppTemplate = 'confirmed' | 'packed' | 'shipped' | 'delivered';

export interface NotificationData {
  customerName: string;
  customerPhone: string;
  productName: string;
}

export function getWhatsAppMessage(template: WhatsAppTemplate, data: NotificationData): string {
  const { customerName, productName } = data;
  
  switch (template) {
    case 'confirmed':
      return `Hi ${customerName}, your order for ${productName} has been confirmed. We are preparing it now. Thank you for choosing 7 Sisters Tea & Co.`;
    case 'packed':
      return `Hi ${customerName}, your order has been packed and is ready for dispatch.`;
    case 'shipped':
      return `Hi ${customerName}, your order has been shipped and is on the way to you.`;
    case 'delivered':
      return `Hi ${customerName}, your order has been delivered. We hope you enjoy your tea 🌿`;
    default:
      return '';
  }
}

export function generateWhatsAppLink(phone: string, message: string): string {
  // Normalize phone: remove non-digits
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  // If no country code, assume India (+91) as per project context
  const fullPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
  
  return `https://wa.me/${fullPhone}?text=${encodeURIComponent(message)}`;
}
