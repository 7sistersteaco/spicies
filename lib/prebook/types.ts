export type FulfillmentMethod =
  | 'pickup_from_7_sisters_restro'
  | 'local_delivery'
  | 'shipping_inquiry';

export type PrebookStatus = 'new' | 'contacted' | 'confirmed' | 'cancelled' | 'fulfilled';

export type PrebookFormState = {
  ok: boolean;
  message?: string;
  whatsappUrl?: string;
  errors?: Record<string, string>;
  // Razorpay integration fields
  razoOrder?: {
    id: string;
    amount: number;
    currency: string;
    keyId: string;
    orderId: string; // Database ID
    orderToken: string; // Public token
  };
};
