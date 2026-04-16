import type { CheckoutPayload } from './types';

export type CheckoutValidation = {
  ok: boolean;
  errors?: Record<string, string>;
};

export const validateCheckoutPayload = (payload: CheckoutPayload): CheckoutValidation => {
  const errors: Record<string, string> = {};
  if (!payload.customer.full_name) errors.full_name = 'Full name is required';
  if (!payload.customer.phone) errors.phone = 'Phone is required';
  if (!payload.customer.email) errors.email = 'Email is required';
  if (!payload.address.line1) errors.address_line_1 = 'Address line 1 is required';
  if (!payload.address.city) errors.city = 'City is required';
  if (!payload.address.state) errors.state = 'State is required';
  if (!payload.address.pincode) errors.pincode = 'Pincode is required';
  if (!payload.items.length) errors.items = 'Cart is empty';
  return { ok: Object.keys(errors).length === 0, errors: Object.keys(errors).length ? errors : undefined };
};
