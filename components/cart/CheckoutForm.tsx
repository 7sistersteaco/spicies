'use client';

import { forwardRef, useState, useEffect } from 'react';
import Input from '@/components/ui/Input';
import TextArea from '@/components/ui/TextArea';

type CheckoutErrors = Partial<Record<string, string>>;

type CheckoutFormProps = {
  errors?: CheckoutErrors;
};

const CheckoutForm = forwardRef<HTMLFormElement, CheckoutFormProps>(({ errors }, ref) => {
  const [pincode, setPincode] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  useEffect(() => {
    if (pincode.length === 6 && /^\d+$/.test(pincode)) {
      const lookupPincode = async () => {
        setIsLookupLoading(true);
        try {
          const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const data = await response.json();
          if (data && data[0]?.Status === 'Success') {
            const details = data[0].PostOffice[0];
            setCity(details.District);
            setState(details.State);
          }
        } catch (error) {
          console.error('Pincode lookup failed:', error);
        } finally {
          setIsLookupLoading(false);
        }
      };
      lookupPincode();
    }
  }, [pincode]);

  return (
    <form ref={ref} className="space-y-6 pb-12">
      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          id="full_name" 
          label="Full Name"
          placeholder="Mahmud Delowar" 
          name="full_name" 
          required 
          error={errors?.full_name}
        />
        <Input 
          id="phone" 
          label="Phone Number"
          placeholder="+91 XXXXX XXXXX" 
          name="phone" 
          type="tel" 
          required 
          error={errors?.phone}
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          id="email" 
          label="Email Address"
          placeholder="you@example.com" 
          name="email" 
          type="email" 
          required 
          error={errors?.email}
        />
        <div className="relative">
          <Input 
            id="pincode"
            label="Pincode"
            placeholder="600001" 
            name="pincode" 
            value={pincode} 
            onChange={(e) => setPincode(e.target.value)}
            required 
            maxLength={6}
            error={errors?.pincode}
          />
          {isLookupLoading && (
            <div className="absolute right-3 bottom-3.5 h-3 w-3 animate-spin rounded-full border-2 border-accent border-t-transparent" />
          )}
        </div>
      </div>
      <Input 
        id="address_line_1" 
        label="Street Address"
        placeholder="House No, Building, Street" 
        name="address_line_1" 
        required 
        error={errors?.address_line_1}
      />
      <Input 
        id="address_line_2" 
        label="Area / Locality (Optional)"
        placeholder="Sector, Landmark" 
        name="address_line_2" 
      />
      <Input 
        id="landmark" 
        label="Landmark (Optional)"
        placeholder="Near Apollo Hospital" 
        name="landmark" 
      />
      <div className="grid gap-4 md:grid-cols-2">
        <Input 
          id="city"
          label="City"
          placeholder="Chennai" 
          name="city" 
          value={city} 
          onChange={(e) => setCity(e.target.value)}
          required 
          error={errors?.city}
        />
        <Input 
          id="state"
          label="State"
          placeholder="Tamil Nadu" 
          name="state" 
          value={state} 
          onChange={(e) => setState(e.target.value)}
          required 
          error={errors?.state}
        />
      </div>
      <div className="hidden" aria-hidden="true">
        <input type="text" name="hp_field" tabIndex={-1} autoComplete="off" />
      </div>
      <TextArea
        id="notes"
        label="Order Notes (Optional)"
        name="notes"
        placeholder="Special instructions for delivery..."
      />
    </form>
  );
});

CheckoutForm.displayName = 'CheckoutForm';

export default CheckoutForm;
