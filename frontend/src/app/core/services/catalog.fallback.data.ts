import {
  Brand,
  Category,
  PageResponse,
  ProductDetail,
  ProductFilter,
  ProductSummary
} from '../models/catalog.models';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Outerwear & Chamarras',
    slug: 'outerwear',
    description: 'Workwear Detroit, chamarras gráficas y piezas pesadas vintage.',
    imageUrl: '/assets/products/carhartt-detroit-jacket.jpg',
    displayOrder: 1
  },
  {
    id: 2,
    name: 'Hoodies & Zip-Ups',
    slug: 'hoodies',
    description: 'Full-zip archival, BAPE camo y streetwear pesado.',
    imageUrl: '/assets/products/bape-camo-shark-hoodie.jpg',
    displayOrder: 2
  },
  {
    id: 3,
    name: 'Denim Y2K & Baggy',
    slug: 'denim',
    description: 'Cortes anchos 2000s, bordados Ed Hardy y raw selvedge Southpole.',
    imageUrl: '/assets/products/ed-hardy-tiger-denim.jpg',
    displayOrder: 3
  },
  {
    id: 4,
    name: 'Gorras & Lentes',
    slug: 'accesorios',
    description: 'Trucker caps góticas Affliction y lentes de archivo Y2K.',
    imageUrl: '/assets/products/burberry-silver-frames.jpg',
    displayOrder: 4
  }
];

export const FALLBACK_BRANDS: Brand[] = [
  { id: 1, name: 'Carhartt', slug: 'carhartt', originCountry: 'USA', featured: true },
  { id: 2, name: 'A Bathing Ape', slug: 'bape', originCountry: 'Japan', featured: true },
  { id: 3, name: 'Southpole', slug: 'southpole', originCountry: 'USA', featured: true },
  { id: 4, name: 'Ed Hardy', slug: 'ed-hardy', originCountry: 'USA', featured: true },
  { id: 5, name: 'Affliction', slug: 'affliction', originCountry: 'USA', featured: true },
  { id: 6, name: 'Burberry', slug: 'burberry', originCountry: 'UK', featured: true }
];

export const FALLBACK_PRODUCTS: ProductDetail[] = [
  {
    id: 7,
    sku: 'DOCO-BUR-007',
    title: 'Burberry London Silver Rim Y2K Sunglasses',
    slug: 'burberry-london-silver-rim-y2k-sunglasses-doco-bur-007',
    description: 'Lentes solares Burberry armazón metálico plateado rectangular de archivo con caja original Luxottica y certificados.',
    priceMxn: 3890,
    compareAtPriceMxn: 4600,
    sizeLabel: 'OS',
    measurements: 'Frente 142mm · Puente 16mm · Varilla 140mm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'VAULT ARCHIVE',
    featured: true,
    category: FALLBACK_CATEGORIES[3],
    brand: FALLBACK_BRANDS[5],
    images: [
      {
        imageUrl: '/assets/products/burberry-silver-frames.jpg',
        altText: 'Burberry London Silver Rim Y2K Sunglasses',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 6,
    sku: 'DOCO-AFL-006',
    title: 'Affliction Live Fast Gothic Cross Trucker Cap',
    slug: 'affliction-live-fast-gothic-cross-trucker-cap-doco-afl-006',
    description: 'Gorra trucker Affliction nueva con etiqueta original, bordado gótico metálico con cruz central, cadenas grabadas y malla trasera.',
    priceMxn: 1190,
    compareAtPriceMxn: null,
    sizeLabel: 'OS',
    measurements: 'Ajustable Snapback · Corona media',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[3],
    brand: FALLBACK_BRANDS[4],
    images: [
      {
        imageUrl: '/assets/products/affliction-gothic-cap.jpg',
        altText: 'Affliction Live Fast Gothic Cross Trucker Cap',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 4,
    sku: 'DOCO-EDH-004',
    title: 'Ed Hardy Tiger Embroidered Baggy Jeans',
    slug: 'ed-hardy-tiger-embroidered-baggy-jeans-doco-edh-004',
    description: 'Denim vintage Ed Hardy con tigre bordado multicolor en bolsa trasera, botón metálico grabado y parche de piel autenticado.',
    priceMxn: 2390,
    compareAtPriceMxn: 2850,
    sizeLabel: '34x32',
    measurements: 'Cintura 44cm · Tiro 32cm · Apertura 24cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[3],
    images: [
      {
        imageUrl: '/assets/products/ed-hardy-tiger-denim.jpg',
        altText: 'Ed Hardy Tiger Embroidered Baggy Jeans',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 3,
    sku: 'DOCO-SP-003',
    title: 'Southpole Red Graphic Subway Trucker Jacket',
    slug: 'southpole-red-graphic-subway-trucker-jacket-doco-sp-003',
    description: 'Chamarra roja archival Southpole deadstock con etiqueta colgante original y gráfico ilustrado en espalda estilo metro NYC.',
    priceMxn: 2650,
    compareAtPriceMxn: null,
    sizeLabel: 'XL',
    measurements: 'Pecho 64cm · Largo 70cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      {
        imageUrl: '/assets/products/southpole-red-jacket.jpg',
        altText: 'Southpole Red Graphic Subway Trucker Jacket',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 2,
    sku: 'DOCO-BPE-002',
    title: 'A Bathing Ape 1st Camo Shark Full-Zip Hoodie',
    slug: 'a-bathing-ape-1st-camo-shark-full-zip-hoodie-doco-bpe-002',
    description: 'Sudadera BAPE Shark auténtica con etiquetas originales, camuflaje verde clásico, cierre completo hasta capucha y bordado WGM / dientes Shark impecables.',
    priceMxn: 6890,
    compareAtPriceMxn: 7900,
    sizeLabel: 'XXL',
    measurements: 'Pecho 66cm · Largo 74cm · Fit Oversized',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01 // GRAIL',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[1],
    images: [
      {
        imageUrl: '/assets/products/bape-camo-shark-hoodie.jpg',
        altText: 'A Bathing Ape 1st Camo Shark Full-Zip Hoodie',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 1,
    sku: 'DOCO-CRH-001',
    title: 'Carhartt Detroit Work Jacket Tan',
    slug: 'carhartt-detroit-work-jacket-tan-doco-crh-001',
    description: 'Chamarra Carhartt Detroit clásica en lona duck canvas beige deslavada con cuello en contraste gris carbón, cierre frontal latón y bolsillo pecho con etiqueta de cuero original.',
    priceMxn: 3490,
    compareAtPriceMxn: 4200,
    sizeLabel: 'L',
    measurements: 'Pecho 63cm · Largo 67cm · Manga 64cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'VINTAGE_8_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
        imageUrl: '/assets/products/carhartt-detroit-jacket.jpg',
        altText: 'Carhartt Detroit Work Jacket Tan',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 8,
    sku: 'DOCO-VAULT-008',
    title: 'DOCO Vault Curated Capsule Preview Lot',
    slug: 'doco-vault-curated-capsule-preview-lot-doco-vault-008',
    description: 'Selección curada del Primer Drop: Carhartt Detroit, Southpole Raw, NASCAR Racing Jacket y Tapout Y2K Zip disponibles por pieza o lote.',
    priceMxn: 2950,
    compareAtPriceMxn: null,
    sizeLabel: 'MIX',
    measurements: 'L / XL · Piezas únicas verificadas',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 2,
    dropTag: 'COMING SOON',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
        imageUrl: '/assets/products/drop-01-archival-bundle.jpg',
        altText: 'DOCO Vault Curated Capsule Preview Lot',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  },
  {
    id: 5,
    sku: 'DOCO-SP-005',
    title: 'Southpole Authentic Super Blue Raw Denim',
    slug: 'southpole-authentic-super-blue-raw-denim-doco-sp-005',
    description: 'Jeans Southpole Authentic Collection tono Super Blue sin uso (con cartón y código original de época), costura naranja contrastante.',
    priceMxn: 2190,
    compareAtPriceMxn: null,
    sizeLabel: '34x32',
    measurements: 'Cintura 43cm · Largo 108cm · Baggy Fit',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[2],
    images: [
      {
        imageUrl: '/assets/products/southpole-super-blue-denim.jpg',
        altText: 'Southpole Authentic Super Blue Raw Denim',
        sortOrder: 0,
        primaryImage: true
      }
    ]
  }
];

export function toProductSummary(detail: ProductDetail): ProductSummary {
  return {
    id: detail.id,
    sku: detail.sku,
    title: detail.title,
    slug: detail.slug,
    priceMxn: detail.priceMxn,
    compareAtPriceMxn: detail.compareAtPriceMxn,
    sizeLabel: detail.sizeLabel,
    styleEra: detail.styleEra,
    conditionGrade: detail.conditionGrade,
    stock: detail.stock,
    dropTag: detail.dropTag,
    featured: detail.featured,
    categoryName: detail.category.name,
    categorySlug: detail.category.slug,
    brandName: detail.brand.name,
    brandSlug: detail.brand.slug,
    primaryImageUrl: detail.images[0]?.imageUrl ?? null
  };
}

export function filterFallbackProducts(filter: ProductFilter = {}): PageResponse<ProductSummary> {
  let list = FALLBACK_PRODUCTS.map(toProductSummary);

  if (filter.category) {
    list = list.filter((p) => p.categorySlug.toLowerCase() === filter.category?.toLowerCase());
  }
  if (filter.brand) {
    list = list.filter((p) => p.brandSlug.toLowerCase() === filter.brand?.toLowerCase());
  }
  if (filter.era) {
    list = list.filter((p) => p.styleEra === filter.era);
  }
  if (filter.size) {
    list = list.filter((p) => p.sizeLabel.toLowerCase() === filter.size?.toLowerCase());
  }
  if (filter.inStockOnly) {
    list = list.filter((p) => p.stock > 0);
  }
  if (filter.featuredOnly) {
    list = list.filter((p) => p.featured);
  }
  if (filter.search && filter.search.trim()) {
    const q = filter.search.toLowerCase().trim();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brandName.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q)
    );
  }

  if (filter.sort === 'price_asc') {
    list = [...list].sort((a, b) => a.priceMxn - b.priceMxn);
  } else if (filter.sort === 'price_desc') {
    list = [...list].sort((a, b) => b.priceMxn - a.priceMxn);
  } else if (filter.sort === 'newest') {
    list = [...list].sort((a, b) => b.id - a.id);
  }

  const page = filter.page ?? 0;
  const pageSize = filter.pageSize ?? 12;
  const startIndex = page * pageSize;
  const pagedItems = list.slice(startIndex, startIndex + pageSize);
  const totalElements = list.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;

  return {
    items: pagedItems,
    page,
    size: pageSize,
    totalElements,
    totalPages,
    hasNext: startIndex + pageSize < totalElements
  };
}

export function getFallbackProductBySlug(slug: string): ProductDetail | undefined {
  const normalized = decodeURIComponent(slug).toLowerCase();
  return FALLBACK_PRODUCTS.find(
    (p) =>
      p.slug.toLowerCase() === normalized ||
      p.sku.toLowerCase() === normalized ||
      normalized.includes(p.sku.toLowerCase())
  );
}
