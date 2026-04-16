export const getWhatsAppNumber = () => {
  const num = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  
  // Strict production validation
  if (!num || num.includes('00000') || num.length < 10) {
    console.error('CRITICAL: NEXT_PUBLIC_WHATSAPP_NUMBER is missing or set to a placeholder.');
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Deployment Blocked: Valid NEXT_PUBLIC_WHATSAPP_NUMBER is required.');
    }
  }
  
  // Normalize: remove any +, spaces, or dashes just in case
  return String(num ?? '').replace(/[^0-9]/g, '');
};

export const WHATSAPP_NUMBER = getWhatsAppNumber();
