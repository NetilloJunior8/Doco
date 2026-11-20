import os

script_dir = os.path.dirname(os.path.abspath(__file__))
target_file = os.path.join(script_dir, 'frontend', 'src', 'app', 'core', 'services', 'catalog.fallback.data.ts')

content = """import {
  Brand,
  Category,
  PageResponse,
  ProductDetail,
  ProductFilter,
  ProductSummary,
  StyleEra
} from '../models/catalog.models';

export const FALLBACK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Playeras Gráficas',
    slug: 'tees',
    description: 'Tees vintage, serigrafías Y2K y colaboraciones de archivo.',
    imageUrl: '/assets/archive/img_5487_2_cutout.webp',
    displayOrder: 1
  },
  {
    id: 2,
    name: 'Camisas & Garage',
    slug: 'camisas',
    description: 'Camisas mecánicas, bowling shirts y workwear button-up.',
    imageUrl: '/assets/archive/img_5862_cutout.webp',
    displayOrder: 2
  },
  {
    id: 3,
    name: 'Outerwear & Chamarras',
    slug: 'outerwear',
    description: 'Chamarras canvas, denim jackets y prendas pesadas de colección.',
    imageUrl: '/assets/archive/img_5870_cutout.webp',
    displayOrder: 3
  },
  {
    id: 4,
    name: 'Sudaderas & Crewnecks',
    slug: 'sudaderas',
    description: 'Crewnecks pesados y felpa vintage.',
    imageUrl: '/assets/archive/img_5902_cutout.webp',
    displayOrder: 4
  },
  {
    id: 5,
    name: 'Sin Mangas & Muscle',
    slug: 'muscle',
    description: 'Tanks y muscle tees de archivo.',
    imageUrl: '/assets/archive/img_5528_2_cutout.webp',
    displayOrder: 5
  },
  {
    id: 6,
    name: 'Pantalones & Denim',
    slug: 'pantalones',
    description: 'Denim carpintero, pantalones de trabajo y baggy vintage.',
    imageUrl: '/assets/archive/img_5913_cutout.webp',
    displayOrder: 6
  }
];

export const FALLBACK_BRANDS: Brand[] = [
  { id: 1, name: 'Ed Hardy', slug: 'ed-hardy', originCountry: 'US', featured: true },
  { id: 2, name: 'Christian Audigier', slug: 'christian-audigier', originCountry: 'US', featured: true },
  { id: 3, name: 'SAD BOYZ', slug: 'sad-boyz', originCountry: 'MX', featured: true },
  { id: 4, name: 'Diesel', slug: 'diesel', originCountry: 'IT', featured: true },
  { id: 5, name: 'Harley-Davidson', slug: 'harley-davidson', originCountry: 'US', featured: true },
  { id: 6, name: 'Southpole', slug: 'southpole', originCountry: 'US', featured: true },
  { id: 7, name: 'Nike', slug: 'nike', originCountry: 'US', featured: true },
  { id: 8, name: 'Misfits', slug: 'misfits', originCountry: 'US', featured: false },
  { id: 9, name: 'West Coast Choppers', slug: 'west-coast-choppers', originCountry: 'US', featured: true },
  { id: 10, name: 'Fox Racing', slug: 'fox-racing', originCountry: 'US', featured: false },
  { id: 11, name: 'Versace', slug: 'versace', originCountry: 'IT', featured: true }
];

export const FALLBACK_PRODUCTS: ProductDetail[] = [
  // ==========================================
  // PLAYERAS GRAFICAS (TS-001 a TS-019)
  // ==========================================
  {
    id: 1,
    sku: 'TS-001',
    title: 'Ed Hardy Archival Snake & Skull Tattoo Tee',
    slug: 'ed-hardy-archival-snake-and-skull-tattoo-tee-ts-001',
    description: 'Playera vintage de archivo Don Ed Hardy con estampado completo de serpiente y calavera, tipografia gotica en foil dorado y detalle en cuello.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 72cm · Hombro 50cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5487_2_cutout.webp', altText: 'Frente Ed Hardy Snake Skull', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5490_2_cutout.webp', altText: 'Espalda Ed Hardy Snake Skull', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 2,
    sku: 'TS-002',
    title: 'Ed Hardy Blue Panther & Japanese Koi Fish Tee',
    slug: 'ed-hardy-blue-panther-and-japanese-koi-fish-tee-ts-002',
    description: 'Playera negra Ed Hardy con pantera azul, peces koi tradicionales japoneses y letras goticas signature en la espalda.',
    priceMxn: 1400,
    compareAtPriceMxn: 1750,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 73cm · Hombro 51cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5495_2_cutout.webp', altText: 'Frente Ed Hardy Blue Panther', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5496_2_cutout.webp', altText: 'Espalda Ed Hardy Blue Panther Signature', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 3,
    sku: 'TS-003',
    title: 'Ed Hardy Pierced Hearts & Eagle Monogram Tee',
    slug: 'ed-hardy-pierced-hearts-and-eagle-monogram-tee-ts-003',
    description: 'Playera negra con aguila imperial, corazones atravesados por daga y gran monograma DEH en azul celeste en la espalda.',
    priceMxn: 1450,
    compareAtPriceMxn: 1800,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 74cm · Hombro 52cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5501_2_cutout.webp', altText: 'Frente Ed Hardy Pierced Hearts Eagle', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5504_2_cutout.webp', altText: 'Espalda Monograma DEH Celeste', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 4,
    sku: 'TS-004',
    title: 'Christian Audigier Crown & Sacred Heart Crystal Tee',
    slug: 'christian-audigier-crown-and-sacred-heart-crystal-tee-ts-004',
    description: 'Pieza de archivo de alta gama por Christian Audigier. Corona dorada con pedreria de cristal y escudo heraldico Los Angeles en la espalda.',
    priceMxn: 1600,
    compareAtPriceMxn: 2000,
    sizeLabel: 'M',
    measurements: 'Pecho 53cm · Largo 71cm · Hombro 48cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[1],
    images: [
      { imageUrl: '/assets/archive/img_5506_2_cutout.webp', altText: 'Frente Christian Audigier Crown Crystals', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5510_2_cutout.webp', altText: 'Espalda Christian Audigier Los Angeles', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 5,
    sku: 'TS-005',
    title: 'SAD BOYZ x Ed Hardy Virgen de Guadalupe & Cross Tee',
    slug: 'sad-boyz-x-ed-hardy-virgen-de-guadalupe-and-cross-tee-ts-005',
    description: 'Colaboracion exclusiva SAD BOYZ con serigrafia de la Virgen de Guadalupe, rosas rojas intensas y cruz iconica en la espalda.',
    priceMxn: 1550,
    compareAtPriceMxn: 1900,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 73cm · Hombro 50cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      { imageUrl: '/assets/archive/img_5513_2_cutout.webp', altText: 'Frente SAD BOYZ Virgen de Guadalupe', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5520_2_cutout.webp', altText: 'Espalda SAD BOYZ Cruz & Daga', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 6,
    sku: 'TS-006',
    title: 'Ed Hardy 2-in-1 Layered Tiger in Flames Long-Sleeve',
    slug: 'ed-hardy-2-in-1-layered-tiger-in-flames-long-sleeve-ts-006',
    description: 'Playera manga larga estilo 2-en-1 con tigre rugiendo en llamas serigrafiado al frente y mangas dobles sublimadas.',
    priceMxn: 1700,
    compareAtPriceMxn: 2100,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 74cm · Manga 65cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5521_2_cutout.webp', altText: 'Frente Ed Hardy Tiger Flames 2-in-1', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5527_2_cutout.webp', altText: 'Espalda Ed Hardy Tiger Flames', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5522_2_cutout.webp', altText: 'Detalle serigrafía tigre en fuego', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 7,
    sku: 'TS-007',
    title: 'Ed Hardy Live Fast Love Hard Red Skull Dagger Tee',
    slug: 'ed-hardy-live-fast-love-hard-red-skull-dagger-tee-ts-007',
    description: 'Playera negra con calavera roja atravesada por daga tattoo, lema Live Fast Love Hard y tipografia gotica al reverso.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'M',
    measurements: 'Pecho 54cm · Largo 72cm · Hombro 49cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5532_2_cutout.webp', altText: 'Frente Ed Hardy Live Fast Red Skull', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5535_2_cutout.webp', altText: 'Espalda Ed Hardy Live Fast Tipografia', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 8,
    sku: 'TS-008',
    title: 'Ed Hardy Red Roaring Panther Gold Script Tee',
    slug: 'ed-hardy-red-roaring-panther-gold-script-tee-ts-008',
    description: 'Playera negra con pantera roja furiosa en serigrafia texturizada y tipografia dorada Don Ed Hardy en espalda.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 73cm · Hombro 50cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5537_2_cutout.webp', altText: 'Frente Ed Hardy Red Roaring Panther', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5540_2_cutout.webp', altText: 'Espalda Ed Hardy Script Tipografia', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 9,
    sku: 'TS-009',
    title: 'Ed Hardy Double Skull & Coiled Snake Tee',
    slug: 'ed-hardy-double-skull-and-coiled-snake-tee-ts-009',
    description: 'Grafica doble calavera con serpiente enroscada, detalles en tonos ocre y tipografia signature al reverso.',
    priceMxn: 1400,
    compareAtPriceMxn: 1700,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 73cm · Hombro 51cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5541_2_cutout.webp', altText: 'Frente Ed Hardy Double Skull Snake', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5544_2_cutout.webp', altText: 'Espalda Ed Hardy Double Skull', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 10,
    sku: 'TS-010',
    title: 'Diesel For Successful Living Box Logo White Tee',
    slug: 'diesel-for-successful-living-box-logo-white-tee-ts-010',
    description: 'Playera blanca original Diesel For Successful Living con bordado fino en pecho y etiqueta de cuello de archivo.',
    priceMxn: 1200,
    compareAtPriceMxn: 1500,
    sizeLabel: 'M',
    measurements: 'Pecho 52cm · Largo 70cm · Hombro 47cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[3],
    images: [
      { imageUrl: '/assets/archive/img_5840_cutout.webp', altText: 'Frente Diesel Box Logo White Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5841_cutout.webp', altText: 'Detalle box logo rojo y etiqueta cuello', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 11,
    sku: 'TS-011',
    title: 'Diesel Red D Embroidered Minimalist White Tee',
    slug: 'diesel-red-d-embroidered-minimalist-white-tee-ts-011',
    description: 'Playera blanca algodon pesado Diesel con emblema D minimalista bordado en hilo rojo en el pecho.',
    priceMxn: 1150,
    compareAtPriceMxn: 1450,
    sizeLabel: 'L',
    measurements: 'Pecho 55cm · Largo 72cm · Hombro 49cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[3],
    images: [
      { imageUrl: '/assets/archive/img_5851_cutout.webp', altText: 'Frente Diesel Red D Embroidered White Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5852_cutout.webp', altText: 'Detalle logo D rojo bordado en pecho', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 12,
    sku: 'TS-012',
    title: 'Harley-Davidson Beartooth Cody Wyoming Biker Graphic Tee',
    slug: 'harley-davidson-beartooth-cody-wyoming-biker-graphic-tee-ts-012',
    description: 'Playera negra Harley-Davidson con arte vintage de concesionario Beartooth Harley-Davidson Cody, Wyoming.',
    priceMxn: 1300,
    compareAtPriceMxn: 1600,
    sizeLabel: 'XL',
    measurements: 'Pecho 62cm · Largo 76cm · Hombro 55cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5867_cutout.webp', altText: 'Frente Harley-Davidson Cody Wyoming Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5866_cutout.webp', altText: 'Espalda Beartooth H-D Dealer Graphic', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 13,
    sku: 'TS-013',
    title: 'Southpole Heavy Embroidered 1991 Archival Black Tee',
    slug: 'southpole-heavy-embroidered-1991-archival-black-tee-ts-013',
    description: 'Playera negra oversize Southpole de los 90s con bordado grueso en relieve SP 1991 y parche autentico.',
    priceMxn: 1250,
    compareAtPriceMxn: 1550,
    sizeLabel: 'XL',
    measurements: 'Pecho 64cm · Largo 78cm · Hombro 57cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[5],
    images: [
      { imageUrl: '/assets/archive/img_5876_cutout.webp', altText: 'Frente Southpole 1991 Heavy Embroidered Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5877_cutout.webp', altText: 'Espalda Southpole SP Archival Graphic', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 14,
    sku: 'TS-014',
    title: 'Misfits Punk Fiend Skull Black Graphic Tee',
    slug: 'misfits-punk-fiend-skull-black-graphic-tee-ts-014',
    description: 'Playera punk rock Misfits con el mitico Fiend Skull en serigrafia blanca contrastada sobre algodon negro premium.',
    priceMxn: 1200,
    compareAtPriceMxn: 1500,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 72cm · Hombro 50cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[7],
    images: [
      { imageUrl: '/assets/archive/img_5903_cutout.webp', altText: 'Frente Misfits Fiend Skull Graphic Tee', sortOrder: 0, primaryImage: true }
    ]
  },
  {
    id: 15,
    sku: 'TS-015',
    title: 'Ed Hardy Love Dies Hard Skull & Bones Black Tee',
    slug: 'ed-hardy-love-dies-hard-skull-and-bones-black-tee-ts-015',
    description: 'Playera negra con calavera tatuada cruzada por huesos, rosas rojas y lema Love Dies Hard al reverso.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'M',
    measurements: 'Pecho 53cm · Largo 71cm · Hombro 48cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5905_cutout.webp', altText: 'Frente Ed Hardy Love Dies Hard Skull', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5908_cutout.webp', altText: 'Espalda Ed Hardy Love Dies Hard Bones', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 16,
    sku: 'TS-016',
    title: 'SAD BOYZ x Ed Hardy Muerte Antes de Deshonor Eagle Tee',
    slug: 'sad-boyz-x-ed-hardy-muerte-antes-de-deshonor-eagle-tee-ts-016',
    description: 'Playera negra SAD BOYZ colaboracion con aguila de guerra y pergamino Muerte Antes de Deshonor en tipografia gotica.',
    priceMxn: 1500,
    compareAtPriceMxn: 1850,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 73cm · Hombro 51cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      { imageUrl: '/assets/archive/img_5909_cutout.webp', altText: 'Frente SAD BOYZ Eagle Muerte Antes de Deshonor', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5912_cutout.webp', altText: 'Espalda SAD BOYZ Eagle Graphic', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 17,
    sku: 'TS-017',
    title: 'West Coast Choppers Charcoal Iron Cross & Flames Tee',
    slug: 'west-coast-choppers-charcoal-iron-cross-and-flames-tee-ts-017',
    description: 'Playera gris carbon Jesse James WCC con Iron Cross en relieve frontal, fuego y motocicleta chopper en espalda.',
    priceMxn: 1400,
    compareAtPriceMxn: 1750,
    sizeLabel: 'XL',
    measurements: 'Pecho 61cm · Largo 76cm · Hombro 54cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5920_cutout.webp', altText: 'Frente West Coast Choppers Charcoal Iron Cross', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5925_cutout.webp', altText: 'Espalda Chopper Flames & Jesse James', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5923_cutout.webp', altText: 'Detalle serigrafía moto chopper', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 18,
    sku: 'TS-018',
    title: 'West Coast Choppers Black Archival Logo Biker Tee',
    slug: 'west-coast-choppers-black-archival-logo-biker-tee-ts-018',
    description: 'Playera negra WCC con emblema Iron Cross blanco serigrafiado al frente y logo clasico en la espalda.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 74cm · Hombro 52cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5926_cutout.webp', altText: 'Frente West Coast Choppers Archival Logo', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5928_cutout.webp', altText: 'Espalda West Coast Choppers Biker Logo', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 19,
    sku: 'TS-019',
    title: 'Harley-Davidson Yosemite Sam Feeling Lucky Looney Tunes White Tee',
    slug: 'harley-davidson-yosemite-sam-feeling-lucky-white-tee-ts-019',
    description: 'Playera blanca vintage oficial Harley-Davidson en colaboracion con Looney Tunes con Yosemite Sam pistolero y lema Feeling Lucky.',
    priceMxn: 1450,
    compareAtPriceMxn: 1800,
    sizeLabel: 'XL',
    measurements: 'Pecho 61cm · Largo 75cm · Hombro 53cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5858_cutout.webp', altText: 'Frente Harley-Davidson Yosemite Sam Feeling Lucky', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5860_cutout.webp', altText: 'Espalda Orange County Harley-Davidson Dealer', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5859_cutout.webp', altText: 'Detalle cuello y serigrafía Yosemite Sam', sortOrder: 2, primaryImage: false }
    ]
  },

  // ==========================================
  // SUDADERAS & CREWNECKS (S-001 a S-002)
  // ==========================================
  {
    id: 20,
    sku: 'S-001',
    title: 'Nike Vintage Red Classic Swoosh Crewneck Sweatshirt',
    slug: 'nike-vintage-red-classic-swoosh-crewneck-sweatshirt-s-001',
    description: 'Sudadera cuello redondo Nike felpa roja vintage con Swoosh clasico blanco bordado en pecho y acanalado en puños.',
    priceMxn: 1650,
    compareAtPriceMxn: 2000,
    sizeLabel: 'L',
    measurements: 'Pecho 62cm · Largo 72cm · Manga 63cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[3],
    brand: FALLBACK_BRANDS[6],
    images: [
      { imageUrl: '/assets/archive/img_5902_cutout.webp', altText: 'Frente Nike Vintage Red Swoosh Crewneck', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5901_cutout.webp', altText: 'Detalle Swoosh blanco y etiqueta Nike', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 21,
    sku: 'S-002',
    title: 'Gianni Versace Green Tropical Palm Embroidered Crewneck',
    slug: 'gianni-versace-green-tropical-palm-embroidered-crewneck-s-002',
    description: 'Crewneck de lujo Gianni Versace con patron botanico de palmeras tropicales en tonalidades esmeralda y firma bordada en relieve al frente.',
    priceMxn: 2800,
    compareAtPriceMxn: 3500,
    sizeLabel: 'M',
    measurements: 'Pecho 56cm · Largo 70cm · Hombro 50cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[3],
    brand: FALLBACK_BRANDS[10],
    images: [
      { imageUrl: '/assets/archive/img_5853_cutout.webp', altText: 'Frente Gianni Versace Green Tropical Crewneck', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5854_cutout.webp', altText: 'Detalle bordado firma y cuello Versace', sortOrder: 1, primaryImage: false }
    ]
  },

  // ==========================================
  // CAMISAS & GARAGE (SH-001 a SH-006)
  // ==========================================
  {
    id: 22,
    sku: 'SH-001',
    title: 'Fox Racing Gradient Stripe Tech Polo Shirt',
    slug: 'fox-racing-gradient-stripe-tech-polo-shirt-sh-001',
    description: 'Polo técnico Fox Racing con franjas degradadas deportivas, cuello estructurado y tejido respirable de alto rendimiento.',
    priceMxn: 1100,
    compareAtPriceMxn: 1400,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 74cm · Hombro 50cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[9],
    images: [
      { imageUrl: '/assets/archive/img_5843_cutout.webp', altText: 'Frente Fox Racing Gradient Stripe Polo', sortOrder: 0, primaryImage: true }
    ]
  },
  {
    id: 23,
    sku: 'SH-002',
    title: 'Harley-Davidson Technical Utility Long-Sleeve Shirt',
    slug: 'harley-davidson-technical-utility-long-sleeve-shirt-sh-002',
    description: 'Camisa utilitaria técnica manga larga Harley-Davidson con bolsillos de fuelle frontales, solapa ventilada y parches bordados.',
    priceMxn: 1750,
    compareAtPriceMxn: 2200,
    sizeLabel: 'XL',
    measurements: 'Pecho 64cm · Largo 78cm · Manga 65cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5846_cutout.webp', altText: 'Frente Harley-Davidson Technical Utility Shirt', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5847_cutout.webp', altText: 'Espalda ventilada Harley-Davidson Utility', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 24,
    sku: 'SH-003',
    title: 'Harley-Davidson Steel Blue Workwear Garage Shirt',
    slug: 'harley-davidson-steel-blue-workwear-garage-shirt-sh-003',
    description: 'Camisa mecanica original Harley-Davidson tono azul acero con botones grabados, bordado de taller y corte recto clásico.',
    priceMxn: 1650,
    compareAtPriceMxn: 2000,
    sizeLabel: 'L',
    measurements: 'Pecho 60cm · Largo 76cm · Hombro 52cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5855_cutout.webp', altText: 'Frente Harley-Davidson Steel Blue Garage Shirt', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5857_cutout.webp', altText: 'Espalda Harley-Davidson Steel Blue Garage', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 25,
    sku: 'SH-004',
    title: 'Harley-Davidson Rust Orange Skull Stripe Garage Button-Up',
    slug: 'harley-davidson-rust-orange-skull-stripe-garage-button-up-sh-004',
    description: 'Camisa de archivo Harley-Davidson en tono naranja óxido con franja negra al pecho, calavera Willie G y bordados retro.',
    priceMxn: 1700,
    compareAtPriceMxn: 2100,
    sizeLabel: 'L',
    measurements: 'Pecho 61cm · Largo 77cm · Hombro 53cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5862_cutout.webp', altText: 'Frente Harley-Davidson Rust Orange Garage Shirt', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5864_cutout.webp', altText: 'Espalda Willie G Skull & H-D Script', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 26,
    sku: 'SH-005',
    title: 'West Coast Choppers Long Beach CA Est. 1992 Mechanic Shirt',
    slug: 'west-coast-choppers-long-beach-mechanic-shirt-sh-005',
    description: 'Camisa mecanica negra West Coast Choppers con bordado plateado Long Beach CA Est. 1992 y cruz de malta en la espalda.',
    priceMxn: 1800,
    compareAtPriceMxn: 2300,
    sizeLabel: 'XL',
    measurements: 'Pecho 63cm · Largo 78cm · Hombro 55cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5913_cutout.webp', altText: 'Frente West Coast Choppers Mechanic Shirt', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5915_cutout.webp', altText: 'Espalda West Coast Choppers Long Beach CA', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 27,
    sku: 'SH-006',
    title: 'Jesse James Work Wear West Coast Choppers MC Club Garage Shirt',
    slug: 'jesse-james-work-wear-wcc-mc-club-garage-shirt-sh-006',
    description: 'Camisa pesada de trabajo Jesse James Work Wear con botones metalicos reforzados, parches de club y logo en espalda.',
    priceMxn: 1850,
    compareAtPriceMxn: 2400,
    sizeLabel: 'XL',
    measurements: 'Pecho 65cm · Largo 79cm · Hombro 56cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5937_cutout.webp', altText: 'Frente Jesse James Work Wear Garage Shirt', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5949_2_cutout.webp', altText: 'Espalda Jesse James MC Club Patch', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5939_cutout.webp', altText: 'Detalle etiqueta autenticidad WCC', sortOrder: 2, primaryImage: false }
    ]
  },

  // ==========================================
  // OUTERWEAR & CHAMARRAS (JK-001 a JK-002)
  // ==========================================
  {
    id: 28,
    sku: 'JK-001',
    title: 'Southpole Authentic Red Denim Trucker Subway Jacket',
    slug: 'southpole-authentic-red-denim-trucker-subway-jacket-jk-001',
    description: 'Chamarra de mezclilla gruesa Southpole en rojo vintage con remaches metalicos, corte boxy de los 90s y bordado SP en espalda.',
    priceMxn: 2400,
    compareAtPriceMxn: 3000,
    sizeLabel: 'XL',
    measurements: 'Pecho 66cm · Largo 74cm · Manga 64cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[5],
    images: [
      { imageUrl: '/assets/archive/img_5870_cutout.webp', altText: 'Frente Southpole Red Denim Trucker Jacket', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5874_cutout.webp', altText: 'Espalda Southpole Denim Trucker Subway', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 29,
    sku: 'JK-002',
    title: 'West Coast Choppers Motorcycle Co. Heavy Canvas Work Jacket',
    slug: 'west-coast-choppers-heavy-canvas-work-jacket-jk-002',
    description: 'Chamarra pesada de lona de algodon estilo carhartt por West Coast Choppers. Forro termico, cierres reforzados y bordados en pecho.',
    priceMxn: 2600,
    compareAtPriceMxn: 3200,
    sizeLabel: 'XL',
    measurements: 'Pecho 67cm · Largo 76cm · Manga 66cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5933_cutout.webp', altText: 'Frente West Coast Choppers Heavy Canvas Jacket', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5936_cutout.webp', altText: 'Espalda WCC Motorcycle Co Heavy Canvas', sortOrder: 1, primaryImage: false }
    ]
  },

  // ==========================================
  // SIN MANGAS & MUSCLE (TT-001)
  // ==========================================
  {
    id: 30,
    sku: 'TT-001',
    title: 'SAD BOYZ x Ed Hardy Dragon Roses Sleeveless Muscle Tee',
    slug: 'sad-boyz-x-ed-hardy-dragon-roses-sleeveless-muscle-tee-tt-001',
    description: 'Muscle tee sin mangas colaboracion SAD BOYZ x Don Ed Hardy con dragon oriental, rosas tattoo y letras goticas al reverso.',
    priceMxn: 1300,
    compareAtPriceMxn: 1600,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 73cm · Sisa 30cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[4],
    brand: FALLBACK_BRANDS[2],
    images: [
      { imageUrl: '/assets/archive/img_5528_2_cutout.webp', altText: 'Frente SAD BOYZ Dragon Roses Muscle Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5531_2_cutout.webp', altText: 'Espalda SAD BOYZ Dragon Roses Tipografia', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5529_2_cutout.webp', altText: 'Detalle serigrafía dragon y rosas', sortOrder: 2, primaryImage: false }
    ]
  }
];

export function toProductSummary(p: ProductDetail): ProductSummary {
  const primaryImg = p.images.find((i) => i.primaryImage) || p.images[0];
  const secondaryImg = p.images.length > 1 ? p.images[1] : undefined;

  return {
    id: p.id,
    sku: p.sku,
    title: p.title,
    slug: p.slug,
    priceMxn: p.priceMxn,
    compareAtPriceMxn: p.compareAtPriceMxn,
    sizeLabel: p.sizeLabel,
    styleEra: p.styleEra,
    conditionGrade: p.conditionGrade,
    stock: p.stock,
    dropTag: p.dropTag,
    featured: p.featured,
    categoryName: p.category.name,
    categorySlug: p.category.slug,
    brandName: p.brand.name,
    brandSlug: p.brand.slug,
    primaryImageUrl: primaryImg ? primaryImg.imageUrl : '',
    secondaryImageUrl: secondaryImg ? secondaryImg.imageUrl : undefined,
    imagesCount: p.images.length
  };
}

export function getFallbackProductBySlug(slug: string): ProductDetail | undefined {
  const q = slug.toLowerCase().trim();
  return FALLBACK_PRODUCTS.find((p) => p.slug === q || p.sku.toLowerCase() === q);
}

export function filterFallbackProducts(filter: ProductFilter = {}): PageResponse<ProductSummary> {
  let filtered = [...FALLBACK_PRODUCTS];

  if (filter.category) {
    const cat = filter.category.toLowerCase().trim();
    filtered = filtered.filter((p) => p.category.slug === cat || p.category.name.toLowerCase() === cat);
  }

  if (filter.brand) {
    const br = filter.brand.toLowerCase().trim();
    filtered = filtered.filter((p) => p.brand.slug === br || p.brand.name.toLowerCase() === br);
  }

  if (filter.era) {
    filtered = filtered.filter((p) => p.styleEra === filter.era);
  }

  if (filter.size) {
    filtered = filtered.filter((p) => p.sizeLabel.toUpperCase() === filter.size?.toUpperCase());
  }

  if (filter.search) {
    const q = filter.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.brand.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  if (filter.featuredOnly) {
    filtered = filtered.filter((p) => p.featured);
  }

  if (filter.inStockOnly) {
    filtered = filtered.filter((p) => p.stock > 0);
  }

  const page = typeof filter.page === 'number' && filter.page >= 0 ? filter.page : 0;
  const size = typeof filter.pageSize === 'number' && filter.pageSize > 0 ? filter.pageSize : 48;
  const totalElements = filtered.length;
  const totalPages = Math.ceil(totalElements / size) || 1;

  const start = page * size;
  const paged = filtered.slice(start, start + size);
  const items = paged.map(toProductSummary);

  return {
    items,
    page,
    size,
    totalElements,
    totalPages,
    hasNext: page < totalPages - 1
  };
}
"""

with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f'Pristine catalog written to {target_file}')
