import { Injectable, computed, effect, inject, signal } from '@angular/core';
import { CartItem, ProductSummary } from '../models/catalog.models';
import { SoundFxService } from './sound-fx.service';
import { CustomerShippingInfo, WhatsAppService } from './whatsapp.service';

const STORAGE_KEY = 'doco_cart_v1';
const FREE_SHIPPING_THRESHOLD_MXN = 2500;
const FLAT_SHIPPING_MXN = 180;

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly whatsapp = inject(WhatsAppService);
  private readonly soundFx = inject(SoundFxService);

  private readonly itemsSignal = signal<CartItem[]>(this.loadFromStorage());
  private readonly drawerOpenSignal = signal(false);

  readonly items = this.itemsSignal.asReadonly();
  readonly isDrawerOpen = this.drawerOpenSignal.asReadonly();

  readonly itemCount = computed(() =>
    this.itemsSignal().reduce((acc, item) => acc + item.quantity, 0)
  );

  readonly subtotalMxn = computed(() =>
    this.itemsSignal().reduce((acc, item) => acc + item.product.priceMxn * item.quantity, 0)
  );

  readonly shippingMxn = computed(() => {
    const sub = this.subtotalMxn();
    if (sub === 0) return 0;
    return sub >= FREE_SHIPPING_THRESHOLD_MXN ? 0 : FLAT_SHIPPING_MXN;
  });

  readonly totalMxn = computed(() => this.subtotalMxn() + this.shippingMxn());

  readonly freeShippingRemainingMxn = computed(() =>
    Math.max(0, FREE_SHIPPING_THRESHOLD_MXN - this.subtotalMxn())
  );

  readonly freeShippingProgressPct = computed(() => {
    const sub = this.subtotalMxn();
    return Math.min(100, Math.round((sub / FREE_SHIPPING_THRESHOLD_MXN) * 100));
  });

  readonly directWhatsAppUrl = computed(() => {
    return this.whatsapp.generateCartCheckoutUrl(
      this.itemsSignal(),
      this.subtotalMxn(),
      this.shippingMxn(),
      this.totalMxn()
    );
  });

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.itemsSignal()));
      } catch {
        // Ignore storage quota errors cleanly
      }
    });
  }

  openDrawer(): void {
    this.soundFx.playClick();
    this.drawerOpenSignal.set(true);
  }

  closeDrawer(): void {
    this.soundFx.playClick();
    this.drawerOpenSignal.set(false);
  }

  addItem(product: ProductSummary, quantity = 1): boolean {
    if (product.stock <= 0) return false;
    let added = false;

    this.itemsSignal.update((current) => {
      const idx = current.findIndex((i) => i.product.id === product.id);
      if (idx === -1) {
        added = true;
        return [...current, { product, quantity: Math.min(quantity, product.stock) }];
      }
      const existing = current[idx];
      const nextQty = Math.min(product.stock, existing.quantity + quantity);
      if (nextQty === existing.quantity) {
        return current;
      }
      added = true;
      return current.map((item, i) => (i === idx ? { ...item, quantity: nextQty } : item));
    });

    if (added) {
      this.soundFx.playVault();
      this.drawerOpenSignal.set(true);
    }
    return added;
  }

  updateQuantity(productId: number, quantity: number): void {
    this.soundFx.playClick();
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }
    this.itemsSignal.update((current) =>
      current.map((item) =>
        item.product.id === productId
          ? { ...item, quantity: Math.min(quantity, item.product.stock) }
          : item
      )
    );
  }

  removeItem(productId: number): void {
    this.soundFx.playClick();
    this.itemsSignal.update((current) => current.filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.itemsSignal.set([]);
  }

  getWhatsAppCheckoutUrl(shipping?: CustomerShippingInfo): string {
    return this.whatsapp.generateCartCheckoutUrl(
      this.itemsSignal(),
      this.subtotalMxn(),
      this.shippingMxn(),
      this.totalMxn(),
      shipping
    );
  }

  openWhatsAppCheckout(shipping?: CustomerShippingInfo): void {
    const url = this.getWhatsAppCheckoutUrl(shipping);
    this.whatsapp.openUrl(url);
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
}

