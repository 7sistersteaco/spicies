'use client';

import { useState } from 'react';
import { reauthenticate } from '@/app/actions/auth';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { ShieldCheck, X, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type ReauthModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onVerified: () => void;
  title?: string;
  description?: string;
};

export default function ReauthModal({ 
  isOpen, 
  onClose, 
  onVerified,
  title = "Security Verification",
  description = "Please enter your current password to proceed with this sensitive action."
}: ReauthModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsVerifying(true);
    setError(null);

    const formData = new FormData();
    formData.append('password', password);

    const result = await reauthenticate(formData);
    
    if (result.ok) {
      onVerified();
      onClose();
      setPassword('');
    } else {
      setError(result.error || 'Verification failed');
    }
    setIsVerifying(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/80 backdrop-blur-md z-[100]"
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md lux-surface p-8 z-[101] shadow-2xl"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-cream/40 hover:text-cream transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center space-y-6">
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center text-accent border border-accent/20">
                <ShieldCheck size={32} />
              </div>
              
              <div className="space-y-2">
                <h3 className="text-2xl font-bold text-cream">{title}</h3>
                <p className="text-sm text-cream/60 leading-relaxed">{description}</p>
              </div>

              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <Input
                  label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoFocus
                />

                {error && (
                  <p className="text-sm text-accent bg-accent/10 py-3 rounded-lg border border-accent/20">
                    {error}
                  </p>
                )}

                <div className="flex flex-col gap-3">
                  <Button 
                    type="submit" 
                    className="w-full h-12 gap-2"
                    loading={isVerifying}
                  >
                    {!isVerifying && <Lock size={16} />}
                    Verify Identity
                  </Button>
                  <button 
                    type="button"
                    onClick={onClose}
                    className="text-xs uppercase tracking-[0.2em] text-cream/30 hover:text-cream transition-colors py-2"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
