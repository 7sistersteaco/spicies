'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, ZoomIn, Scissors } from 'lucide-react';
import Button from '@/components/ui/Button';
import { processProductImage, type CropArea } from '@/lib/utils/imageProcessing';

interface ImageEditorProps {
  imageFile: File;
  onSave: (processedBlob: Blob) => void;
  onCancel: () => void;
  aspect?: number;
}

export default function ImageEditor({ 
  imageFile, 
  onSave, 
  onCancel, 
  aspect = 1 //Default to square for ecommerce
}: ImageEditorProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Load image
  React.useEffect(() => {
    const url = URL.createObjectURL(imageFile);
    setImageSrc(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const onCropComplete = useCallback((_area: any, pixels: CropArea) => {
    setCroppedAreaPixels(pixels);
  }, []);

  const handleSave = async () => {
    if (!croppedAreaPixels || !imageFile) return;
    
    setIsProcessing(true);
    try {
      const optimizedBlob = await processProductImage(imageFile, croppedAreaPixels);
      onSave(optimizedBlob);
    } catch (err) {
      console.error('Processing error:', err);
      alert('Failed to process image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/90 backdrop-blur-md"
      >
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-full max-w-2xl bg-surface border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-white/5">
            <div className="flex items-center gap-2 text-cream">
              <Scissors className="w-4 h-4 text-accent" />
              <h3 className="font-medium">Optimize Product Image</h3>
            </div>
            <button 
              onClick={onCancel}
              className="p-2 hover:bg-white/5 rounded-full transition-colors text-cream/40"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Editor Area */}
          <div className="relative h-[400px] bg-black">
            {imageSrc && (
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                aspect={aspect}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
                classes={{
                   containerClassName: 'bg-black',
                   cropAreaClassName: 'border-2 border-accent shadow-[0_0_0_9999px_rgba(0,0,0,0.5)]'
                }}
              />
            )}
          </div>

          {/* Controls */}
          <div className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <ZoomIn className="w-4 h-4 text-cream/40" />
              <input
                type="range"
                value={zoom}
                min={1}
                max={3}
                step={0.1}
                aria-labelledby="Zoom"
                onChange={(e) => setZoom(Number(e.target.value))}
                className="flex-1 accent-accent"
              />
              <span className="text-xs font-mono text-cream/40 w-8">{zoom.toFixed(1)}x</span>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline"
                className="flex-1 h-12 border-white/10 text-cream/60 hover:text-cream"
                onClick={onCancel}
              >
                Cancel
              </Button>
              <Button 
                variant="primary"
                className="flex-1 h-12"
                onClick={handleSave}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Optimizing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Save Changes
                  </div>
                )}
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
