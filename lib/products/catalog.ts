import { Category, Product } from './types';

export const categories: Category[] = [
  {
    slug: 'tea',
    name: 'Tea',
    description: 'Robust Assam CTC crafted for your daily ritual.',
    image: {
      url: '/images/tea-hero.svg',
      alt: 'Assam tea cup illustration'
    }
  },
  {
    slug: 'spices',
    name: 'Spices',
    description: 'Essential single-origin spices and aromatic blends.',
    image: {
      url: '/images/spice-hero.svg',
      alt: 'Assam spice bowl illustration'
    }
  }
];

// RE-ENGINEERED: Simplified single-variant model to match Admin capability
// This ensures pricing consistency (e.g. ₹199 instead of ₹199 - ₹1,499)

const teaVariants = [
  {
    id: 'ctc-standard',
    productId: '7-sisters-premium-ctc',
    isActive: true,
    sort_order: 1,
    sku: '7S-CTC-STD',
    weightLabel: 'Standard Pack',
    weightGrams: 250,
    priceInr: 199,
    compareAtInr: 249,
    stockQty: 48
  }
];

const premiumLeafVariants = [
  {
    id: 'leaf-standard',
    productId: '7-sisters-premium-leaf',
    isActive: true,
    sort_order: 1,
    sku: '7S-LEAF-STD',
    weightLabel: 'Standard Pack',
    weightGrams: 250,
    priceInr: 249,
    compareAtInr: 299,
    stockQty: 36
  }
];

const spiceVariants = (prefix: string, basePrice: number, productId: string) => [
  {
    id: `${prefix}-standard`,
    productId,
    isActive: true,
    sort_order: 1,
    sku: `7S-${prefix.toUpperCase()}-STD`,
    weightLabel: 'Standard Pack',
    weightGrams: 200,
    priceInr: basePrice,
    stockQty: 50
  } as any
];

export const products: Product[] = [
  {
    id: 'assam-strong-ctc',
    slug: 'assam-strong-ctc',
    name: 'Assam Strong CTC Tea',
    category: 'tea',
    shortDescription: 'Bold, malty, and made for daily chai.',
    description:
      'A bold, malty Assam CTC crafted for everyday chai. Deep color, rich body, and a clean, satisfying finish.',
    origin: 'Barpeta Road, Assam',
    tags: ['strong', 'daily-use', 'premium', 'assam', 'malty'],
    featuredRank: 1,
    product_images: [
      {
        id: 'local-ctc-1',
        productId: 'assam-strong-ctc',
        image_url: '/images/product-ctc.svg',
        sort_order: 0,
        is_primary: true
      }
    ],
    variants: teaVariants as any,
    attributes: {
      highlightTitle: 'Strength & Aroma',
      highlightBody:
        'Bold Assam CTC with a deep malty aroma - crafted for a strong, satisfying daily chai.',
      tastingNotes: ['Malty', 'Brisk', 'Full-bodied'],
      bestFor: ['Milk tea', 'Morning chai', 'Large-batch brews'],
      usageTips: ['1 tsp per cup', '3-4 min brew', 'Add milk as desired']
    }
  },
  {
    id: 'assam-premium-leaf',
    slug: 'assam-premium-leaf',
    name: 'Assam Premium Leaf Tea',
    category: 'tea',
    shortDescription: 'Elegant whole-leaf Assam with a smooth finish.',
    description:
      'Premium whole-leaf Assam tea with a smooth, aromatic finish. Crafted for a lighter, refined cup with layered depth.',
    origin: 'Barpeta Road, Assam',
    tags: ['premium', 'assam', 'aromatic', 'daily-use'],
    featuredRank: 3,
    product_images: [
      {
        url: '/images/product-ctc.svg',
        alt: 'Assam premium leaf tea pack'
      }
    ] as any,
    variants: premiumLeafVariants as any,
    attributes: {
      highlightTitle: 'Aroma & Refinement',
      highlightBody: 'Whole-leaf Assam crafted for a smooth, aromatic daily cup.',
      tastingNotes: ['Floral', 'Smooth', 'Honeyed finish'],
      bestFor: ['Light chai', 'Afternoon tea', 'Clean brews'],
      usageTips: ['2 tsp per cup', '4-5 min brew', 'Enjoy without milk for clarity']
    }
  },
  {
    id: 'assam-turmeric',
    slug: 'turmeric-powder',
    name: 'Assam Turmeric Powder',
    category: 'spices',
    shortDescription: 'Golden, fragrant, and culinary grade.',
    description: 'Golden, fragrant turmeric that elevates everyday cooking with warm, earthy depth.',
    origin: 'Assam, India',
    tags: ['fresh', 'aromatic', 'premium', 'daily-use'],
    featuredRank: 2,
    product_images: [
      {
        url: '/images/product-turmeric.svg',
        alt: 'Assam turmeric powder pack'
      }
    ] as any,
    variants: spiceVariants('tur', 89, 'assam-turmeric'),
    attributes: {
      highlightTitle: 'Freshness & Aroma',
      highlightBody: 'Kitchen staples with vibrant aroma - blended for real cooking, not just shelf appeal.',
      bestFor: ['Curries', 'Dals', 'Marinades', 'Daily sabzis'],
      usageTips: ['Add early for depth', 'Finish for aroma', 'Seal tight after use']
    }
  },
  {
    id: 'kashmiri-chilli',
    slug: 'kashmiri-chilli',
    name: 'Kashmiri Chilli Powder',
    category: 'spices',
    shortDescription: 'Vibrant color with balanced heat.',
    description: 'Vibrant red color with balanced heat for gravies and marinades.',
    origin: 'North India',
    tags: ['balanced-heat', 'daily-use', 'premium', 'aromatic'],
    featuredRank: 4,
    product_images: [
      {
        url: '/images/product-chilli.svg',
        alt: 'Kashmiri chilli powder pack'
      }
    ] as any,
    variants: spiceVariants('chi', 129, 'kashmiri-chilli'),
    attributes: {
      highlightTitle: 'Freshness & Aroma',
      highlightBody: 'Balanced heat with vibrant color - ideal for everyday gravies and marinades.',
      bestFor: ['Curries', 'Tandoori marinades', 'Everyday tadka'],
      usageTips: ['Add early for color', 'Finish for aroma', 'Store in a cool, dry place']
    }
  },
  {
    id: 'garam-masala',
    slug: 'garam-masala',
    name: 'Garam Masala',
    category: 'spices',
    shortDescription: 'Warm, layered, and professional grade.',
    description: 'A warm, layered blend that brings professional-standard depth to home kitchens.',
    origin: 'Assamese-crafted blend',
    tags: ['premium', 'aromatic', 'blend', 'restaurant-tested'],
    featuredRank: 5,
    product_images: [
      {
        url: '/images/product-garam.svg',
        alt: 'Garam masala pack'
      }
    ] as any,
    variants: spiceVariants('gar', 149, 'garam-masala'),
    attributes: {
      highlightTitle: 'Freshness & Aroma',
      highlightBody: 'Warm, layered spices crafted for real kitchens and restaurant-level depth.',
      bestFor: ['Curries', 'Biryanis', 'Marinades'],
      usageTips: ['Add near the end', 'Seal tight after use', 'Store away from light']
    }
  },
  {
    id: 'assam-regional-blend',
    slug: 'assam-regional-blend',
    name: 'Assam Regional Blend',
    category: 'spices',
    shortDescription: 'Homestyle spice balance, straight from Assam.',
    description: 'A homestyle spice mix inspired by Assamese kitchens - balanced, warm, and versatile.',
    origin: 'Barpeta Road, Assam',
    tags: ['regional', 'authentic', 'daily-use', 'premium'],
    featuredRank: 6,
    product_images: [
      {
        url: '/images/product-blend.svg',
        alt: 'Assam regional blend pack'
      }
    ] as any,
    variants: spiceVariants('arb', 119, 'assam-regional-blend'),
    attributes: {
      highlightTitle: 'Freshness & Aroma',
      highlightBody: 'Homestyle spice balance from Assam, crafted for everyday cooking rituals.',
      bestFor: ['Sabzis', 'Dals', 'Light curries'],
      usageTips: ['Add mid-cook for balance', 'Finish for aroma', 'Keep airtight']
    }
  }
];
