import { Category, Product } from './types';

export const categories: Category[] = [
  {
    slug: 'tea',
    name: 'Tea',
    description: 'Strong Assam CTC for the perfect daily chai.',
    image: {
      url: '/images/tea-hero.svg',
      alt: 'Assam tea cup illustration'
    }
  },
  {
    slug: 'spices',
    name: 'Spices',
    description: 'Essential blends and single spices with real aroma.',
    image: {
      url: '/images/spice-hero.svg',
      alt: 'Assam spice bowl illustration'
    }
  }
];

const teaVariants = [
  {
    id: 'ctc-100',
    sku: '7S-CTC-100G',
    weightLabel: '100g',
    weightGrams: 100,
    priceInr: 199,
    compareAtInr: 229,
    stockQty: 48
  },
  {
    id: 'ctc-200',
    sku: '7S-CTC-200G',
    weightLabel: '200g',
    weightGrams: 200,
    priceInr: 349,
    compareAtInr: 399,
    stockQty: 42
  },
  {
    id: 'ctc-1000',
    sku: '7S-CTC-1KG',
    weightLabel: '1kg',
    weightGrams: 1000,
    priceInr: 1499,
    compareAtInr: 1699,
    stockQty: 18
  }
];

const premiumLeafVariants = [
  {
    id: 'leaf-100',
    sku: '7S-LEAF-100G',
    weightLabel: '100g',
    weightGrams: 100,
    priceInr: 249,
    compareAtInr: 279,
    stockQty: 36
  },
  {
    id: 'leaf-200',
    sku: '7S-LEAF-200G',
    weightLabel: '200g',
    weightGrams: 200,
    priceInr: 449,
    compareAtInr: 499,
    stockQty: 28
  },
  {
    id: 'leaf-1000',
    sku: '7S-LEAF-1KG',
    weightLabel: '1kg',
    weightGrams: 1000,
    priceInr: 1699,
    compareAtInr: 1899,
    stockQty: 12
  }
];

const spiceVariants = (prefix: string, base100: number, base200: number, base1kg: number) => [
  {
    id: `${prefix}-100`,
    sku: `7S-${prefix.toUpperCase()}-100G`,
    weightLabel: '100g',
    weightGrams: 100,
    priceInr: base100,
    stockQty: 64
  },
  {
    id: `${prefix}-200`,
    sku: `7S-${prefix.toUpperCase()}-200G`,
    weightLabel: '200g',
    weightGrams: 200,
    priceInr: base200,
    stockQty: 48
  },
  {
    id: `${prefix}-1000`,
    sku: `7S-${prefix.toUpperCase()}-1KG`,
    weightLabel: '1kg',
    weightGrams: 1000,
    priceInr: base1kg,
    stockQty: 20
  }
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
    images: [
      {
        url: '/images/product-ctc.svg',
        alt: 'Assam Strong CTC Tea pack'
      }
    ],
    variants: teaVariants,
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
    images: [
      {
        url: '/images/product-ctc.svg',
        alt: 'Assam premium leaf tea pack'
      }
    ],
    variants: premiumLeafVariants,
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
    shortDescription: 'Golden, fragrant, and kitchen-ready.',
    description: 'Golden, fragrant turmeric that lifts everyday cooking with warm, earthy depth.',
    origin: 'Assam, India',
    tags: ['fresh', 'aromatic', 'premium', 'daily-use'],
    featuredRank: 2,
    images: [
      {
        url: '/images/product-turmeric.svg',
        alt: 'Assam turmeric powder pack'
      }
    ],
    variants: spiceVariants('tur', 89, 159, 599),
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
    images: [
      {
        url: '/images/product-chilli.svg',
        alt: 'Kashmiri chilli powder pack'
      }
    ],
    variants: spiceVariants('chi', 129, 229, 799),
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
    shortDescription: 'Warm, layered, and restaurant-worthy.',
    description: 'A warm, layered blend that brings restaurant-style depth to home kitchens.',
    origin: 'Assam-inspired blend',
    tags: ['premium', 'aromatic', 'blend', 'restaurant-tested'],
    featuredRank: 5,
    images: [
      {
        url: '/images/product-garam.svg',
        alt: 'Garam masala pack'
      }
    ],
    variants: spiceVariants('gar', 149, 269, 899),
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
    images: [
      {
        url: '/images/product-blend.svg',
        alt: 'Assam regional blend pack'
      }
    ],
    variants: spiceVariants('arb', 119, 219, 749),
    attributes: {
      highlightTitle: 'Freshness & Aroma',
      highlightBody: 'Homestyle spice balance from Assam, crafted for everyday cooking rituals.',
      bestFor: ['Sabzis', 'Dals', 'Light curries'],
      usageTips: ['Add mid-cook for balance', 'Finish for aroma', 'Keep airtight']
    }
  }
];
