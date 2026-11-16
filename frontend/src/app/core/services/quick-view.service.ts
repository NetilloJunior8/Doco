import { Injectable, inject, signal } from '@angular/core';
import { ProductSummary } from '../models/catalog.models';
import { SoundFxService } from './sound-fx.service';

@Injectable({ providedIn: 'root' })
export class QuickViewService {
  private readonly soundFx = inject(SoundFxService);

  readonly isOpen = signal(false);
  readonly product = signal<ProductSummary | null>(null);

  open(product: ProductSummary): void {
    this.product.set(product);
    this.isOpen.set(true);
    this.soundFx.playVault();
  }

  close(): void {
    this.isOpen.set(false);
    this.product.set(null);
    this.soundFx.playClick();
  }
}
