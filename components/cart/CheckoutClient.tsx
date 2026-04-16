'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import CheckoutForm from '@/components/cart/CheckoutForm';
import CheckoutSummary from '@/components/cart/CheckoutSummary';
import { useCartStore } from '@/store/cart';

type CheckoutErrors = Partial<Record<string, string>>;

type RazorpayOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  theme: {
    color: string;
  };
  modal?: {
    ondismiss?: () => void;
  };
};

import { loadRazorpay } from '@/lib/razorpay/client';

const validateRequired = (formData: FormData): CheckoutErrors => {
  const requiredFields = [
    'full_name',
    'phone',
    'email',
    'address_line_1',
    'city',
    'state',
    'pincode'
  ];
  const errors: CheckoutErrors = {};
  requiredFields.forEach((field) => {
    const value = String(formData.get(field) ?? '').trim();
    if (!value) {
      errors[field] = 'Required';
    }
  });
  return errors;
};

export default function CheckoutClient() {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clear);
  const hasHydrated = useCartStore((state) => state.hasHydrated);
  const [errors, setErrors] = useState<CheckoutErrors>({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const handlePay = async () => {
    if (!formRef.current) {
      return;
    }
    setServerError(null);
    if (!hasHydrated) {
      setServerError('Cart is still loading. Please try again in a moment.');
      return;
    }
    const formData = new FormData(formRef.current);
    const nextErrors = validateRequired(formData);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }
    if (items.length === 0) {
      setServerError('Your cart is empty.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        customer: {
          full_name: String(formData.get('full_name') ?? '').trim(),
          phone: String(formData.get('phone') ?? '').trim(),
          email: String(formData.get('email') ?? '').trim()
        },
        address: {
          line1: String(formData.get('address_line_1') ?? '').trim(),
          line2: String(formData.get('address_line_2') ?? '').trim(),
          landmark: String(formData.get('landmark') ?? '').trim(),
          city: String(formData.get('city') ?? '').trim(),
          state: String(formData.get('state') ?? '').trim(),
          pincode: String(formData.get('pincode') ?? '').trim()
        },
        notes: String(formData.get('notes') ?? '').trim(),
        honey_pot: String(formData.get('hp_field') ?? '').trim(),
        items: items.map((item) => ({
          productId: item.productId,
          variantId: item.variantId,
          quantity: item.qty
        }))
      };

      const response = await fetch('/api/razorpay/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = (await response.json()) as {
        ok: boolean;
        error?: string;
        orderId?: string;
        orderCode?: string;
        orderToken?: string;
        razorpayOrderId?: string;
        amount?: number;
        currency?: string;
        keyId?: string;
      };

      if (!response.ok || !data.ok || !data.razorpayOrderId || !data.keyId || !data.orderId || !data.orderToken) {
        throw new Error(data.error || 'Unable to initiate payment.');
      }

      const ready = await loadRazorpay();
      if (!ready) {
        throw new Error('Payment SDK failed to load.');
      }

      const options: RazorpayOptions = {
        key: data.keyId,
        amount: data.amount ?? 0,
        currency: data.currency ?? 'INR',
        name: '7 Sisters Tea Co.',
        description: 'Premium Assam tea & spices',
        order_id: data.razorpayOrderId,
        prefill: {
          name: payload.customer.full_name,
          email: payload.customer.email,
          contact: payload.customer.phone
        },
        theme: { color: '#D4AF37' },
        modal: {
          ondismiss: () => {
            setServerError('Payment cancelled. You can try again anytime.');
          }
        },
        handler: async (response) => {
          try {
            const verifyRes = await fetch('/api/razorpay/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                orderId: data.orderId,
                orderToken: data.orderToken,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature
              })
            });
            const verifyData = (await verifyRes.json()) as { ok: boolean; error?: string };
            if (!verifyRes.ok || !verifyData.ok) {
              throw new Error(verifyData.error || 'Payment verification failed.');
            }
            clearCart();
            router.push(`/order-success?token=${data.orderToken}`);
          } catch (verifyError) {
            setServerError(verifyError instanceof Error ? verifyError.message : 'Payment verification failed.');
          }
        }
      };

      const RazorpayConstructor = (window as unknown as { Razorpay: new (opts: RazorpayOptions) => { open: () => void } })
        .Razorpay;
      const razorpay = new RazorpayConstructor(options);
      razorpay.open();
    } catch (error) {
      setServerError(error instanceof Error ? error.message : 'Unable to process payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-12 grid gap-10 md:grid-cols-[1.2fr_0.8fr]">
      <div className="lux-surface p-6">
        <h2 className="text-lg font-semibold">Delivery Details</h2>
        <div className="mt-6">
          <CheckoutForm ref={formRef} errors={errors} />
        </div>
      </div>
      <CheckoutSummary onPay={handlePay} loading={loading} error={serverError} />
    </div>
  );
}
