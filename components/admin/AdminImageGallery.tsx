'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/lib/products/types';
import Button from '@/components/ui/Button';
import { 
  Plus, Trash2, Star, ArrowUp, ArrowDown, 
  Image as ImageIcon, Loader2, AlertCircle 
} from 'lucide-react';
import { uploadGalleryImage } from '@/app/actions/products';
import { cx } from '@/lib/utils';
import ImageEditor from './ImageEditor';
import ConfirmModal from '@/components/admin/ConfirmModal';

type Props = {
  images: any[];
  onChange: (images: any[]) => void;
};

export default function AdminImageGallery({ images, onChange }: Props) {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editorFile, setEditorFile] = useState<File | null>(null);
  const [imageToDelete, setImageToDelete] = useState<{ id: string; index: number; isPrimary: boolean } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // We process the first file in the editor, and others will be processed in batch if needed
    // Actually, for professional UX, we'll process all via sequential blobs or just the first one in editor
    // Let's support selecting multiple and processing them one by one
    setEditorFile(files[0]);
    
    // Store pending files if multiple selected
    if (files.length > 1) {
      setPendingFiles(files.slice(1));
    }
    
    setError(null);
  };

  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  const handleSaveCropped = async (blob: Blob) => {
    setIsUploading(true);
    setError(null);
    setEditorFile(null);

    try {
      await uploadAndAdd(blob);
      
      // If there are pending files, open the next one in the editor
      if (pendingFiles.length > 0) {
        const next = pendingFiles[0];
        setPendingFiles(prev => prev.slice(1));
        setEditorFile(next);
      }
    } catch (err) {
      setError('Unexpected upload error');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const uploadAndAdd = async (blob: Blob) => {
    const formData = new FormData();
    const file = new File([blob], 'product-image.webp', { type: 'image/webp' });
    formData.append('image', file);

    const result = await uploadGalleryImage(formData);
    if (result.ok && result.url) {
      const newImg = {
        id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        image_url: result.url,
        is_primary: images.length === 0,
        sort_order: images.length
      };
      onChange([...images, newImg]);
    } else {
      throw new Error(result.error || 'Upload failed');
    }
  };

  const removeImage = (id: string) => {
    const filtered = images.filter(img => img.id !== id);
    // If we removed the primary, assign it to the first one available
    if (images.find(img => img.id === id)?.is_primary && filtered.length > 0) {
      filtered[0].is_primary = true;
    }
    onChange(filtered);
  };

  const setPrimary = (id: string) => {
    onChange(images.map(img => ({
      ...img,
      is_primary: img.id === id
    })));
  };

  const moveImage = (index: number, direction: 'up' | 'down') => {
    const newImages = [...images];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= images.length) return;

    [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
    
    // Update sort orders
    const updated = newImages.map((img, i) => ({ ...img, sort_order: i }));
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
         <div className="flex items-center gap-3">
          <div className="p-2 bg-accent/10 rounded-lg text-accent">
            <ImageIcon size={18} />
          </div>
          <div>
            <h2 className="text-sm font-bold uppercase tracking-widest text-cream leading-none">Media Gallery</h2>
            <p className="text-[10px] text-cream/30 uppercase tracking-[0.2em] mt-1">Multi-image product showcase</p>
          </div>
        </div>
        <Button 
          type="button" 
          variant="outline" 
          className="h-9 px-4 text-[10px]"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          {isUploading ? <Loader2 size={14} className="animate-spin mr-2" /> : <Plus size={14} className="mr-2" />}
          Add Image
        </Button>
      </div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
        multiple
      />

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
          <AlertCircle size={14} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-4 grid-cols-2 md:grid-cols-3">
        {images.map((img, index) => (
          <div 
            key={img.id} 
            className={cx(
              "group relative aspect-square rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden transition-all",
              img.is_primary ? "ring-2 ring-accent border-transparent" : "hover:border-white/20"
            )}
          >
            <Image 
              src={img.image_url} 
              alt="Gallery item" 
              fill 
              className="object-cover transition-transform group-hover:scale-105"
            />
            
            {/* Overlay Controls */}
            <div className="absolute inset-x-2 bottom-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="flex items-center gap-1 bg-ink/80 backdrop-blur-md p-1 rounded-lg border border-white/10">
                <button 
                  type="button"
                  onClick={() => moveImage(index, 'up')}
                  disabled={index === 0}
                  className="p-1 hover:text-accent disabled:text-cream/20 transition-colors"
                >
                  <ArrowUp size={14} />
                </button>
                <button 
                  type="button"
                  onClick={() => moveImage(index, 'down')}
                  disabled={index === images.length - 1}
                  className="p-1 hover:text-accent disabled:text-cream/20 transition-colors"
                >
                  <ArrowDown size={14} />
                </button>
              </div>

              <div className="flex items-center gap-1 bg-ink/80 backdrop-blur-md p-1 rounded-lg border border-white/10">
                <button 
                  type="button"
                  onClick={() => setPrimary(img.id)}
                  className={cx(
                    "p-1 transition-colors",
                    img.is_primary ? "text-accent" : "hover:text-accent"
                  )}
                  title="Make Primary"
                >
                  <Star size={14} fill={img.is_primary ? "currentColor" : "none"} />
                </button>
                <button 
                  type="button"
                  onClick={() => setImageToDelete({ id: img.id, index, isPrimary: img.is_primary })}
                  className="p-1 hover:text-red-400 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            {img.is_primary && (
              <div className="absolute top-2 left-2 bg-accent text-ink text-[8px] font-bold uppercase tracking-widest px-2 py-1 rounded-full shadow-lg">
                Primary
              </div>
            )}
            
            <div className="absolute top-2 right-2 bg-ink/60 backdrop-blur-sm text-cream/40 text-[8px] font-bold px-2 py-1 rounded-full border border-white/10">
              #{index + 1}
            </div>
          </div>
        ))}

        {images.length === 0 && !isUploading && (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="aspect-square rounded-2xl border-2 border-dashed border-white/5 bg-white/[0.01] flex flex-col items-center justify-center gap-3 cursor-pointer hover:bg-white/[0.03] hover:border-white/10 transition-all text-cream/20 hover:text-cream/40"
          >
            <ImageIcon size={32} />
            <span className="text-[10px] uppercase tracking-widest font-bold">Upload Gallery Assets</span>
          </div>
        )}

        {isUploading && (
          <div className="aspect-square rounded-2xl border-2 border-dashed border-accent/20 bg-accent/5 flex flex-col items-center justify-center gap-3 text-accent animate-pulse">
            <Loader2 size={32} className="animate-spin" />
            <span className="text-[10px] uppercase tracking-widest font-bold tracking-tighter">Optimizing WebP...</span>
          </div>
        )}
      </div>

      {editorFile && (
        <ImageEditor 
          imageFile={editorFile} 
          onSave={handleSaveCropped} 
          onCancel={() => setEditorFile(null)} 
        />
      )}

      <ConfirmModal
        isOpen={!!imageToDelete}
        onClose={() => setImageToDelete(null)}
        onConfirm={() => {
          if (imageToDelete) removeImage(imageToDelete.id);
          setImageToDelete(null);
        }}
        title="Delete Image?"
        description={`Delete image #${(imageToDelete?.index ?? 0) + 1}${
          imageToDelete?.isPrimary
            ? ' — this is your primary image. The next image in the gallery will become primary.'
            : ' from the gallery. This cannot be undone after saving.'
        }`}
        confirmLabel="Delete Image"
        cancelLabel="Keep It"
        variant="danger"
      />
    </div>
  );
}
