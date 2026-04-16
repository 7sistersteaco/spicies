type RazorpayOrderRequest = {
  amount: number;
  currency: string;
  receipt: string;
  payment_capture: 1 | 0;
};

export type RazorpayOrderResponse = {
  id: string;
  amount: number;
  currency: string;
  receipt: string;
  status: string;
};

const getAuthHeader = () => {
  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  
  if (!keyId || keyId === 'your_razorpay_key_id') {
    throw new Error('Mising or invalid Razorpay Key ID in environment variables.');
  }
  if (!keySecret || keySecret === 'your_razorpay_key_secret') {
    throw new Error('Missing or invalid Razorpay Key Secret in environment variables.');
  }
  
  const encoded = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
  return { keyId, header: `Basic ${encoded}` };
};

export const loadRazorpay = () =>
  new Promise<boolean>((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }
    if ((window as { Razorpay?: unknown }).Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

export const createRazorpayOrder = async (payload: RazorpayOrderRequest): Promise<RazorpayOrderResponse> => {
  const { header } = getAuthHeader();
  const response = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      Authorization: header,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Razorpay order failed: ${text}`);
  }

  return (await response.json()) as RazorpayOrderResponse;
};

export const getRazorpayKeyId = () => {
  const { keyId } = getAuthHeader();
  return keyId;
};
