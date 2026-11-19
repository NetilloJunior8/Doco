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
    "id": 1,
    "name": "Playeras Gráficas",
    "slug": "tees",
    "description": "Tees vintage, serigrafías Y2K y colaboraciones de archivo.",
    "imageUrl": "/assets/archive/img_5487_2.webp",
    "displayOrder": 1
  },
  {
    "id": 2,
    "name": "Camisas & Garage",
    "slug": "camisas",
    "description": "Camisas mecánicas, bowling shirts y workwear button-up.",
    "imageUrl": "/assets/archive/img_5862.webp",
    "displayOrder": 2
  },
  {
    "id": 3,
    "name": "Outerwear & Chamarras",
    "slug": "outerwear",
    "description": "Chamarras canvas, denim jackets y prendas pesadas de colección.",
    "imageUrl": "/assets/archive/img_5870.webp",
    "displayOrder": 3
  },
  {
    "id": 4,
    "name": "Sudaderas & Crewnecks",
    "slug": "sudaderas",
    "description": "Crewnecks pesados y felpa vintage.",
    "imageUrl": "/assets/archive/img_5902.webp",
    "displayOrder": 4
  },
  {
    "id": 5,
    "name": "Sin Mangas & Muscle",
    "slug": "muscle",
    "description": "Tanks y muscle tees de archivo.",
    "imageUrl": "/assets/archive/img_5528_2.webp",
    "displayOrder": 5
  }
];

export const FALLBACK_BRANDS: Brand[] = [
  {
    "id": 1,
    "name": "Ed Hardy",
    "slug": "ed-hardy",
    "originCountry": "USA",
    "featured": true
  },
  {
    "id": 2,
    "name": "Christian Audigier",
    "slug": "christian-audigier",
    "originCountry": "USA",
    "featured": true
  },
  {
    "id": 3,
    "name": "SAD BOYZ",
    "slug": "sad-boyz",
    "originCountry": "Mexico / USA",
    "featured": true
  },
  {
    "id": 4,
    "name": "Diesel",
    "slug": "diesel",
    "originCountry": "Italy",
    "featured": true
  },
  {
    "id": 5,
    "name": "Harley-Davidson",
    "slug": "harley-davidson",
    "originCountry": "USA",
    "featured": true
  },
  {
    "id": 6,
    "name": "Southpole",
    "slug": "southpole",
    "originCountry": "USA",
    "featured": true
  },
  {
    "id": 7,
    "name": "Nike",
    "slug": "nike",
    "originCountry": "USA",
    "featured": true
  },
  {
    "id": 8,
    "name": "Misfits",
    "slug": "misfits",
    "originCountry": "USA",
    "featured": true
  },
  {
    "id": 9,
    "name": "West Coast Choppers",
    "slug": "west-coast-choppers",
    "originCountry": "USA",
    "featured": true
  }
];

export const FALLBACK_PRODUCTS: ProductDetail[] = [
  {
    id: 1,
    sku: 'DOCO-ARC-001',
    title: 'Ed Hardy Death Before Dishonor Skull Tee',
    slug: 'ed-hardy-death-before-dishonor-skull-tee-doco-arc-001',
    description: 'Playera Ed Hardy original con calavera clásica atravesada por daga de tatuador, lema Death Before Dishonor en pergamino, flamas y tipografía gótica Don Ed Hardy Designs en espalda.',
    priceMxn: 1350,
    compareAtPriceMxn: 1650,
    sizeLabel: 'M',
    measurements: 'Pecho 53cm · Largo 71cm · Hombro 48cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DROP #01',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5487_2_cutout.webp",
            "altText": "Frente Ed Hardy Death Before Dishonor",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5490_2_cutout.webp",
            "altText": "Espalda Don Ed Hardy Designs",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5488_2_cutout.webp",
            "altText": "Etiqueta cuello Ed Hardy M",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5489_2_cutout.webp",
            "altText": "Detalle gráfico calavera y flamas",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 2,
    sku: 'DOCO-ARC-002',
    title: 'Ed Hardy Hellcat Panther Flame Tee',
    slug: 'ed-hardy-hellcat-panther-flame-tee-doco-arc-002',
    description: 'Playera Ed Hardy con gráfico monumental de pantera rugiente Hellcat envuelta en llamaradas rojas y amarillas con serpiente. Nueva con etiqueta colgante original.',
    priceMxn: 1450,
    compareAtPriceMxn: 1790,
    sizeLabel: 'M',
    measurements: 'Pecho 52cm · Largo 70cm · Hombro 47cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DEADSTOCK',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5495_2_cutout.webp",
            "altText": "Frente Ed Hardy Hellcat Panther",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5498_2_cutout.webp",
            "altText": "Espalda Ed Hardy",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5496_2_cutout.webp",
            "altText": "Etiqueta original Ed Hardy M",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5497_2_cutout.webp",
            "altText": "Detalle colmillos y serigrafía",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 3,
    sku: 'DOCO-ARC-003',
    title: 'Ed Hardy Pierced Hearts True Love Rhinestone Tee',
    slug: 'ed-hardy-pierced-hearts-true-love-rhinestone-tee-doco-arc-003',
    description: 'Playera negra con águila americana y corazones atravesados True Love con incrustaciones de pedrería y cristales rhinestones brillantes. Con cartón y código original.',
    priceMxn: 1550,
    compareAtPriceMxn: 1950,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 73cm · Hombro 50cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'RHINESTONES',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5501_2_cutout.webp",
            "altText": "Frente Ed Hardy Pierced Hearts",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5504_2_cutout.webp",
            "altText": "Espalda Ed Hardy",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5502_2_cutout.webp",
            "altText": "Etiqueta cuello Talla L",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5503_2_cutout.webp",
            "altText": "Detalle pedrería y bordados",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 4,
    sku: 'DOCO-ARC-004',
    title: 'Christian Audigier Los Angeles Crown Heart Rhinestone Tee',
    slug: 'christian-audigier-los-angeles-crown-heart-rhinestone-tee-doco-arc-004',
    description: 'Edición de lujo Christian Audigier Los Angeles California con corona barroca, corazón sagrado con pedrería roja y rosas en relieve dorado metálico. Nueva con etiqueta y certificado.',
    priceMxn: 1750,
    compareAtPriceMxn: 2200,
    sizeLabel: 'M',
    measurements: 'Pecho 54cm · Largo 71cm · Algodón premium suave',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'GRAIL ARCHIVE',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[1],
    images: [
      {
            "imageUrl": "/assets/archive/img_5506_2_cutout.webp",
            "altText": "Frente Christian Audigier Crown Heart",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5510_2_cutout.webp",
            "altText": "Espalda Christian Audigier",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5507_2_cutout.webp",
            "altText": "Etiqueta Christian Audigier LA",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5508_2_cutout.webp",
            "altText": "Detalle pedrería fina y dorados",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 5,
    sku: 'DOCO-ARC-005',
    title: 'SAD BOYZ x Ed Hardy Virgen de Guadalupe & Cross Tee',
    slug: 'sad-boyz-x-ed-hardy-virgen-de-guadalupe-cross-tee-doco-arc-005',
    description: 'Colaboración oficial histórica SAD BOYZ by Junior H con Ed Hardy. Gráfico central de la Virgen de Guadalupe con rayos carmesí y rosas al frente, y gran cruz gótica SAD BOYZ en espalda.',
    priceMxn: 1650,
    compareAtPriceMxn: 1990,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 74cm · Boxy Fit',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'SAD BOYZ COLLAB',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      {
            "imageUrl": "/assets/archive/img_5513_2_cutout.webp",
            "altText": "Frente Virgen de Guadalupe Sad Boyz",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5520_2_cutout.webp",
            "altText": "Espalda Cruz Gótica Sad Boyz",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5514_2_cutout.webp",
            "altText": "Etiqueta original Sad Boyz x Ed Hardy",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5515_2_cutout.webp",
            "altText": "Detalle impresión Virgen",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 6,
    sku: 'DOCO-ARC-006',
    title: 'Ed Hardy 2-in-1 Layered Tiger in Flames Long-Sleeve',
    slug: 'ed-hardy-2-in-1-layered-tiger-in-flames-long-sleeve-doco-arc-006',
    description: 'Pieza icónica 2-en-1 con playera de manga corta negra y mangas largas térmicas blancas integradas con calavera y fuego. Gráfico frontal de tigre con ojo místico y flamas.',
    priceMxn: 1850,
    compareAtPriceMxn: 2300,
    sizeLabel: 'L',
    measurements: 'Pecho 56cm · Largo 73cm · Manga 66cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'LAYERED 2-IN-1',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5521_2_cutout.webp",
            "altText": "Frente Ed Hardy Layered Tiger",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5527_2_cutout.webp",
            "altText": "Espalda Don Ed Hardy Designs",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5522_2_cutout.webp",
            "altText": "Detalle mangas con calavera",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5524_2_cutout.webp",
            "altText": "Etiqueta original Ed Hardy",
            "sortOrder": 3,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5525_2_cutout.webp",
            "altText": "Detalle gráfico tigre y ojo",
            "sortOrder": 4,
            "primaryImage": false
      }
    ]
  },
  {
    id: 7,
    sku: 'DOCO-ARC-007',
    title: 'SAD BOYZ x Ed Hardy Dragon Roses Sleeveless Muscle Tee',
    slug: 'sad-boyz-x-ed-hardy-dragon-roses-sleeveless-muscle-tee-doco-arc-007',
    description: 'Muscle tee sin mangas con corte sisa amplia estilo Y2K gym/street. Dragón oriental serpenteante en tonos turquesa y carmesí con rosas y tipografía SAD BOYZ blanca.',
    priceMxn: 1290,
    compareAtPriceMxn: 1590,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 70cm · Sisa profunda',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'MUSCLE TEE',
    featured: true,
    category: FALLBACK_CATEGORIES[4],
    brand: FALLBACK_BRANDS[2],
    images: [
      {
            "imageUrl": "/assets/archive/img_5528_2_cutout.webp",
            "altText": "Frente Sad Boyz Muscle Dragon",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5531_2_cutout.webp",
            "altText": "Espalda Sad Boyz",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5529_2_cutout.webp",
            "altText": "Etiqueta original Sad Boyz",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5530_2_cutout.webp",
            "altText": "Detalle dragón y rosas",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 8,
    sku: 'DOCO-ARC-008',
    title: 'Ed Hardy Live Fast Love Hard Red Skull Dagger Tee',
    slug: 'ed-hardy-live-fast-love-hard-red-skull-dagger-tee-doco-arc-008',
    description: 'Playera rojo escarlata vivo con calavera atravesada por daga de tatuador tradicional, lema Live Fast Love Hard Die Young con glitter dorado en la marca.',
    priceMxn: 1490,
    compareAtPriceMxn: 1850,
    sizeLabel: 'L',
    measurements: 'Pecho 55cm · Largo 72cm · Hombro 49cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DEADSTOCK',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5532_2_cutout.webp",
            "altText": "Frente Ed Hardy Red Skull Dagger",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5535_2_cutout.webp",
            "altText": "Espalda Ed Hardy rojo",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5533_2_cutout.webp",
            "altText": "Detalle calavera y letras doradas",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5534_2_cutout.webp",
            "altText": "Etiqueta original Ed Hardy",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 9,
    sku: 'DOCO-ARC-009',
    title: 'Ed Hardy Red Roaring Panther Gold Script Tee',
    slug: 'ed-hardy-red-roaring-panther-gold-script-tee-doco-arc-009',
    description: 'Ed Hardy tono carmesí oscuro con cabeza de pantera rugiendo en fauces amarillas y letras Ed Hardy en tipografía cursiva lila contrastante.',
    priceMxn: 1450,
    compareAtPriceMxn: 1790,
    sizeLabel: 'M',
    measurements: 'Pecho 53cm · Largo 70cm · Hombro 47cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DEADSTOCK',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5537_2_cutout.webp",
            "altText": "Frente Ed Hardy Red Panther",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5540_2_cutout.webp",
            "altText": "Espalda Ed Hardy",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5538_2_cutout.webp",
            "altText": "Detalle pantera rugiendo",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5539_2_cutout.webp",
            "altText": "Etiqueta Ed Hardy M",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 10,
    sku: 'DOCO-ARC-010',
    title: 'Ed Hardy Double Skull & Coiled Snake Tee',
    slug: 'ed-hardy-double-skull-coiled-snake-tee-doco-arc-010',
    description: 'Diseño archival con doble calavera agrietada entrelazada por serpiente verde con escamas y tipografía gótica Ed Hardy en relieve turquesa.',
    priceMxn: 1550,
    compareAtPriceMxn: 1890,
    sizeLabel: 'M',
    measurements: 'Pecho 54cm · Largo 71cm · Hombro 48cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DEADSTOCK',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[0],
    images: [
      {
            "imageUrl": "/assets/archive/img_5541_2_cutout.webp",
            "altText": "Frente Ed Hardy Double Skull Snake",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5544_2_cutout.webp",
            "altText": "Espalda Ed Hardy",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5542_2_cutout.webp",
            "altText": "Detalle calaveras y serpiente",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5543_2_cutout.webp",
            "altText": "Etiqueta de cartón Ed Hardy",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 11,
    sku: 'DOCO-ARC-011',
    title: 'Diesel For Successful Living Box Logo White Tee',
    slug: 'diesel-for-successful-living-box-logo-white-tee-doco-arc-011',
    description: 'Playera blanca de puro algodón de tacto pesado con el logotipo central mini box logo rojo y firma manuscrita Diesel For Successful Living. Corte boxy contemporáneo.',
    priceMxn: 1650,
    compareAtPriceMxn: 2100,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 72cm · Hombro caído 52cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'MINIMAL LOGO',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[3],
    images: [
      {
            "imageUrl": "/assets/archive/img_5840_cutout.webp",
            "altText": "Frente Diesel Box Logo White",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5844_cutout.webp",
            "altText": "Espalda Diesel blanca",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5841_cutout.webp",
            "altText": "Detalle box logo rojo",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5842_cutout.webp",
            "altText": "Etiqueta cuello Diesel",
            "sortOrder": 3,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5843_cutout.webp",
            "altText": "Detalle tejido algodón",
            "sortOrder": 4,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5845_cutout.webp",
            "altText": "Etiqueta interna y cuidados",
            "sortOrder": 5,
            "primaryImage": false
      }
    ]
  },
  {
    id: 12,
    sku: 'DOCO-ARC-012',
    title: 'Harley-Davidson Technical Utility Long-Sleeve Shirt',
    slug: 'harley-davidson-technical-utility-long-sleeve-shirt-doco-arc-012',
    description: 'Camisa técnica de rendimiento Harley-Davidson Motor Clothes en lona ligera gris perla, paneles laterales de ventilación microperforados y doble bolsillo frontal utilitario.',
    priceMxn: 1950,
    compareAtPriceMxn: 2490,
    sizeLabel: 'L',
    measurements: 'Pecho 59cm · Largo 76cm · Manga 65cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'TECHNICAL WORK',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      {
            "imageUrl": "/assets/archive/img_5846_cutout.webp",
            "altText": "Frente Camisa Técnica Harley Gris",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5849_cutout.webp",
            "altText": "Espalda ventilada Harley-Davidson",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5847_cutout.webp",
            "altText": "Detalle bolsillos y parche H-D",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5848_cutout.webp",
            "altText": "Etiqueta HD Performance",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 13,
    sku: 'DOCO-ARC-013',
    title: 'Diesel Red D Embroidered Minimalist White Tee',
    slug: 'diesel-red-d-embroidered-minimalist-white-tee-doco-arc-013',
    description: 'Playera blanca minimalista con el clásico isotipo rojo D de Diesel en pecho central con serigrafía negra de alta densidad. Con etiqueta original negra colgante.',
    priceMxn: 1590,
    compareAtPriceMxn: 1950,
    sizeLabel: 'M',
    measurements: 'Pecho 54cm · Largo 71cm · Hombro 48cm',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DEADSTOCK',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[3],
    images: [
      {
            "imageUrl": "/assets/archive/img_5851_cutout.webp",
            "altText": "Frente Diesel Red D White Tee",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5854_cutout.webp",
            "altText": "Espalda limpia Diesel",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5852_cutout.webp",
            "altText": "Detalle logo D rojo en pecho",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5853_cutout.webp",
            "altText": "Etiqueta original Diesel colgante",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 14,
    sku: 'DOCO-ARC-014',
    title: 'Harley-Davidson Steel Grey Workwear Garage Shirt',
    slug: 'harley-davidson-steel-grey-workwear-garage-shirt-doco-arc-014',
    description: 'Camisa mecánica de corte boxy en drill de algodón pesado color gris acero con bordado Harley-Davidson en bolsillo izquierdo, tribales en mangas y remate de metal.',
    priceMxn: 1890,
    compareAtPriceMxn: 2350,
    sizeLabel: 'XL',
    measurements: 'Pecho 64cm · Largo 75cm · Boxy Garage Fit',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'GARAGE WEAR',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      {
            "imageUrl": "/assets/archive/img_5855_cutout.webp",
            "altText": "Frente Camisa Harley Gris Acero",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5859_cutout.webp",
            "altText": "Espalda Harley-Davidson",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5856_cutout.webp",
            "altText": "Detalle bordado pecho y cuello",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5857_cutout.webp",
            "altText": "Etiqueta An American Legend XL",
            "sortOrder": 3,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5858_cutout.webp",
            "altText": "Detalle tribal en manga",
            "sortOrder": 4,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5860_cutout.webp",
            "altText": "Detalle remache bar and shield",
            "sortOrder": 5,
            "primaryImage": false
      }
    ]
  },
  {
    id: 15,
    sku: 'DOCO-ARC-015',
    title: 'Harley-Davidson Rust Orange Skull Stripe Garage Button-Up',
    slug: 'harley-davidson-rust-orange-skull-stripe-garage-button-up-doco-arc-015',
    description: 'Camisa bowling / garage en tono óxido con franja vertical negra lateral ilustrada con la emblemática Willie G Skull en repetición y bordado Harley en pecho.',
    priceMxn: 1990,
    compareAtPriceMxn: 2490,
    sizeLabel: 'L',
    measurements: 'Pecho 61cm · Largo 74cm · Hombro 51cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'WILLIE G SKULL',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[4],
    images: [
      {
            "imageUrl": "/assets/archive/img_5862_cutout.webp",
            "altText": "Frente Camisa Naranja Harley Skull",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5864_cutout.webp",
            "altText": "Espalda Harley-Davidson",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5863_cutout.webp",
            "altText": "Detalle franja Willie G Skull",
            "sortOrder": 2,
            "primaryImage": false
      }
    ]
  },
  {
    id: 16,
    sku: 'DOCO-ARC-016',
    title: 'Harley-Davidson Beartooth Cody Wyoming Biker Graphic Tee',
    slug: 'harley-davidson-beartooth-cody-wyoming-biker-graphic-tee-doco-arc-016',
    description: 'Playera vintage tono café espresso con arte de archivo en espalda: concesionario histórico Beartooth Harley-Davidson en Cody, Wyoming con choppers y paisaje.',
    priceMxn: 1390,
    compareAtPriceMxn: 1690,
    sizeLabel: 'XL',
    measurements: 'Pecho 62cm · Largo 75cm · Fade vintage natural',
    styleEra: 'VINTAGE',
    conditionGrade: 'VINTAGE_8_10',
    stock: 1,
    dropTag: 'VINTAGE 90s',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[4],
    images: [
      {
            "imageUrl": "/assets/archive/img_5866_cutout.webp",
            "altText": "Espalda Beartooth Harley-Davidson Cody",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5868_cutout.webp",
            "altText": "Frente Harley-Davidson",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5867_cutout.webp",
            "altText": "Detalle serigrafía moto y edificio",
            "sortOrder": 2,
            "primaryImage": false
      }
    ]
  },
  {
    id: 17,
    sku: 'DOCO-ARC-017',
    title: 'Southpole Authentic Red Denim Trucker Subway Jacket',
    slug: 'southpole-authentic-red-denim-trucker-subway-jacket-doco-arc-017',
    description: 'Chamarra de mezclilla roja rígida deadstock con etiqueta colgante original. En espalda luce un espectacular bordado en hilo morado y blanco con b-boy en estación de metro neoyorquino.',
    priceMxn: 2650,
    compareAtPriceMxn: 3200,
    sizeLabel: 'M',
    measurements: 'Pecho 58cm · Largo 67cm · Manga 63cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'DEADSTOCK // GRAIL',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[5],
    images: [
      {
            "imageUrl": "/assets/archive/img_5870_cutout.webp",
            "altText": "Frente Chamarra Southpole Roja",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5874_cutout.webp",
            "altText": "Espalda bordada escena Subway NYC",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5871_cutout.webp",
            "altText": "Detalle cuello y botones Southpole",
            "sortOrder": 2,
            "primaryImage": false
      }
    ]
  },
  {
    id: 18,
    sku: 'DOCO-ARC-018',
    title: 'Southpole Heavy Embroidered 1991 Archival Black Tee',
    slug: 'southpole-heavy-embroidered-1991-archival-black-tee-doco-arc-018',
    description: 'Playera negra heavyweight Southpole Authentic Collection con masivo bordado en relieve bloque blanco y rojo en pecho y parche tejido Est. 1991 en faldón.',
    priceMxn: 1290,
    compareAtPriceMxn: 1590,
    sizeLabel: 'M',
    measurements: 'Pecho 56cm · Largo 72cm · Hombro 50cm',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'HEAVYWEIGHT TEE',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[5],
    images: [
      {
            "imageUrl": "/assets/archive/img_5876_cutout.webp",
            "altText": "Frente Southpole Embroidered Tee",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5878_cutout.webp",
            "altText": "Parche tejido Est. 1991",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5877_cutout.webp",
            "altText": "Detalle bordado bloque Southpole",
            "sortOrder": 2,
            "primaryImage": false
      }
    ]
  },
  {
    id: 19,
    sku: 'DOCO-ARC-019',
    title: 'Nike Vintage Red Classic Swoosh Crewneck Sweatshirt',
    slug: 'nike-vintage-red-classic-swoosh-crewneck-sweatshirt-doco-arc-019',
    description: 'Sudadera cuello redondo Nike vintage en felpa pesada color rojo cereza con icónico Swoosh bordado en hilo blanco en pecho. Ribs laterales y cuello grueso.',
    priceMxn: 1750,
    compareAtPriceMxn: 2100,
    sizeLabel: 'L',
    measurements: 'Pecho 61cm · Largo 70cm · Algodón felpa pesada',
    styleEra: 'VINTAGE',
    conditionGrade: 'MINT_9_10',
    stock: 1,
    dropTag: 'MINI SWOOSH',
    featured: true,
    category: FALLBACK_CATEGORIES[3],
    brand: FALLBACK_BRANDS[6],
    images: [
      {
            "imageUrl": "/assets/archive/img_5902_cutout.webp",
            "altText": "Frente Sudadera Nike Roja",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5901_cutout.webp",
            "altText": "Detalle Swoosh blanco y etiqueta Nike",
            "sortOrder": 1,
            "primaryImage": false
      }
    ]
  },
  {
    id: 20,
    sku: 'DOCO-ARC-020',
    title: 'Misfits Fiend Skull & Choker Punk Graphic Black Tee',
    slug: 'misfits-fiend-skull-choker-punk-graphic-black-tee-doco-arc-020',
    description: 'Playera de la legendaria banda punk Misfits con The Crimson Ghost / Fiend Skull enmarcada por calaveras y collar de picos en degradado lima y púrpura.',
    priceMxn: 1350,
    compareAtPriceMxn: 1690,
    sizeLabel: 'M',
    measurements: 'Pecho 53cm · Largo 71cm · Hombro 48cm',
    styleEra: 'VINTAGE',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'PUNK ARCHIVE',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[7],
    images: [
      {
            "imageUrl": "/assets/archive/img_5903_cutout.webp",
            "altText": "Frente Misfits Skull Tee",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5908_cutout.webp",
            "altText": "Espalda Misfits",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5904_cutout.webp",
            "altText": "Detalle calavera Misfits y colores",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5905_cutout.webp",
            "altText": "Etiqueta original Misfits",
            "sortOrder": 3,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5906_cutout.webp",
            "altText": "Detalle textura algodón",
            "sortOrder": 4,
            "primaryImage": false
      }
    ]
  },
  {
    id: 21,
    sku: 'DOCO-ARC-021',
    title: 'SAD BOYZ x Ed Hardy Muerte Antes de Deshonor Eagle Tee',
    slug: 'sad-boyz-x-ed-hardy-muerte-antes-de-deshonor-eagle-tee-doco-arc-021',
    description: 'Edición especial Sad Boyz x Ed Hardy con imponente águila sobre sol y pergamino Muerte Antes de Deshonor. Letras góticas Sad Boyz con carita triste al frente.',
    priceMxn: 1650,
    compareAtPriceMxn: 1990,
    sizeLabel: 'L',
    measurements: 'Pecho 57cm · Largo 73cm · Boxy Fit',
    styleEra: 'STREETWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'SAD BOYZ COLLAB',
    featured: true,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[2],
    images: [
      {
            "imageUrl": "/assets/archive/img_5909_cutout.webp",
            "altText": "Frente Sad Boyz Águila Muerte Antes de Deshonor",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5912_cutout.webp",
            "altText": "Espalda Sad Boyz",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5910_cutout.webp",
            "altText": "Detalle serigrafía águila y pergamino",
            "sortOrder": 2,
            "primaryImage": false
      }
    ]
  },
  {
    id: 22,
    sku: 'DOCO-ARC-022',
    title: 'West Coast Choppers Long Beach CA Est. 1992 Mechanic Shirt',
    slug: 'west-coast-choppers-long-beach-ca-est-1992-mechanic-shirt-doco-arc-022',
    description: 'Camisa mecánica negra de manga corta West Coast Choppers con parche bordado circular Iron Cross Long Beach CA Est. 1992 en pecho sobre bolsillo.',
    priceMxn: 1950,
    compareAtPriceMxn: 2400,
    sizeLabel: 'L',
    measurements: 'Pecho 61cm · Largo 74cm · Hombro 51cm',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'CHOPPERS GARAGE',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[8],
    images: [
      {
            "imageUrl": "/assets/archive/img_5913_cutout.webp",
            "altText": "Frente Camisa Mecánica WCC Negra",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5915_cutout.webp",
            "altText": "Espalda West Coast Choppers",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5914_cutout.webp",
            "altText": "Detalle bordado Iron Cross Long Beach",
            "sortOrder": 2,
            "primaryImage": false
      }
    ]
  },
  {
    id: 23,
    sku: 'DOCO-ARC-023',
    title: 'West Coast Choppers Iron Cross & Flames Biker Tee',
    slug: 'west-coast-choppers-iron-cross-flames-biker-tee-doco-arc-023',
    description: 'Playera negra con Cruz de Malta West Coast Choppers blanca al frente y en espalda masivo chopper custom naranja con llamaradas y cruz gótica metálica.',
    priceMxn: 1390,
    compareAtPriceMxn: 1690,
    sizeLabel: 'L',
    measurements: 'Pecho 58cm · Largo 73cm · Heavy Cotton',
    styleEra: 'Y2K',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'BIKER ARCHIVE',
    featured: false,
    category: FALLBACK_CATEGORIES[0],
    brand: FALLBACK_BRANDS[8],
    images: [
      {
            "imageUrl": "/assets/archive/img_5920_cutout.webp",
            "altText": "Frente West Coast Choppers Iron Cross Tee",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5925_cutout.webp",
            "altText": "Espalda completa Chopper naranja y flamas",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5922_cutout.webp",
            "altText": "Detalle logo Iron Cross blanco",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5923_cutout.webp",
            "altText": "Etiqueta original WCC cuello",
            "sortOrder": 3,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5924_cutout.webp",
            "altText": "Detalle moto chopper y fuego",
            "sortOrder": 4,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5926_cutout.webp",
            "altText": "Detalle motor chopper",
            "sortOrder": 5,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5927_cutout.webp",
            "altText": "Detalle etiqueta inferior",
            "sortOrder": 6,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5928_cutout.webp",
            "altText": "Vista lateral",
            "sortOrder": 7,
            "primaryImage": false
      }
    ]
  },
  {
    id: 24,
    sku: 'DOCO-ARC-024',
    title: 'West Coast Choppers Motorcycle Co. Heavy Canvas Work Jacket',
    slug: 'west-coast-choppers-motorcycle-co-heavy-canvas-work-jacket-doco-arc-024',
    description: 'Chamarra de trabajo de lona gruesa duck canvas negra estilo Detroit, con cuello camisero, bordado West Coast Choppers Motorcycle Co. al frente y cruz metálica en bolsillo.',
    priceMxn: 3150,
    compareAtPriceMxn: 3800,
    sizeLabel: 'L',
    measurements: 'Pecho 63cm · Largo 69cm · Manga 65cm · Canvas 12oz',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'HEAVY WORKWEAR',
    featured: true,
    category: FALLBACK_CATEGORIES[2],
    brand: FALLBACK_BRANDS[8],
    images: [
      {
            "imageUrl": "/assets/archive/img_5933_cutout.webp",
            "altText": "Frente Chamarra Canvas WCC Negra",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5936_cutout.webp",
            "altText": "Espalda limpia canvas pesado",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5934_cutout.webp",
            "altText": "Detalle bordados frontales dobles",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5935_cutout.webp",
            "altText": "Parche manga WCC Est. 1992",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
  {
    id: 25,
    sku: 'DOCO-ARC-025',
    title: 'Jesse James Work Wear West Coast Choppers MC Club Garage Shirt',
    slug: 'jesse-james-work-wear-west-coast-choppers-mc-club-garage-shirt-doco-arc-025',
    description: 'Pieza de coleccionista Jesse James Work Wear original con etiqueta tejida en cuello, parche bordado MC Club y cruz azul al frente, y masivo bordado dorado en espalda.',
    priceMxn: 2100,
    compareAtPriceMxn: 2600,
    sizeLabel: 'XL',
    measurements: 'Pecho 65cm · Largo 77cm · Heavy Twill',
    styleEra: 'WORKWEAR',
    conditionGrade: 'DEADSTOCK',
    stock: 1,
    dropTag: 'JESSE JAMES GRAIL',
    featured: true,
    category: FALLBACK_CATEGORIES[1],
    brand: FALLBACK_BRANDS[8],
    images: [
      {
            "imageUrl": "/assets/archive/img_5937_cutout.webp",
            "altText": "Frente Camisa Jesse James MC Club",
            "sortOrder": 0,
            "primaryImage": true
      },
      {
            "imageUrl": "/assets/archive/img_5949_2_cutout.webp",
            "altText": "Espalda gran Cruz bordada en hilo dorado",
            "sortOrder": 1,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5938_cutout.webp",
            "altText": "Detalle parches y etiqueta cuello Jesse James",
            "sortOrder": 2,
            "primaryImage": false
      },
      {
            "imageUrl": "/assets/archive/img_5939_cutout.webp",
            "altText": "Detalle etiqueta tejida",
            "sortOrder": 3,
            "primaryImage": false
      }
    ]
  },
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
    primaryImageUrl: detail.images[0]?.imageUrl || null,
    secondaryImageUrl: detail.images[1]?.imageUrl || null,
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
      normalized.includes(p.sku.toLowerCase())
  );
}
