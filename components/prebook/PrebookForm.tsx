'use client';

import { useEffect, useMemo, useState, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useFormState } from 'react-dom';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';
import WeightSelector from '@/components/product/WeightSelector';
import QuantityStepper from '@/components/cart/QuantityStepper';
import type { Product } from '@/lib/products/types';
import type { PrebookFormState } from '@/lib/prebook/types';
import { submitPrebook } from '@/app/actions/prebook';
import { loadRazorpay, getRazorpayKeyId } from '@/lib/razorpay/client';
import { WHATSAPP_NUMBER } from '@/lib/config/whatsapp';

const initialState: PrebookFormState = { ok: false };



export default function PrebookForm({ product, variant = 'card' }: { product: Product; variant?: 'card' | 'embedded' }) {
  const router = useRouter();
  const pathname = usePathname();
  const [state, formAction] = useFormState(submitPrebook, initialState);
  const [selectedId, setSelectedId] = useState(product.variants[0]?.id ?? '');
  const [quantity, setQuantity] = useState(1);
  const [paymentMode, setPaymentMode] = useState<'reserve' | 'pay_now'>('reserve');
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const activeVariant = useMemo(
    () => product.variants.find((variant) => variant.id === selectedId) ?? product.variants[0],
    [product.variants, selectedId]
  );

  const redirectTriggered = useRef(false);

  // Automated WhatsApp redirect after DB save (Mode 1)
  useEffect(() => {
    if (state.ok && state.whatsappUrl && !state.razoOrder && !redirectTriggered.current) {
      redirectTriggered.current = true;
      window.open(state.whatsappUrl, '_blank');
    }
  }, [state.ok, state.whatsappUrl, state.razoOrder]);

  // Trigger Razorpay when razoOrder is returned
  useEffect(() => {
    if (state.ok && state.razoOrder && !isProcessing) {
      const handleRazorpay = async () => {
        setIsProcessing(true);
        setErrorMsg(null);
        try {
          const ready = await loadRazorpay();
          if (!ready) throw new Error('Payment SDK failed to load.');

          const options = {
            key: state.razoOrder!.keyId,
            amount: state.razoOrder!.amount,
            currency: state.razoOrder!.currency,
            name: '7 Sisters Tea Co.',
            description: 'Pre-order Confirmation',
            order_id: state.razoOrder!.id,
            prefill: {
              name: String((document.getElementsByName('full_name')[0] as HTMLInputElement)?.value || ''),
              email: String((document.getElementsByName('email')[0] as HTMLInputElement)?.value || ''),
              contact: String((document.getElementsByName('phone')[0] as HTMLInputElement)?.value || '')
            },
            theme: { color: '#D4AF37' },
            handler: async (response: any) => {
              try {
                const verifyRes = await fetch('/api/razorpay/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId: state.razoOrder!.orderId,
                    orderToken: state.razoOrder!.orderToken,
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                  })
                });
                const verifyData = await verifyRes.json();
                if (!verifyRes.ok || !verifyData.ok) throw new Error(verifyData.error || 'Verification failed');
                router.push(`/order-success?token=${state.razoOrder!.orderToken}`);
              } catch (err) {
                setErrorMsg(err instanceof Error ? err.message : 'Payment verification failed');
                setIsProcessing(false);
              }
            },
            modal: {
              ondismiss: () => {
                setErrorMsg('Payment cancelled. Your reservation is still pending.');
                setIsProcessing(false);
              }
            }
          };

          const rzp = new (window as any).Razorpay(options);
          rzp.open();
        } catch (err) {
          setErrorMsg(err instanceof Error ? err.message : 'Failed to launch payment');
          setIsProcessing(false);
        }
      };
      handleRazorpay();
    }
  }, [state.ok, state.razoOrder, router, isProcessing]);


  const wrapperClass = variant === 'embedded' ? 'space-y-6' : 'space-y-6 lux-surface p-6';

  return (
    <div className={wrapperClass}>
      {/* ... (Header logic) */}
      <div className="space-y-2">
        <p className="text-xs uppercase tracking-[0.3em] text-cream/70">Reserve First Batch</p>
        <p className="text-sm text-cream/70">Testing demand for our first release.</p>
      </div>

      {state.ok && !state.razoOrder ? (
         <div className="rounded-3xl border border-accent/30 bg-ink p-8 text-center text-cream shadow-2xl">
           <div className="mx-auto h-16 w-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
              <svg className="h-8 w-8 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
           </div>
           <p className="text-xs uppercase tracking-[0.4em] text-cream/40">Reservation Saved</p>
           <h3 className="mt-4 text-2xl font-semibold">Ready to Confirm</h3>
           <p className="mt-4 text-sm text-cream/70 leading-relaxed max-w-xs mx-auto">
             Your reservation is safely stored. To prioritize your booking, please open WhatsApp to finalize with our team.
           </p>
           <div className="mt-10 space-y-4">
             {state.whatsappUrl && (
               <a href={state.whatsappUrl} target="_blank" rel="noreferrer" className="block w-full">
                 <Button className="w-full h-14 bg-[#25D366] hover:bg-[#128C7E] text-white border-none text-lg font-bold">
                   Open WhatsApp Manually
                 </Button>
               </a>
             )}
             <Button
                variant="secondary"
                className="w-full py-4 text-xs tracking-widest uppercase opacity-50 hover:opacity-100"
                onClick={() => window.location.reload()}
              >
                Start New Reservation
              </Button>
           </div>
         </div>
      ) : (
        <form action={formAction} className="space-y-5">
          {/* Hidden Inputs */}
          <input type="hidden" name="product_name" value={product.name} />
          <input type="hidden" name="category" value={product.category} />
          <input type="hidden" name="selected_weight" value={activeVariant.weightLabel} />
          <input type="hidden" name="quantity" value={quantity} />
          <input type="hidden" name="source_page" value={pathname ?? ''} />
          <input type="hidden" name="payment_mode" value={paymentMode} />

          <div className="bg-cream/5 border border-white/5 p-4 rounded-xl mb-6">
            <p className="text-[10px] text-cream/40 uppercase tracking-widest leading-relaxed">
               Next Step: After saving, we will open WhatsApp so you can instantly confirm your reservation with our team.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Select Weight</p>
            <WeightSelector variants={product.variants} selectedId={activeVariant.id} onSelect={setSelectedId} />
            {state.errors?.selected_weight && (
              <p className="text-xs text-accent">{state.errors.selected_weight}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Quantity</p>
            <QuantityStepper qty={quantity} onChange={(nextQty) => setQuantity(Math.max(1, nextQty))} />
          </div>
          {state.errors?.quantity && <p className="text-xs text-accent">{state.errors.quantity}</p>}

          <div className="grid gap-4 md:grid-cols-2">
            <Input 
              id="pre_full_name" 
              name="full_name" 
              label="Full Name"
              placeholder="Mahmud Delowar" 
              required 
              error={state.errors?.full_name}
            />
            <Input 
              id="pre_phone" 
              name="phone" 
              label="Phone Number"
              placeholder="+91 XXXXX XXXXX" 
              required 
              error={state.errors?.phone}
            />
          </div>

          <Input 
            id="pre_email" 
            name="email" 
            label="Email Address (Optional)"
            placeholder="you@example.com" 
            type="email" 
          />

          <div className="space-y-2">
            <label htmlFor="fulfillment_method" className="text-[10px] uppercase tracking-[0.3em] text-cream/60 font-semibold block ml-1">Fulfillment Method</label>
            <select
              id="fulfillment_method"
              name="fulfillment_method"
              className="w-full rounded-lg border border-white/20 bg-cream/90 px-4 py-3 text-sm text-ink focus:border-accent focus:outline-none"
              defaultValue=""
              required
            >
              <option value="" disabled>Choose one</option>
              <option value="pickup_from_7_sisters_restro">Pickup from 7 Sisters Restro</option>
              <option value="local_delivery">Local Delivery</option>
              <option value="shipping_inquiry">Shipping Inquiry</option>
            </select>
            {state.errors?.fulfillment_method && <p className="text-xs text-accent">{state.errors.fulfillment_method}</p>}
          </div>

          <TextArea
            id="pre_note"
            name="note"
            label="Reservation Notes (Optional)"
            placeholder="Any special requests or details..."
          />

          <div className="space-y-4">
             <p className="text-xs uppercase tracking-[0.3em] text-cream/50">Confirmation Mode</p>
             <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMode('reserve')}
                  className={`rounded-xl border p-4 text-center transition-all ${paymentMode === 'reserve' ? 'border-accent bg-accent/10 text-accent' : 'border-white/20 text-cream/70'}`}
                >
                  <p className="text-sm font-semibold">Reserve Only</p>
                  <p className="text-[10px] uppercase tracking-wider">Pay Later</p>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMode('pay_now')}
                  className={`rounded-xl border p-4 text-center transition-all ${paymentMode === 'pay_now' ? 'border-accent bg-accent/10 text-accent' : 'border-white/20 text-cream/70'}`}
                >
                  <p className="text-sm font-semibold">Pay Advance</p>
                  <p className="text-[10px] uppercase tracking-wider">Confirm now</p>
                </button>
             </div>
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full text-sm py-4"
              loading={isProcessing}
              disabled={isProcessing}
            >
              {paymentMode === 'pay_now' ? 'Reserve & Pay (₹' + (activeVariant.priceInr * quantity) + ')' : 'Reserve Your Pack'}
            </Button>
            <p className="mt-3 text-[10px] text-center text-cream/40 uppercase tracking-widest leading-relaxed">
              Your details are securely saved in our system first. <br/>
              WhatsApp confirmation follows on the next step.
            </p>
          </div>
          {errorMsg && <p className="text-xs text-accent text-center">{errorMsg}</p>}
        </form>
      )}
    </div>
  );
}
