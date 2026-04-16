export type OrderStatus = 
  | 'new' 
  | 'confirmed' 
  | 'packed' 
  | 'shipped' 
  | 'delivered' 
  | 'cancelled' 
  | 'refunded' 
  | 'pending'; // Keeping pending for compatibility

export const ORDER_STATUS_STEPS: OrderStatus[] = [
  'new',
  'confirmed',
  'packed',
  'shipped',
  'delivered'
];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  'new': 'Order Received',
  'confirmed': 'Confirmed',
  'packed': 'Packed',
  'shipped': 'Shipped',
  'delivered': 'Delivered',
  'cancelled': 'Cancelled',
  'refunded': 'Refunded',
  'pending': 'Awaiting Confirmation'
};

export const PRE_ORDER_STATUS_LABELS: Partial<Record<OrderStatus, string>> = {
  'new': 'Awaiting Confirmation',
  'pending': 'Awaiting Confirmation'
};

export function getStatusLabel(status: string, isPreOrder: boolean = false): string {
  const s = status as OrderStatus;
  if (isPreOrder && PRE_ORDER_STATUS_LABELS[s]) {
    return PRE_ORDER_STATUS_LABELS[s]!;
  }
  return ORDER_STATUS_LABELS[s] || 'Order Received';
}
