'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { updateProductImage, removeProductImage } from '@/app/actions/products';
import ImageEditor from './ImageEditor';

type ImageUploadProps = {
  productId: string;
  currentImageUrl: string | null;
  fallbackUrl: string;
};

export default function ImageUpload({ productId, currentImageUrl, fallbackUrl }: ImageUploadProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'uploading' | 'editor'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File is too large. Max 5MB allowed.');
      return;
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setStatus('editor');
    setError(null);
  }

  async function handleCropComplete(croppedBlob: Blob) {
    setStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      // Use the original filename or standard naming, server action will enforce .webp
      const file = new File([croppedBlob], `${productId}.webp`, { type: 'image/webp' });
      formData.append('image', file);

      const result = await updateProductImage(productId, formData);
      
      if (!result.ok) {
        setError(result.error || 'Upload failed');
      }
      
      setStatus('idle');
      setSelectedFile(null);
      setPreviewUrl(null);
    } catch (err) {
      setError('Unexpected error during optimization');
      setStatus('idle');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  function handleCancel() {
    setStatus('idle');
    setSelectedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleRemove() {
    if (!confirm('Are you sure you want to remove the custom image? This will fallback to the original SVG.')) return;
    
    setStatus('uploading');
    const result = await removeProductImage(productId);
    if (!result.ok) {
      setError(result.error || 'Removal failed');
    }
    setStatus('idle');
  }

  return (
    <div className="space-y-6">
      <div className="lux-surface p-6">
          <div className="relative aspect-square w-full max-w-[240px] overflow-hidden rounded-2xl bg-ink/50 border border-white/5">
            <Image
              src={currentImageUrl || fallbackUrl}
              alt="Product preview"
              fill
              className="object-contain p-4"
            />
            {!currentImageUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40 backdrop-blur-[2px]">
                <span className="text-[10px] uppercase tracking-widest text-cream/40 px-3 py-1 bg-ink/60 rounded-full border border-white/5">Default SVG</span>
              </div>
            )}
          </div>
          
          <div className="flex-1 space-y-4">
            <div className="space-y-1">
              <h4 className="text-sm font-medium text-cream">Product Photo</h4>
              <p className="text-xs text-cream/50">Only JPG, PNG or WEBP allowed. Max 3MB.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <Button 
                onClick={() => fileInputRef.current?.click()}
                disabled={status !== 'idle'}
                variant="outline"
                className="h-10 border-accent/40 text-accent hover:bg-accent/5"
              >
                {status === 'uploading' ? 'Saving...' : currentImageUrl ? 'Replace Image' : 'Upload Image'}
              </Button>
              
              {currentImageUrl && (
                <Button 
                  onClick={handleRemove}
                  disabled={status !== 'idle'}
                  variant="outline"
                  className="h-10 border-red-500/30 text-red-400 hover:bg-red-500/5 hover:border-red-500/50"
                >
                  Remove Custom
                </Button>
              )}
            </div>

            {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      </div>
      
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/jpeg,image/png,image/webp" 
        className="hidden" 
      />

      {status === 'editor' && selectedFile && (
        <ImageEditor
          imageFile={selectedFile}
          onSave={handleCropComplete}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
}
