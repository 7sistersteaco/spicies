'use client';

import { useState, useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { upsertProduct } from '@/app/actions/products';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Product, Category, ProductVariant, ProductImage } from '@/lib/products/types';
import { 
  Package, Save, Info, AlertTriangle, CheckCircle2, 
  ExternalLink, Globe, Layout, Image as ImageIcon, 
  BarChart3, Settings2, Trash2, Eye, Plus, ArrowUp, ArrowDown 
} from 'lucide-react';
import AdminImageGallery from './AdminImageGallery';
import AdminProductDangerZone from '@/components/admin/AdminProductDangerZone';
import ConfirmModal from '@/components/admin/ConfirmModal';
import { cx } from '@/lib/utils';

type Props = {
  product?: Product;
  categories: Category[];
};

export default function AdminProductForm({ product, categories }: Props) {
  const [state, formAction] = useFormState(upsertProduct, { ok: false, error: '' });
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();
  
  // Management of dynamic variants
  const [variants, setVariants] = useState<any[]>(
    product?.variants?.length ? product.variants : [
      { id: 'new-0', weightLabel: 'Standard Pack', priceInr: 0, stockQty: 0, isActive: true, sort_order: 0 }
    ]
  );

  // Management of product images
  const [images, setImages] = useState<any[]>(product?.product_images || []);

  const [isActive, setIsActive] = useState(product?.is_active ?? true);
  const [variantToDelete, setVariantToDelete] = useState<{ id: string; label: string } | null>(null);

  // SEO Extraction
  const seoTitle = (product?.attributes as any)?.seoTitle || '';
  const seoDescription = (product?.attributes as any)?.seoDescription || '';

  const addVariant = () => {
    setVariants([
      ...variants,
      { id: `new-${Date.now()}`, weightLabel: '', priceInr: 0, stockQty: 0, isActive: true, sort_order: variants.length }
    ]);
  };

  const removeVariant = (id: string) => {
    if (variants.length === 1) return;
    setVariants(variants.filter(v => v.id !== id));
  };

  const updateVariant = (id: string, field: string, value: any) => {
    setVariants(variants.map(v => v.id === id ? { ...v, [field]: value } : v));
  };

  const moveVariant = (index: number, direction: 'up' | 'down') => {
    const newVariants = [...variants];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= variants.length) return;

    [newVariants[index], newVariants[targetIndex]] = [newVariants[targetIndex], newVariants[index]];
    const updated = newVariants.map((v, i) => ({ ...v, sort_order: i }));
    setVariants(updated);
  };

  return (
    <form action={async (formData) => {
      setIsPending(true);
      formData.set('is_active', String(isActive));
      formData.set('variants_json', JSON.stringify(variants));
      formData.set('images_json', JSON.stringify(images));
      const result = await formAction(formData);
      setIsPending(false);
      // Refresh server state so admin UI reflects the saved data immediately
      router.refresh();
    }} className="space-y-10 pb-20">
      {product?.id && <input type="hidden" name="id" value={product.id} />}

      {/* Sticky Top Bar */}
      <div className="sticky top-0 z-30 -mx-4 px-4 py-3 md:-mx-8 md:px-8 bg-ink/80 backdrop-blur-xl border-b border-white/5 flex flex-wrap items-center justify-between gap-3 md:gap-4 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <h1 className="text-sm md:text-lg font-bold text-cream tracking-tight truncate max-w-[150px] sm:max-w-[200px] md:max-w-md">
              {product?.id ? `Editing: ${product.name}` : 'New Product Entry'}
            </h1>
            <div className="flex items-center gap-2">
               <span className={cx(
                 "h-2 w-2 rounded-full",
                 isActive ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" : "bg-cream/20"
               )} />
               <p className="text-[10px] uppercase tracking-widest text-cream/40 font-bold">
                 Status: {isActive ? 'Published' : 'Draft'}
               </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {product?.id && product.category && (
            <Button 
              href={`/products/${product.category}/${product.slug}`}
              target="_blank"
              variant="outline" 
              className="h-10 px-4 text-[10px] hidden sm:flex"
            >
              <Eye size={14} className="mr-2" /> View Live
            </Button>
          )}
          <Button 
            type="submit" 
            className="h-9 md:h-10 px-4 md:px-8 min-w-[110px] md:min-w-[140px] text-[10px] md:text-sm" 
            loading={isPending}
          >
            <Save size={14} className="mr-1 md:mr-2" /> {product?.id ? 'Save' : 'Create'}
          </Button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-12 items-start">
        {/* Main Content Column */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* General Information */}
          <section className="lux-surface p-5 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <Layout size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-cream leading-none">Product Fundamentals</h2>
                  <p className="text-[10px] text-cream/30 uppercase tracking-[0.2em] mt-1">Core details & categorization</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <Input
                label="Public Title"
                name="name"
                defaultValue={product?.name || ''}
                placeholder="e.g., Premium Assam Gold CTC"
                required
              />
              
              <div className="grid gap-6 md:grid-cols-2 text-ink">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block ml-1">Parent Category</label>
                  <select 
                    name="category_id"
                    defaultValue={product?.category_id || categories[0]?.id}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream outline-none focus:border-accent/40 transition-colors appearance-none"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id} className="bg-ink text-cream">{cat.name}</option>
                    ))}
                  </select>
                </div>
                <Input
                  label="Merchandising Note (Short Desc)"
                  name="shortDescription"
                  defaultValue={product?.shortDescription || ''}
                  placeholder="The bold choice for morning ritual."
                />
              </div>

              <div className="space-y-2 text-ink">
                <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block ml-1">Deep Narrative (Description)</label>
                <textarea
                  name="description"
                  defaultValue={product?.description || ''}
                  rows={6}
                  placeholder="Immerse your customers in the origins, tasting profiles, and crafting process..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-relaxed text-cream outline-none focus:border-accent/40 transition-colors resize-none placeholder:text-cream/20"
                />
              </div>
            </div>
          </section>

          {/* Media Gallery Section */}
          <section className="lux-surface p-5 md:p-8">
             <AdminImageGallery 
              images={images} 
              onChange={setImages} 
             />
          </section>

          {/* Pricing & Variants Management */}
          <section className="lux-surface p-5 md:p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg text-accent">
                  <BarChart3 size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-widest text-cream leading-none">Commerce & Variants</h2>
                  <p className="text-[10px] text-cream/30 uppercase tracking-[0.2em] mt-1">Weight-based pricing & inventory</p>
                </div>
              </div>
              <Button type="button" variant="outline" className="h-8 text-[9px] px-3" onClick={addVariant}>
                <Plus size={12} className="mr-1" /> Add Weight Option
              </Button>
            </div>

            <div className="space-y-4">
              {variants.map((v, index) => (
                <div key={v.id} className="group relative grid gap-4 md:grid-cols-[40px_1fr_120px_100px_40px_40px] items-end bg-white/[0.02] border border-white/5 p-4 md:p-5 rounded-2xl transition-all hover:bg-white/[0.04] hover:border-accent/40">
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-start gap-2 md:gap-1 pb-1 md:pb-0 border-b md:border-0 border-white/5 mb-2 md:mb-0">
                    <span className="text-[10px] text-cream/20 md:hidden uppercase font-bold tracking-widest">Order</span>
                    <div className="flex md:flex-col gap-2 md:gap-1">
                      <button 
                        type="button" 
                        onClick={() => moveVariant(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-cream/20 hover:text-accent disabled:opacity-0"
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button 
                        type="button" 
                        onClick={() => moveVariant(index, 'down')}
                        disabled={index === variants.length - 1}
                        className="p-1 text-cream/20 hover:text-accent disabled:opacity-0"
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-cream/30 font-bold block ml-1">Option Label</label>
                    <input 
                      type="text" 
                      value={v.weightLabel} 
                      onChange={(e) => updateVariant(v.id, 'weightLabel', e.target.value)}
                      placeholder="e.g., 250g Pack"
                      className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-cream focus:border-accent outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-widest text-cream/30 font-bold block ml-1">Price (₹)</label>
                    <input 
                      type="number" 
                      value={v.priceInr} 
                      onChange={(e) => updateVariant(v.id, 'priceInr', e.target.valueAsNumber)}
                      className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-cream focus:border-accent outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="space-y-2 text-ink">
                    <label className="text-[9px] uppercase tracking-widest text-cream/30 font-bold block ml-1">Stock</label>
                    <input 
                      type="number" 
                      value={v.stockQty} 
                      onChange={(e) => updateVariant(v.id, 'stockQty', e.target.valueAsNumber)}
                      className="w-full bg-transparent border-b border-white/10 py-1 text-sm text-cream focus:border-accent outline-none transition-colors"
                      required
                    />
                  </div>
                  <div className="flex flex-row md:flex-col items-center justify-between md:justify-center gap-4 md:gap-2 pb-1 pt-4 md:pt-0 border-t md:border-0 border-white/5 mt-2 md:mt-0">
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] md:text-[9px] uppercase tracking-widest text-cream/30 font-bold">Status</label>
                      <button 
                        type="button"
                        onClick={() => updateVariant(v.id, 'isActive', !v.isActive)}
                        className={cx(
                          "h-6 w-10 rounded-full transition-colors relative",
                          v.isActive ? "bg-accent" : "bg-white/10"
                        )}
                      >
                        <div className={cx(
                          "absolute top-1 h-4 w-4 rounded-full bg-white transition-all",
                          v.isActive ? "left-5" : "left-1"
                        )} />
                      </button>
                    </div>
                    
                    <button 
                      type="button" 
                      onClick={() => setVariantToDelete({ id: v.id, label: v.weightLabel || 'this weight option' })}
                      disabled={variants.length === 1}
                      title={variants.length === 1 ? 'Cannot remove the only variant' : 'Remove weight option'}
                      className="p-2 text-red-500/40 hover:text-red-500 transition-colors bg-red-500/5 rounded-lg md:bg-transparent disabled:opacity-20 disabled:cursor-not-allowed"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-4 border-t border-white/5 text-ink">
               <div className="space-y-2 max-w-xs">
                <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block ml-1">Global Fulfillment Mode</label>
                <select 
                  name="inventory_status"
                  defaultValue={product?.inventoryStatus || 'in_stock'}
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-cream outline-none focus:border-accent/40 transition-colors appearance-none text-cream"
                >
                  <option value="in_stock" className="bg-ink text-cream">Normal Stock</option>
                  <option value="out_of_stock" className="bg-ink text-cream">Manual Sold Out</option>
                  <option value="prebook_only" className="bg-ink text-cream">Pre-order Pipeline</option>
                </select>
              </div>
            </div>
          </section>

          {/* Search Engine Optimization */}
          <section className="lux-surface p-8 space-y-8 bg-accent/[0.01]">
            {/* Same as before... */}
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Globe size={18} />
              </div>
              <div>
                <h2 className="text-sm font-bold uppercase tracking-widest text-cream leading-none">Search Optimization (SEO)</h2>
                <p className="text-[10px] text-cream/30 uppercase tracking-[0.2em] mt-1">Global visibility & indexing</p>
              </div>
            </div>

            <div className="grid gap-8">
               <div className="rounded-2xl border border-white/5 bg-ink/50 p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] text-cream/40 uppercase tracking-widest font-bold">Google Search Result Preview</p>
                    <Info size={14} className="text-cream/20" />
                  </div>
                  <div className="space-y-1 group cursor-default">
                    <p className="text-[#8ab4f8] text-lg font-medium group-hover:underline truncate max-w-full">
                      {seoTitle || (product?.name ? `${product.name} | 7 Sisters Tea` : 'Product Title | 7 Sisters Tea')}
                    </p>
                    <div className="flex items-center gap-1 text-[#bdc1c6] text-xs">
                      <span>7sisterstea.com</span>
                      <span>›</span>
                      <span>products</span>
                      <span>›</span>
                      <span className="text-cream/40 italic">{product?.slug || 'url-handle'}</span>
                    </div>
                    <p className="text-[#9aa0a6] text-[13px] line-clamp-2 mt-1 leading-relaxed">
                      {seoDescription || (product?.shortDescription || 'Crafted for the perfect daily brew. Experience the authentic flavor of pure Assam tea leaves, freshly packed and delivered to your doorstep.')}
                    </p>
                  </div>
               </div>

               <div className="grid gap-6">
                 <Input 
                   label="SEO Title Override"
                   name="seo_title"
                   defaultValue={seoTitle}
                   placeholder="Optimized name for Google Search"
                 />
                 <div className="space-y-2">
                    <div className="flex items-center justify-between ml-1 text-ink">
                      <label className="text-[10px] uppercase tracking-[0.3em] text-cream/40 font-semibold block">SEO Meta Description</label>
                      <span className="text-[9px] text-cream/20">{seoDescription.length}/160</span>
                    </div>
                    <textarea
                      name="seo_description"
                      defaultValue={seoDescription}
                      rows={3}
                      placeholder="Concise overview to appear in search results..."
                      className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm leading-relaxed text-cream outline-none focus:border-accent/40 transition-colors resize-none placeholder:text-cream/20"
                    />
                 </div>
                 <Input 
                   label="URL Handle (Slug)"
                   name="slug"
                   defaultValue={product?.slug || ''}
                   placeholder="e.g., assam-gold-ctc"
                 />
               </div>
            </div>
          </section>
        </div>

        {/* Sidebar Column */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Status & Visibility Card */}
          <div className="lux-surface p-6 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Settings2 size={16} />
              </div>
              <h2 className="text-[10px] font-bold uppercase tracking-widest text-cream">Visibility Control</h2>
            </div>

            <div className="space-y-4">
              <div 
                onClick={() => setIsActive(true)}
                className={cx(
                  "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                  isActive 
                    ? "bg-accent/10 border-accent/40 text-accent" 
                    : "bg-white/5 border-white/5 text-cream/40 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                   <Globe size={16} />
                   <span className="text-xs font-bold uppercase tracking-widest leading-none">Published</span>
                </div>
                {isActive && <CheckCircle2 size={16} />}
              </div>

              <div 
                onClick={() => setIsActive(false)}
                className={cx(
                  "flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all",
                  !isActive 
                    ? "bg-white/20 border-white/30 text-cream" 
                    : "bg-white/5 border-white/5 text-cream/40 hover:bg-white/10"
                )}
              >
                <div className="flex items-center gap-3">
                   <Trash2 size={16} />
                   <span className="text-xs font-bold uppercase tracking-widest leading-none">Draft Mode</span>
                </div>
                {!isActive && <CheckCircle2 size={16} />}
              </div>

              <p className="text-[10px] leading-relaxed text-cream/30 italic text-center px-4">
                Draft products are hidden from the storefront but remain editable in the admin dashboard.
              </p>
            </div>

            {state.ok && (
              <div className="flex items-center gap-3 text-green-400 bg-green-400/10 p-4 rounded-xl border border-green-400/20 animate-in zoom-in duration-300">
                <CheckCircle2 size={16} className="shrink-0" />
                <p className="text-[11px] font-bold uppercase tracking-widest">Catalog Synchronized</p>
              </div>
            )}

            {state.error && (
              <div className="flex items-center gap-3 text-accent bg-accent/10 p-4 rounded-xl border border-accent/20 animate-in shake duration-300">
                <AlertTriangle size={16} className="shrink-0" />
                <p className="text-[11px] font-bold">{state.error}</p>
              </div>
            )}
          </div>

          {/* Danger Zone */}
          {product?.id && (
            <AdminProductDangerZone productId={product.id} productName={product.name} />
          )}
        </div>
      </div>
      <ConfirmModal
        isOpen={!!variantToDelete}
        onClose={() => setVariantToDelete(null)}
        onConfirm={() => {
          if (variantToDelete) removeVariant(variantToDelete.id);
          setVariantToDelete(null);
        }}
        title="Remove Weight Option?"
        description={`Remove "${variantToDelete?.label}" from this product's pricing options? This will be permanently removed when you save the product.`}
        confirmLabel="Remove"
        cancelLabel="Keep It"
        variant="danger"
      />
    </form>
  );
}
