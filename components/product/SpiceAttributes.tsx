import { Product } from '@/lib/products/types';

export default function SpiceAttributes({ product }: { product: Product }) {
  return (
    <div className="space-y-6 rounded-2xl bg-cream p-6 text-ink">
      <h3 className="text-2xl font-semibold">{product.attributes.highlightTitle}</h3>
      <p className="text-sm text-ink/70">{product.attributes.highlightBody}</p>
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Best For</p>
          <ul className="mt-2 text-sm text-ink/80">
            {product.attributes.bestFor?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-ink/60">Usage Notes</p>
          <ul className="mt-2 text-sm text-ink/80">
            {product.attributes.usageTips?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
