import { getBrandingSettings } from '@/app/actions/branding';

export const getWhatsAppNumber = (dbNumber?: string | null) => {
  // 1. Prioritize DB number if provided
  if (dbNumber && dbNumber.length >= 10) {
    return dbNumber.replace(/[^0-9]/g, '');
  }

  // 2. Fallback to Environment Variable
  const envNum = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  
  if (!envNum || envNum.includes('00000') || envNum.length < 10) {
    console.warn('WhatsApp number missing or placeholder. Using fallback.');
    return '919876543210'; // Hard fallback for UX stability
  }
  
  return String(envNum).replace(/[^0-9]/g, '');
};

// Legacy support - will use ENV fallback
export const WHATSAPP_NUMBER = getWhatsAppNumber();

// Modern support - dynamic from DB
export const getDynamicWhatsAppNumber = async () => {
  const settings = await getBrandingSettings();
  return getWhatsAppNumber(settings.whatsapp_number);
};
