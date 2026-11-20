import os

content = '''import {
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
  // PLAYERAS GRÁFICAS (TS-001 a TS-019)
  // ==========================================
  {
    id: 1,
    sku: 'TS-001',
    title: 'Ed Hardy Archival Snake & Skull Tattoo Tee',
    slug: 'ed-hardy-archival-snake-and-skull-tattoo-tee-ts-001',
    description: 'Playera vintage de archivo Don Ed Hardy con estampado completo de serpiente y calavera, tipografía gótica en foil dorado y detalle en cuello.',
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
      { imageUrl: '/assets/archive/img_5488_2_cutout.webp', altText: 'Detalle serigrafía y cuello Ed Hardy', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5489_2_cutout.webp', altText: 'Detalle foil dorado en gráficos', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5490_2_cutout.webp', altText: 'Detalle textura de algodón y costuras', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 2,
    sku: 'TS-002',
    title: 'Ed Hardy Blue Panther & Japanese Koi Fish Tee',
    slug: 'ed-hardy-blue-panther-and-japanese-koi-fish-tee-ts-002',
    description: 'Playera Don Ed Hardy azul medianoche con pantera rugiente estilo tradicional americano y carpa koi con olas en la parte trasera.',
    priceMxn: 1400,
    compareAtPriceMxn: 1700,
    sizeLabel: 'XL',
    measurements: 'Pecho 60cm · Largo 75cm · Hombro 52cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5495_2_cutout.webp', altText: 'Frente Ed Hardy Blue Panther', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5498_2_cutout.webp', altText: 'Espalda Carpa Koi Japonesa', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5496_2_cutout.webp', altText: 'Detalle pantera tradicional', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5497_2_cutout.webp', altText: 'Detalle caligrafía Don Ed Hardy', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 3,
    sku: 'TS-003',
    title: 'Ed Hardy Skull & Blood Red Roses Black Tee',
    slug: 'ed-hardy-skull-and-blood-red-roses-black-tee-ts-003',
    description: 'Playera negra de corte regular con gran calavera central y rosas rojas con espinas en técnica tattoo clásica de Don Ed Hardy.',
    priceMxn: 1300,
    compareAtPriceMxn: 1550,
    sizeLabel: 'L',
    measurements: 'Pecho 55cm · Largo 71cm · Hombro 49cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5501_2_cutout.webp', altText: 'Frente Ed Hardy Skull Roses', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5504_2_cutout.webp', altText: 'Espalda Ed Hardy caligrafía', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5502_2_cutout.webp', altText: 'Detalle calavera y rosas', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5503_2_cutout.webp', altText: 'Detalle etiqueta original Ed Hardy', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 4,
    sku: 'TS-004',
    title: 'Christian Audigier Crown & Sacred Heart Crystal Tee',
    slug: 'christian-audigier-crown-sacred-heart-crystal-tee-ts-004',
    description: 'Playera Christian Audigier Los Angeles original con corona imperial dorada y sagrado corazón en pedrería fina con monograma CA en espalda.',
    priceMxn: 1450,
    compareAtPriceMxn: 1750,
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
      { imageUrl: '/assets/archive/img_5506_2_cutout.webp', altText: 'Frente Christian Audigier Crown Heart', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5510_2_cutout.webp', altText: 'Espalda Christian Audigier Los Angeles', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5507_2_cutout.webp', altText: 'Detalle etiqueta Christian Audigier LA', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5508_2_cutout.webp', altText: 'Detalle pedrería fina y dorados', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 5,
    sku: 'TS-005',
    title: 'SAD BOYZ x Ed Hardy Virgen de Guadalupe & Cross Tee',
    slug: 'sad-boyz-x-ed-hardy-virgen-de-guadalupe-and-cross-tee-ts-005',
    description: 'Colaboración oficial SAD BOYZ Junior H x Don Ed Hardy. Iconografía clásica de la Virgen de Guadalupe en pecho con resplandor dorado y cruz gótica en espalda.',
    priceMxn: 1550,
    compareAtPriceMxn: 1900,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 74cm · Hombro 51cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      { imageUrl: '/assets/archive/img_5513_2_cutout.webp', altText: 'Frente Virgen de Guadalupe Sad Boyz', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5520_2_cutout.webp', altText: 'Espalda Cruz Gótica Sad Boyz', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5514_2_cutout.webp', altText: 'Detalle etiqueta original Sad Boyz x Ed Hardy', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5515_2_cutout.webp', altText: 'Detalle impresión Virgen y halo resplandor', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 6,
    sku: 'TS-006',
    title: 'Ed Hardy 2-in-1 Layered Tiger in Flames Long-Sleeve',
    slug: 'ed-hardy-layered-tiger-flames-long-sleeve-ts-006',
    description: 'Prenda 2-en-1 con mangas térmicas estilo waffle estampadas con calaveras y tigre central en serigrafía pesada estilo tatuaje tradicional japonés.',
    priceMxn: 1650,
    compareAtPriceMxn: 2000,
    sizeLabel: 'XL',
    measurements: 'Pecho 61cm · Largo 76cm · Hombro 53cm · Manga 65cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5521_2_cutout.webp', altText: 'Frente Ed Hardy Layered Tiger', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5527_2_cutout.webp', altText: 'Espalda Don Ed Hardy Designs', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5522_2_cutout.webp', altText: 'Detalle mangas térmicas waffle con calavera', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5524_2_cutout.webp', altText: 'Detalle etiqueta original Ed Hardy', sortOrder: 3, primaryImage: false },
      { imageUrl: '/assets/archive/img_5525_2_cutout.webp', altText: 'Detalle gráfico tigre y ojo en llamas', sortOrder: 4, primaryImage: false }
    ]
  },
  {
    id: 7,
    sku: 'TS-007',
    title: 'Ed Hardy Live Fast Love Hard Red Skull Dagger Tee',
    slug: 'ed-hardy-live-fast-love-hard-red-skull-dagger-tee-ts-007',
    description: 'Playera roja de algodón peinado con calavera de ojos encendidos, daga con corazón perforado y pergamino Live Fast Love Hard en tipografía dorada.',
    priceMxn: 1320,
    compareAtPriceMxn: 1600,
    sizeLabel: 'M',
    measurements: 'Pecho 53cm · Largo 71cm · Hombro 48cm',
    styleEra: 'Y2K',
    conditionGrade: 'VINTAGE_8_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5532_2_cutout.webp', altText: 'Frente Ed Hardy Red Skull Dagger', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5535_2_cutout.webp', altText: 'Espalda Ed Hardy rojo', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5533_2_cutout.webp', altText: 'Detalle daga y calavera', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5534_2_cutout.webp', altText: 'Detalle etiqueta original Ed Hardy', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 8,
    sku: 'TS-008',
    title: 'Ed Hardy Red Roaring Panther Gold Script Tee',
    slug: 'ed-hardy-red-roaring-panther-gold-script-tee-ts-008',
    description: 'Playera roja con pantera rugiente estilo old-school tattoo con garras extendidas y caligrafía Don Ed Hardy en foil dorado brillante.',
    priceMxn: 1320,
    compareAtPriceMxn: 1580,
    sizeLabel: 'M',
    measurements: 'Pecho 52cm · Largo 70cm · Hombro 47cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5537_2_cutout.webp', altText: 'Frente Ed Hardy Red Panther', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5540_2_cutout.webp', altText: 'Espalda Ed Hardy', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5538_2_cutout.webp', altText: 'Detalle pantera rugiendo', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5539_2_cutout.webp', altText: 'Detalle etiqueta Ed Hardy M', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 9,
    sku: 'TS-009',
    title: 'Ed Hardy Double Skull & Coiled Snake Tee',
    slug: 'ed-hardy-double-skull-and-coiled-snake-tee-ts-009',
    description: 'Playera verde militar de archivo con doble calavera y serpiente cascabel enrollada con detalles en tinta metálica y tipografía gótica en espalda.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 73cm · Hombro 50cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5541_2_cutout.webp', altText: 'Frente Ed Hardy Double Skull Snake', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5544_2_cutout.webp', altText: 'Espalda Ed Hardy', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5542_2_cutout.webp', altText: 'Detalle calaveras y serpiente', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5543_2_cutout.webp', altText: 'Detalle etiqueta de cartón Ed Hardy', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 10,
    sku: 'TS-010',
    title: 'Diesel For Successful Living Box Logo White Tee',
    slug: 'diesel-for-successful-living-box-logo-white-tee-ts-010',
    description: 'Playera blanca de algodón suave con el icónico logo rojo Diesel for Successful Living en serigrafía limpia al centro del pecho.',
    priceMxn: 1190,
    compareAtPriceMxn: 1450,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 72cm · Hombro 51cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[3],
    images: [
      { imageUrl: '/assets/archive/img_5840_cutout.webp', altText: 'Frente Diesel Box Logo White', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5841_cutout.webp', altText: 'Detalle box logo rojo y etiqueta cuello', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 11,
    sku: 'TS-011',
    title: 'Diesel Red D Embroidered Minimalist White Tee',
    slug: 'diesel-red-d-embroidered-minimalist-white-tee-ts-011',
    description: 'Playera Diesel premium en algodón blanco con el nuevo logo D bordado en hilo rojo y tipografía Diesel en negro al centro del pecho.',
    priceMxn: 1250,
    compareAtPriceMxn: 1500,
    sizeLabel: 'M',
    measurements: 'Pecho 54cm · Largo 71cm · Hombro 49cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[3],
    images: [
      { imageUrl: '/assets/archive/img_5851_cutout.webp', altText: 'Frente Diesel Red D White Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5852_cutout.webp', altText: 'Detalle logo D rojo bordado en pecho', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 12,
    sku: 'TS-012',
    title: 'Gianni Versace Green Tropical Palm Embroidered Tee',
    slug: 'gianni-versace-green-tropical-palm-embroidered-tee-ts-012',
    description: 'Playera de lujo Gianni Versace en algodón premium con estampado botánico de palmas tropicales verdes, firma Gianni Versace bordada en relieve 3D sobre el pecho y cuello acanalado con etiqueta Versace Taylor Fit.',
    priceMxn: 2450,
    compareAtPriceMxn: 2950,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 73cm · Hombro 50cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[10],
    images: [
      { imageUrl: '/assets/archive/img_5854_cutout.webp', altText: 'Frente Versace Green Tropical Palm Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5853_cutout.webp', altText: 'Detalle cuello y etiqueta Versace Taylor Fit', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 13,
    sku: 'TS-013',
    title: 'Harley-Davidson Beartooth Cody Wyoming Biker Graphic Tee',
    slug: 'harley-davidson-beartooth-cody-wyoming-biker-graphic-tee-ts-013',
    description: 'Playera café chocolate con bolsillo frontal y gran serigrafía trasera Beartooth Harley-Davidson Cody, Wyoming con motociclista en clásica chopper y concesionario histórico.',
    priceMxn: 1250,
    compareAtPriceMxn: 1500,
    sizeLabel: 'XL',
    measurements: 'Pecho 62cm · Largo 75cm · Hombro 54cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'VINTAGE_8_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5867_cutout.webp', altText: 'Frente Harley-Davidson Pocket Tee Cody Wyoming', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5866_cutout.webp', altText: 'Espalda Beartooth Harley-Davidson Cody Wyoming', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5868_cutout.webp', altText: 'Detalle bolsillo con logo Harley-Davidson', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 14,
    sku: 'TS-014',
    title: 'Southpole Heavy Embroidered 1991 Archival Black Tee',
    slug: 'southpole-heavy-embroidered-1991-archival-black-tee-ts-014',
    description: 'Playera negra de corte boxy 90s con enorme bordado en bloque SOUTHPOLE en letras acolchadas blancas con contorno y parche Est. 1991 en el dobladillo.',
    priceMxn: 1150,
    compareAtPriceMxn: 1400,
    sizeLabel: 'M',
    measurements: 'Pecho 58cm · Largo 72cm · Hombro 52cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[5],
    images: [
      { imageUrl: '/assets/archive/img_5876_cutout.webp', altText: 'Frente Southpole Embroidered Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5877_cutout.webp', altText: 'Detalle bordado bloque Southpole y cuello', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5878_cutout.webp', altText: 'Detalle parche tejido Southpole Est. 1991', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 15,
    sku: 'TS-015',
    title: 'Misfits Punk Fiend Skull Black Graphic Tee',
    slug: 'misfits-punk-fiend-skull-black-graphic-tee-ts-015',
    description: 'Playera Misfits oficial con el icónico Fiend Skull en serigrafía desgastada, detalles en tonos flúor y etiqueta original Misfits en cuello.',
    priceMxn: 1250,
    compareAtPriceMxn: 1500,
    sizeLabel: 'S/M',
    measurements: 'Pecho 48cm · Largo 67cm · Hombro 44cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[7],
    images: [
      { imageUrl: '/assets/archive/img_5903_cutout.webp', altText: 'Frente Misfits Fiend Skull Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5904_cutout.webp', altText: 'Detalle serigrafía Fiend Skull y etiqueta oficial Misfits', sortOrder: 1, primaryImage: false }
    ]
  },
  {
    id: 16,
    sku: 'TS-016',
    title: 'Ed Hardy Love Dies Hard Skull & Bones Black Tee',
    slug: 'ed-hardy-love-dies-hard-skull-and-bones-black-tee-ts-016',
    description: 'Playera negra con calavera con corona de espinas, huesos cruzados y lema Love Dies Hard en tipografía tatuaje clásica con espalda decorada.',
    priceMxn: 1300,
    compareAtPriceMxn: 1600,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 72cm · Hombro 50cm',
    styleEra: 'Y2K',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      { imageUrl: '/assets/archive/img_5905_cutout.webp', altText: 'Frente Ed Hardy Love Dies Hard', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5908_cutout.webp', altText: 'Espalda Don Ed Hardy Designs', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5906_cutout.webp', altText: 'Detalle etiqueta cuello Ed Hardy L', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 17,
    sku: 'TS-017',
    title: 'SAD BOYZ x Ed Hardy Muerte Antes de Deshonor Eagle Tee',
    slug: 'sad-boyz-x-ed-hardy-muerte-antes-de-deshonor-eagle-tee-ts-017',
    description: 'Playera de la colaboración SAD BOYZ x Don Ed Hardy con imponente águila calva americana con serpiente y pergamino Muerte Antes de Deshonor.',
    priceMxn: 1550,
    compareAtPriceMxn: 1850,
    sizeLabel: 'XL',
    measurements: 'Pecho 61cm · Largo 75cm · Hombro 53cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      { imageUrl: '/assets/archive/img_5909_cutout.webp', altText: 'Frente Sad Boyz Águila Muerte Antes de Deshonor', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5912_cutout.webp', altText: 'Espalda Sad Boyz', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5910_cutout.webp', altText: 'Detalle serigrafía águila y pergamino', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 18,
    sku: 'TS-018',
    title: 'West Coast Choppers Charcoal Iron Cross & Flames Tee',
    slug: 'west-coast-choppers-charcoal-iron-cross-and-flames-tee-ts-018',
    description: 'Playera gris grafito vintage West Coast Choppers con Cruz de Hierro blanca en el pecho y motocicleta chopper custom envuelta en llamas en la espalda.',
    priceMxn: 1390,
    compareAtPriceMxn: 1700,
    sizeLabel: 'XL',
    measurements: 'Pecho 63cm · Largo 76cm · Hombro 54cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5920_cutout.webp', altText: 'Frente West Coast Choppers Iron Cross Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5925_cutout.webp', altText: 'Espalda completa Chopper naranja y flamas', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5922_cutout.webp', altText: 'Detalle logo Iron Cross blanco pecho', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5923_cutout.webp', altText: 'Detalle etiqueta original WCC cuello', sortOrder: 3, primaryImage: false },
      { imageUrl: '/assets/archive/img_5924_cutout.webp', altText: 'Detalle moto chopper y fuego', sortOrder: 4, primaryImage: false }
    ]
  },
  {
    id: 19,
    sku: 'TS-019',
    title: 'West Coast Choppers Black Archival Logo Biker Tee',
    slug: 'west-coast-choppers-black-archival-logo-biker-tee-ts-019',
    description: 'Playera negra original West Coast Choppers de archivo con logo en bloque en pecho, remates de alta resistencia y gran estampa trasera WCC Est. 1992.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 73cm · Hombro 51cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5926_cutout.webp', altText: 'Frente West Coast Choppers Black Logo Tee', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5928_cutout.webp', altText: 'Espalda WCC Est. 1992', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5927_cutout.webp', altText: 'Detalle serigrafía y algodón grueso', sortOrder: 2, primaryImage: false }
    ]
  },

  // ==========================================
  // SUDADERAS & CREWNECKS (S-001)
  // ==========================================
  {
    id: 20,
    sku: 'S-001',
    title: 'Nike Vintage Red Classic Swoosh Crewneck Sweatshirt',
    slug: 'nike-vintage-red-classic-swoosh-crewneck-sweatshirt-s-001',
    description: 'Sudadera roja de cuello redondo Nike vintage en felpa de algodón pesado con clásico Swoosh bordado en hilo blanco sobre el pecho izquierdo.',
    priceMxn: 1690,
    compareAtPriceMxn: 2100,
    sizeLabel: 'L',
    measurements: 'Pecho 59cm · Largo 70cm · Hombro 52cm · Manga 63cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[3],
    brand: FALLBACK_BRANDS[6],
    images: [
      { imageUrl: '/assets/archive/img_5902_cutout.webp', altText: 'Frente Sudadera Nike Roja', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5901_cutout.webp', altText: 'Detalle Swoosh blanco y etiqueta Nike', sortOrder: 1, primaryImage: false }
    ]
  },

  // ==========================================
  // CAMISAS & GARAGE (SH-001 a SH-007)
  // ==========================================
  {
    id: 21,
    sku: 'SH-001',
    title: 'Fox Racing Gradient Stripe Tech Polo Shirt',
    slug: 'fox-racing-gradient-stripe-tech-polo-shirt-sh-001',
    description: 'Polo técnico Fox Racing original en tejido transpirable con degradado de franjas horizontales, logo de la cabeza de zorro bordado en cuello y botones grabados.',
    priceMxn: 1250,
    compareAtPriceMxn: 1500,
    sizeLabel: 'M',
    measurements: 'Pecho 54cm · Largo 72cm · Hombro 48cm',
    styleEra: 'ARCHIVE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[9],
    images: [
      { imageUrl: '/assets/archive/img_5843_cutout.webp', altText: 'Frente Polo Técnico Fox Racing', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5844_cutout.webp', altText: 'Detalle tejido técnico y texto Fox Racing Inc', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5845_cutout.webp', altText: 'Detalle cuello bordado Fox y botones', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 22,
    sku: 'SH-002',
    title: 'Harley-Davidson Technical Utility Long-Sleeve Shirt',
    slug: 'harley-davidson-technical-utility-long-sleeve-shirt-sh-002',
    description: 'Camisa técnica de trabajo Harley-Davidson Motor Clothes en ripstop ligero gris con bolsillos utilitarios con solapa, velcro y espalda con panel de ventilación.',
    priceMxn: 1550,
    compareAtPriceMxn: 1900,
    sizeLabel: 'L',
    measurements: 'Pecho 60cm · Largo 76cm · Hombro 52cm · Manga 64cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5846_cutout.webp', altText: 'Frente Camisa Técnica Harley Gris', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5849_cutout.webp', altText: 'Espalda ventilada Harley-Davidson', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5847_cutout.webp', altText: 'Detalle cuello y etiqueta H-D Performance', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5848_cutout.webp', altText: 'Detalle bolsillo utilitario y parche H-D', sortOrder: 3, primaryImage: false }
    ]
  },
  {
    id: 23,
    sku: 'SH-003',
    title: 'Harley-Davidson Steel Blue Workwear Garage Shirt',
    slug: 'harley-davidson-steel-blue-workwear-garage-shirt-sh-003',
    description: 'Camisa mecánica de garaje Harley-Davidson en popelina de poliéster/algodón azul acero con bordado Bar & Shield en pecho, remaches metálicos y espalda con bordado oficial.',
    priceMxn: 1490,
    compareAtPriceMxn: 1800,
    sizeLabel: 'XL',
    measurements: 'Pecho 64cm · Largo 77cm · Hombro 55cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5855_cutout.webp', altText: 'Frente Camisa Harley Azul Acero', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5857_cutout.webp', altText: 'Espalda Harley-Davidson', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5856_cutout.webp', altText: 'Detalle bordado pecho y cuello', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 24,
    sku: 'SH-004',
    title: 'Harley-Davidson Stone Grey Workwear Garage Shirt',
    slug: 'harley-davidson-stone-grey-workwear-garage-shirt-sh-004',
    description: 'Camisa mecánica de trabajo Harley-Davidson en tono gris piedra claro con bordado Bar & Shield con tipografía Harley-Davidson en espalda y parches tejidos en manga.',
    priceMxn: 1490,
    compareAtPriceMxn: 1800,
    sizeLabel: 'L',
    measurements: 'Pecho 59cm · Largo 75cm · Hombro 51cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5858_cutout.webp', altText: 'Frente Camisa Harley Gris Piedra', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5859_cutout.webp', altText: 'Espalda Harley-Davidson Gris Piedra', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5860_cutout.webp', altText: 'Detalle parche Bar and Shield', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 25,
    sku: 'SH-005',
    title: 'Harley-Davidson Rust Orange Skull Stripe Garage Button-Up',
    slug: 'harley-davidson-rust-orange-skull-stripe-garage-button-up-sh-005',
    description: 'Camisa mecánica estilo bowling en dos tonos naranja óxido y negro con bordado grande en espalda de calavera Harley-Davidson Motor Cycles.',
    priceMxn: 1650,
    compareAtPriceMxn: 2000,
    sizeLabel: 'L',
    measurements: 'Pecho 59cm · Largo 74cm · Hombro 50cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      { imageUrl: '/assets/archive/img_5862_cutout.webp', altText: 'Frente Camisa Naranja Harley Skull', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5864_cutout.webp', altText: 'Espalda Harley-Davidson calavera y laureles', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5863_cutout.webp', altText: 'Detalle franja Willie G Skull y bordado', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 26,
    sku: 'SH-006',
    title: 'West Coast Choppers Long Beach CA Est. 1992 Mechanic Shirt',
    slug: 'west-coast-choppers-long-beach-ca-mechanic-shirt-sh-006',
    description: 'Camisa de mecánico oficial West Coast Choppers Jesse James en sarga pesada negra con botones de presión y gran Cruz de Hierro bordada en espalda.',
    priceMxn: 1750,
    compareAtPriceMxn: 2150,
    sizeLabel: 'XL',
    measurements: 'Pecho 63cm · Largo 77cm · Hombro 54cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5913_cutout.webp', altText: 'Frente Camisa Mecánica WCC Negra', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5915_cutout.webp', altText: 'Espalda West Coast Choppers Long Beach', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5914_cutout.webp', altText: 'Detalle bordado Iron Cross Long Beach', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 27,
    sku: 'SH-007',
    title: 'Jesse James Work Wear West Coast Choppers MC Club Garage Shirt',
    slug: 'jesse-james-work-wear-west-coast-choppers-garage-shirt-sh-007',
    description: 'Camisa de trabajo de corte clásico automotriz Jesse James Work Wear con botones grabados, bordado frontal de alas y enorme cruz maltesa dorada en la espalda.',
    priceMxn: 1790,
    compareAtPriceMxn: 2200,
    sizeLabel: 'L',
    measurements: 'Pecho 59cm · Largo 75cm · Hombro 51cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5937_cutout.webp', altText: 'Frente Camisa Jesse James MC Club', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5949_2_cutout.webp', altText: 'Espalda gran Cruz bordada en hilo dorado', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5938_cutout.webp', altText: 'Detalle parches y etiqueta cuello Jesse James', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5939_cutout.webp', altText: 'Detalle etiqueta tejida', sortOrder: 3, primaryImage: false }
    ]
  },

  // ==========================================
  // CHAMARRAS & OUTERWEAR (JK-001 a JK-002)
  // ==========================================
  {
    id: 28,
    sku: 'JK-001',
    title: 'Southpole Authentic Red Denim Trucker Subway Jacket',
    slug: 'southpole-authentic-red-denim-trucker-subway-jacket-jk-001',
    description: 'Chamarra de mezclilla roja gruesa Southpole Authentic con herrajes grabados y espectacular mural bordado en la espalda con escena del metro de New York.',
    priceMxn: 2250,
    compareAtPriceMxn: 2800,
    sizeLabel: 'XL',
    measurements: 'Pecho 65cm · Largo 72cm · Hombro 56cm · Manga 64cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[5],
    images: [
      { imageUrl: '/assets/archive/img_5870_cutout.webp', altText: 'Frente Chamarra Southpole Roja', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5874_cutout.webp', altText: 'Espalda bordada escena Subway NYC', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5871_cutout.webp', altText: 'Detalle cuello y botones Southpole', sortOrder: 2, primaryImage: false }
    ]
  },
  {
    id: 29,
    sku: 'JK-002',
    title: 'West Coast Choppers Motorcycle Co. Heavy Canvas Work Jacket',
    slug: 'west-coast-choppers-motorcycle-co-heavy-canvas-work-jacket-jk-002',
    description: 'Chamarra de trabajo en lona de algodón pesado (heavy canvas) negra con forro interior térmico, cremallera metálica YKK y bordado frontal West Coast Choppers.',
    priceMxn: 2450,
    compareAtPriceMxn: 3000,
    sizeLabel: 'L',
    measurements: 'Pecho 61cm · Largo 71cm · Hombro 52cm · Manga 65cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[8],
    images: [
      { imageUrl: '/assets/archive/img_5933_cutout.webp', altText: 'Frente Chamarra Canvas WCC Negra', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5936_cutout.webp', altText: 'Espalda limpia canvas pesado', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5934_cutout.webp', altText: 'Detalle bordados frontales dobles', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5935_cutout.webp', altText: 'Detalle parche manga WCC Est. 1992', sortOrder: 3, primaryImage: false }
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
    description: 'Playera sin mangas estilo muscle tee de la colaboración oficial SAD BOYZ Junior H x Don Ed Hardy. Algodón negro lavado con dragón verde y rosas.',
    priceMxn: 1390,
    compareAtPriceMxn: 1700,
    sizeLabel: 'L',
    measurements: 'Pecho 55cm · Largo 72cm · Hombro 44cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: FALLBACK_CATEGORIES[4],
    brand: FALLBACK_BRANDS[2],
    images: [
      { imageUrl: '/assets/archive/img_5528_2_cutout.webp', altText: 'Frente Sad Boyz Muscle Dragon', sortOrder: 0, primaryImage: true },
      { imageUrl: '/assets/archive/img_5531_2_cutout.webp', altText: 'Espalda Sad Boyz', sortOrder: 1, primaryImage: false },
      { imageUrl: '/assets/archive/img_5529_2_cutout.webp', altText: 'Detalle etiqueta original Sad Boyz', sortOrder: 2, primaryImage: false },
      { imageUrl: '/assets/archive/img_5530_2_cutout.webp', altText: 'Detalle dragón y rosas', sortOrder: 3, primaryImage: false }
    ]
  }
];

export function toProductSummary(detail: ProductDetail): ProductSummary {
  const backImage = detail.images.find(
    (img) => img.altText?.toLowerCase().includes('espalda')
  );
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
    primaryImageUrl: detail.images[0]?.imageUrl || null,
    secondaryImageUrl: backImage?.imageUrl || null,
    imagesCount: detail.images.length
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
  const pageSize = filter.pageSize ?? 30;
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
      p.title.toLowerCase() === normalized
  );
}

/**
 * HELPER PARA AGREGAR NUEVAS PRENDAS AL CATÁLOGO FÁCILMENTE:
 * Facilita la adición de nuevas prendas asignando automáticamente el SKU correspondiente.
 */
export function addCatalogPiece(params: {
  categorySlug: 'tees' | 'sudaderas' | 'camisas' | 'outerwear' | 'muscle' | 'pantalones';
  brandSlug: string;
  title: string;
  description: string;
  sizeLabel: string;
  measurements: string;
  styleEra?: 'VINTAGE' | 'STREETWEAR' | 'Y2K' | 'WORKWEAR' | 'ARCHIVE';
  conditionGrade?: 'DEADSTOCK' | 'MINT_9_10' | 'VINTAGE_8_10' | 'DISTRESSED';
  frontCutoutUrl: string;
  backCutoutUrl?: string;
  detailImageUrls?: { url: string; altText: string }[];
}): ProductDetail {
  const prefixMap: Record<string, string> = {
    tees: 'TS',
    sudaderas: 'S',
    camisas: 'SH',
    outerwear: 'JK',
    muscle: 'TT',
    pantalones: 'DP'
  };

  const prefix = prefixMap[params.categorySlug] || 'ARC';
  const existingSameCategory = FALLBACK_PRODUCTS.filter(p => p.sku.startsWith(prefix));
  const nextNum = existingSameCategory.length + 1;
  const nextSku = `${prefix}-${String(nextNum).padStart(3, '0')}`;

  const cat = FALLBACK_CATEGORIES.find(c => c.slug === params.categorySlug) || FALLBACK_CATEGORIES[0];
  const brand = FALLBACK_BRANDS.find(b => b.slug === params.brandSlug) || FALLBACK_BRANDS[0];

  const images = [
    { imageUrl: params.frontCutoutUrl, altText: `Frente ${params.title}`, sortOrder: 0, primaryImage: true }
  ];

  if (params.backCutoutUrl) {
    images.push({ imageUrl: params.backCutoutUrl, altText: `Espalda ${params.title}`, sortOrder: 1, primaryImage: false });
  }

  if (params.detailImageUrls) {
    params.detailImageUrls.forEach((d, idx) => {
      images.push({ imageUrl: d.url, altText: d.altText, sortOrder: images.length, primaryImage: false });
    });
  }

  const newProduct: ProductDetail = {
    id: FALLBACK_PRODUCTS.length + 1,
    sku: nextSku,
    title: params.title,
    slug: `${params.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${nextSku.toLowerCase()}`,
    description: params.description,
    priceMxn: 0,
    compareAtPriceMxn: null,
    sizeLabel: params.sizeLabel,
    measurements: params.measurements,
    styleEra: params.styleEra || 'VINTAGE',
    conditionGrade: params.conditionGrade || 'MINT_9_10',
    stock: 1,
    dropTag: 'DROP #01',
    featured: false,
    category: cat,
    brand: brand,
    images
  };

  return newProduct;
}
'''

target_file = 'frontend/src/app/core/services/catalog.fallback.data.ts'
with open(target_file, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"Generated complete, pristine 30-product catalog data in {target_file}")
