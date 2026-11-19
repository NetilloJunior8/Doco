export type StyleEra = 'VINTAGE' | 'STREETWEAR' | 'Y2K' | 'WORKWEAR' | 'ARCHIVE';
export type GarmentCondition = 'DEADSTOCK' | 'MINT_9_10' | 'VINTAGE_8_10' | 'DISTRESSED';
export type PaymentProviderType = 'MERCADO_PAGO' | 'STRIPE' | 'TRANSFER_WHATSAPP';
export type OrderStatus =
  | 'PENDING_PAYMENT'
  | 'RESERVED_WHATSAPP'
  | 'PAID'
  | 'SHIPPED'
  | 'CANCELLED'
  | 'REFUNDED';

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export interface Brand {
  id: number;
  name: string;
  slug: string;
  originCountry: string | null;
  featured: boolean;
}

export interface ProductSummary {
  id: number;
  sku: string;
  title: string;
  slug: string;
  priceMxn: number;
  compareAtPriceMxn: number | null;
  sizeLabel: string;
  styleEra: StyleEra;
  conditionGrade: GarmentCondition;
  stock: number;
  dropTag: string | null;
  featured: boolean;
  categoryName: string;
  categorySlug: string;
  brandName: string;
  brandSlug: string;
  primaryImageUrl: string | null;
  secondaryImageUrl?: string | null;
  imagesCount?: number;
}

export interface ProductImage {
  imageUrl: string;
  altText: string | null;
  sortOrder: number;
  primaryImage: boolean;
}

export interface ProductDetail {
  id: number;
  sku: string;
  title: string;
  slug: string;
  description: string;
  priceMxn: number;
  compareAtPriceMxn: number | null;
  sizeLabel: string;
  measurements: string | null;
  styleEra: StyleEra;
  conditionGrade: GarmentCondition;
  stock: number;
  dropTag: string | null;
  featured: boolean;
  category: Category;
  brand: Brand;
  images: ProductImage[];
}

export interface PageResponse<T> {
  items: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
}

export interface ProductFilter {
  category?: string;
  brand?: string;
  era?: StyleEra | '';
  size?: string;
  inStockOnly?: boolean;
  featuredOnly?: boolean;
  search?: string;
  page?: number;
  pageSize?: number;
  sort?: 'featured' | 'newest' | 'price_asc' | 'price_desc';
}

export interface CartItem {
  product: ProductSummary;
  quantity: number;
}

export interface CheckoutRequest {
  idempotencyKey: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingCity: string;
  shippingState: string;
  shippingPostalCode: string;
  shippingAddress: string;
  paymentProvider: PaymentProviderType;
  items: { productId: number; quantity: number }[];
}

export interface CheckoutSessionResponse {
  orderNumber: string;
  status: OrderStatus;
  paymentProvider: PaymentProviderType;
  subtotalMxn: number;
  shippingMxn: number;
  totalMxn: number;
  checkoutUrl: string;
  instructions: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresInMs: number;
  email: string;
  fullName: string;
  role: 'ROLE_CUSTOMER' | 'ROLE_ADMIN';
}

export interface CreateProductPayload {
  sku: string;
  title: string;
  description: string;
  priceMxn: number;
  compareAtPriceMxn: number | null;
  sizeLabel: string;
  measurements: string;
  styleEra: StyleEra;
  conditionGrade: GarmentCondition;
  stock: number;
  dropTag: string;
  featured: boolean;
  categoryId: number;
  brandId: number;
  imageUrls: string[];
}
