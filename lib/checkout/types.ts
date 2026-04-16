export type CheckoutItemInput = {
  productId: string;
  variantId: string;
  quantity: number;
};

export type CheckoutPayload = {
  customer: {
    full_name: string;
    phone: string;
    email: string;
  };
  address: {
    line1: string;
    line2?: string;
    landmark?: string;
    city: string;
    state: string;
    pincode: string;
  };
  notes?: string;
  honey_pot?: string;
  items: CheckoutItemInput[];
};
