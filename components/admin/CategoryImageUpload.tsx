'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Upload, X } from 'lucide-react';
import Button from '@/components/ui/Button';
import ImageEditor from './ImageEditor';
import ConfirmModal from './ConfirmModal';
import { updateCategoryImage, removeCategoryImage } from '@/app/actions/branding';

type Props = {
  slug: 'tea' | 'spices';
  currentUrl: string | null;
  fallbackSvg: string;
  label: string;
};

export default function CategoryImageUpload({ slug, currentUrl, fallbackSvg, label }: Props) {
  const [status, setStatus] = useState<'idle' | 'editor' | 'uploading'>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [removeOpen, setRemoveOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError('File too large. Max 4MB.');
      return;
    }
    setError(null);
    setSelectedFile(file);
    setStatus('editor');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleCropComplete(blob: Blob) {
    setStatus('uploading');
    setError(null);
    try {
      const formData = new FormData();
      const file = new File([blob], `category-${slug}-${Date.now()}.webp`, { type: 'image/webp' });
      formData.append('category_image', file);
      const result = await updateCategoryImage(formData, slug);
      if (!result.ok) setError(result.error || 'Upload failed');
    } catch {
      setError('Unexpected upload error');
    } finally {
      setStatus('idle');
      setSelectedFile(null);
    }
  }

  function handleCancel() {
    setStatus('idle');
    setSelectedFile(null);
  }

  async function handleRemove() {
    setStatus('uploading');
    const result = await removeCategoryImage(slug);
    if (!result.ok) setError(result.error || 'Removal failed');
    setStatus('idle');
  }

  const displaySrc = currentUrl || fallbackSvg;

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start">
      {/* Preview */}
      <div className="relative group shrink-0">
        <div className="relative h-36 w-56 overflow-hidden rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center transition-all group-hover:border-accent/20">
          <Image
            src={displaySrc}
            alt={`${label} category image`}
            fill
            className="object-contain p-4"
            unoptimized
          />
          {!currentUrl && (
            <div className="absolute inset-0 flex items-center justify-center bg-ink/40 backdrop-blur-[1px]">
              <span className="text-[9px] uppercase tracking-widest text-cream/40 px-2 py-0.5 bg-ink/60 rounded-full border border-white/5">SVG Default</span>
            </div>
          )}
        </div>
        {currentUrl && (
          <button
            onClick={() => setRemoveOpen(true)}
            className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
            title="Remove uploaded image"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Controls */}
      <div className="flex-1 space-y-3">
        <div>
          <p className="text-sm font-semibold text-cream">{label} Category Image</p>
          <p className="text-[10px] text-cream/40 mt-0.5">
            {currentUrl
              ? 'Custom image active. Remove to revert to SVG.'
              : 'No custom image — SVG fallback is active.'}
          </p>
          <p className="text-[10px] text-cream/30 mt-0.5">PNG, WEBP, JPG or SVG · Max 4MB</p>
        </div>
        <Button
          type="button"
          variant="outline"
          className="h-9 px-5 text-[10px] gap-2"
          onClick={() => fileInputRef.current?.click()}
          disabled={status !== 'idle'}
        >
          {status === 'uploading' ? (
            <span className="animate-spin rounded-full h-3 w-3 border-2 border-cream border-t-transparent" />
          ) : (
            <Upload className="w-3 h-3" />
          )}
          {status === 'uploading' ? 'Uploading...' : currentUrl ? 'Replace Image' : 'Upload Image'}
        </Button>
        {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/jpeg,image/png,image/webp,image/svg+xml"
        className="hidden"
      />

      {status === 'editor' && selectedFile && (
        <ImageEditor
          imageFile={selectedFile}
          onSave={handleCropComplete}
          onCancel={handleCancel}
        />
      )}

      <ConfirmModal
        isOpen={removeOpen}
        onClose={() => setRemoveOpen(false)}
        onConfirm={handleRemove}
        title={`Remove ${label} Image?`}
        description={`This will remove the custom image and revert to the default SVG illustration for the ${label} category card on the homepage.`}
        confirmLabel="Remove"
        cancelLabel="Keep It"
        variant="danger"
      />
    </div>
  );
}
