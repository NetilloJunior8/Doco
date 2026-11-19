import { Injectable, inject, signal } from '@angular/core';
import { ProductDetail, ProductSummary } from '../models/catalog.models';
import { getFallbackProductBySlug } from './catalog.fallback.data';
import { SoundFxService } from './sound-fx.service';

@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly soundFx = inject(SoundFxService);

  readonly isOpen = signal(false);
  readonly summary = signal<ProductSummary | null>(null);
  readonly detail = signal<ProductDetail | null>(null);

  // Backward-compatibility signal
  readonly product = this.summary;

  open(product: ProductSummary | ProductDetail): void {
    if ('images' in product && Array.isArray((product as ProductDetail).images)) {
      const fullDetail = product as ProductDetail;
      this.detail.set(fullDetail);
      this.summary.set({
        id: fullDetail.id,
        sku: fullDetail.sku,
        title: fullDetail.title,
        slug: fullDetail.slug,
        priceMxn: fullDetail.priceMxn,
        compareAtPriceMxn: fullDetail.compareAtPriceMxn,
        sizeLabel: fullDetail.sizeLabel,
        styleEra: fullDetail.styleEra,
        conditionGrade: fullDetail.conditionGrade,
        stock: fullDetail.stock,
        dropTag: fullDetail.dropTag,
        featured: fullDetail.featured,
        categoryName: fullDetail.category.name,
        categorySlug: fullDetail.category.slug,
        brandName: fullDetail.brand.name,
        brandSlug: fullDetail.brand.slug,
        primaryImageUrl: fullDetail.images[0]?.imageUrl ?? null,
        secondaryImageUrl: fullDetail.images[1]?.imageUrl ?? null,
        imagesCount: fullDetail.images.length
      });
    } else {
      const sum = product as ProductSummary;
      this.summary.set(sum);
      const found = getFallbackProductBySlug(sum.slug);
      this.detail.set(found || null);
    }
    this.isOpen.set(true);
    this.soundFx.playVault();
  }

  close(): void {
    this.isOpen.set(false);
    this.summary.set(null);
    this.detail.set(null);
    this.soundFx.playClick();
  }
}
