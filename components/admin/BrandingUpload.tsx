'use client';

import { useState, useRef } from 'react';
import Button from '@/components/ui/Button';
import Image from 'next/image';
import { updateBrandingLogo, updateBrandingFavicon, updateBrandingHero, updateBrandingBanner, updateBrandingRestro, updateBrandingAbout, updateBrandingFssaiCert, removeBrandingAsset } from '@/app/actions/branding';
import ImageEditor from './ImageEditor';
import { Upload, X, Check, Image as ImageIcon, Globe } from 'lucide-react';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

type BrandingUploadProps = {
  type: 'logo' | 'favicon' | 'hero' | 'banner' | 'restro' | 'about' | 'fssai_certificate';
  currentUrl: string | null;
  fallbackUrl: string;
};

export default function BrandingUpload({ type, currentUrl, fallbackUrl }: BrandingUploadProps) {
  const [status, setStatus] = useState<'idle' | 'processing' | 'uploading' | 'editor'>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isFavicon = type === 'favicon';
  const labelMap = {
    logo: 'Website Logo',
    favicon: 'Favicon',
    hero: 'Global Hero Image',
    banner: 'Global Banner Image',
    restro: 'Restro Story Image',
    about: 'About Page Image',
    fssai_certificate: 'FSSAI Certificate'
  };
  const label = labelMap[type];
  const descriptionMap = {
    favicon: 'Ideal: 32x32 or 48x48. PNG, ICO, or WEBP (Max 512KB).',
    logo: 'Luxurious high-res logo. PNG, WEBP, or SVG (Max 2MB).',
    hero: 'Main homepage visual. Preferred: 16:9 aspect ratio (Max 4MB).',
    banner: 'Marketing banner background. Wide format (Max 3MB).',
    restro: '"From Restro to Home" section photo. Portrait or square preferred (Max 4MB).',
    about: 'About page hero image. Portrait or landscape (Max 4MB).',
    fssai_certificate: 'FSSAI Registration Certificate. PNG, JPG, or PDF-as-image (Max 4MB).'
  };
  const description = descriptionMap[type];

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSizeMap: Record<string, number> = {
      favicon: 512 * 1024,
      logo: 2 * 1024 * 1024,
      hero: 4 * 1024 * 1024,
      banner: 3 * 1024 * 1024,
      about: 3 * 1024 * 1024,
      restro: 3 * 1024 * 1024,
      fssai_certificate: 4 * 1024 * 1024
    };
    if (file.size > maxSizeMap[type]) {
      setError(`File is too large. Max ${maxSizeMap[type] / (1024 * 1024)}MB allowed.`);
      return;
    }

    // For logos, we use the editor. For favicons, we upload directly to preserve format (ICO etc)
    if (!isFavicon) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setStatus('editor');
    } else {
      await handleDirectUpload(file);
    }
    setError(null);
  }

  async function handleDirectUpload(file: File) {
    setStatus('uploading');
    const formData = new FormData();
    formData.append(type, file);
    
    const result = await updateBrandingFavicon(formData);
    if (!result.ok) {
        setError(result.error || 'Upload failed');
    }
    setStatus('idle');
    if (fileInputRef.current) fileInputRef.current.value = '';
  }

  async function handleCropComplete(croppedBlob: Blob) {
    setStatus('uploading');
    setError(null);

    try {
      const formData = new FormData();
      const file = new File([croppedBlob], `${type}-${Date.now()}.webp`, { type: 'image/webp' });
      formData.append(type, file);

      const result = type === 'logo'
        ? await updateBrandingLogo(formData)
        : type === 'hero'
        ? await updateBrandingHero(formData)
        : type === 'restro'
        ? await updateBrandingRestro(formData)
        : type === 'about'
        ? await updateBrandingAbout(formData)
        : type === 'fssai_certificate'
        ? await updateBrandingFssaiCert(formData)
        : await updateBrandingBanner(formData);
      
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
    setStatus('uploading');
    const result = await removeBrandingAsset(type);
    if (!result.ok) {
      setError(result.error || 'Removal failed');
    }
    setStatus('idle');
  }

  return (
    <div className="lux-surface p-8 space-y-8">
      <ConfirmDialog
        isOpen={isRemoveDialogOpen}
        onClose={() => setIsRemoveDialogOpen(false)}
        onConfirm={handleRemove}
        title={`Remove Custom ${label}`}
        description={`Are you sure you want to remove the custom ${type}? This will fallback to the original default asset.`}
        confirmLabel="Remove"
        variant="danger"
      />
      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Preview Area */}
        <div className="relative group">
          <div className={`relative ${isFavicon ? 'h-16 w-16' : type === 'hero' ? 'h-48 w-80' : 'h-32 w-64'} overflow-hidden rounded-xl bg-ink/50 border border-white/5 flex items-center justify-center p-4 transition-all group-hover:border-accent/30`}>
            <Image
              src={currentUrl || fallbackUrl}
              alt={`${label} preview`}
              fill={!isFavicon}
              width={isFavicon ? 32 : undefined}
              height={isFavicon ? 32 : undefined}
              className={`${isFavicon ? 'object-contain' : 'object-contain p-4'}`}
              unoptimized={isFavicon} // Don't optimize favicons to preserve ICO/transparency quirks
            />
            {!currentUrl && (
              <div className="absolute inset-0 flex items-center justify-center bg-ink/40 backdrop-blur-[1px]">
                <span className="text-[10px] uppercase tracking-widest text-cream/40 px-2 py-0.5 bg-ink/60 rounded-full border border-white/5">Default</span>
              </div>
            )}
          </div>
          {currentUrl && (
            <button 
              onClick={() => setIsRemoveDialogOpen(true)}
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors"
              title="Remove custom asset"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Info & Controls */}
        <div className="flex-1 space-y-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              {isFavicon ? <Globe className="w-4 h-4 text-accent" /> : <ImageIcon className="w-4 h-4 text-accent" />}
              <h3 className="text-lg font-medium text-cream">{label}</h3>
            </div>
            <p className="text-sm text-cream/50 leading-relaxed">{description}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={() => fileInputRef.current?.click()}
              disabled={status !== 'idle'}
              variant="primary"
              className="h-10 px-6 gap-2"
            >
              {status === 'uploading' ? (
                <span className="animate-spin rounded-full h-4 w-4 border-2 border-ink border-t-transparent" />
              ) : <Upload className="w-4 h-4" />}
              {status === 'uploading' ? 'Uploading...' : currentUrl ? 'Replace Asset' : 'Select File'}
            </Button>
            
            {status === 'processing' && (
               <div className="flex items-center gap-2 text-xs text-accent animate-pulse">
                 <Check className="w-3 h-3" />
                 Processing...
               </div>
            )}
          </div>

          {error && <p className="text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">{error}</p>}
        </div>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept={isFavicon ? ".ico,.png,.webp" : "image/jpeg,image/png,image/webp,image/svg+xml"} 
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
