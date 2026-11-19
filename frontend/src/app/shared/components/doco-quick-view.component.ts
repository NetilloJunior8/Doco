import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { ProductDetail, ProductSummary } from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatCondition, formatEra, formatMxn } from '../../core/utils/formatters';

@Component({
  selector: 'doco-quick-view',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (quickView.isOpen();) {
      <div class="qv-overlay" (click)="onBackdropClick($event)">
        <div class="qv-modal" role="dialog" aria-modal="true" [attr.aria-label]="itemTitle()">
          <!-- TOP UTILITY BAR -->
          <div class="qv-topbar font-mono">
            <div class="qv-sku-tag">
              <span class="qv-dot"></span>
              <span>DOCO // {{ itemSku() }}</span>
            </div>
            <button type="button" class="qv-close-btn" (click)="quickView.close()" aria-label="Cerrar modal">
              [ CERRAR / ESC ]
            </button>
          </div>

          <!-- MAIN MODAL CONTENT -->
          <div class="qv-layout">
            <!-- LEFT: INTERACTIVE LOUPE IMAGE VIEWER -->
            <div class="qv-visual">
              <div
                class="qv-viewport"
                [class.is-zooming]="isZooming()"
                (mousemove)="onMouseMove($event)"
                (mouseleave)="onMouseLeave()"
                (click)="toggleMobileZoom()"
              >
                <img
                  [src]="selectedImage() || itemPrimaryImage()"
                  [alt]="itemTitle()"
                  class="qv-image"
                  [style.transform-origin]="zoomOrigin()"
                  [style.transform]="isZooming() ? 'scale(2.4)' : 'scale(1)'"
                />

                <div class="qv-zoom-indicator font-mono">
                  <span>{{ isZooming() ? 'LOUPE ÓPTICO 2.4X' : 'PASA EL CURSOR O TOCA PARA ZOOM' }}</span>
                </div>
              </div>

              <!-- THUMBNAILS GALLERY -->
              @if (images().length > 1) {
                <div class="qv-thumbs font-mono">
                  @for (img of images(); track img.imageUrl; let i = $index) {
                    <button
                      type="button"
                      class="qv-thumb-btn"
                      [class.is-active]="(selectedImage() || itemPrimaryImage()) === img.imageUrl"
                      (click)="selectImage(img.imageUrl)"
                    >
                      <img [src]="img.imageUrl" [alt]="img.altText || itemTitle()" />
                      <span class="thumb-idx">0{{ i + 1 }}</span>
                    </button>
                  }
                </div>
              }
            </div>

            <!-- RIGHT: GARMENT SPECS & ORDER ACTIONS -->
            <div class="qv-specs">
              <div class="specs-header">
                <span class="specs-category font-mono">{{ itemBrand() }} // {{ itemCategory() }}</span>
                <h2 class="specs-title font-mono">{{ itemTitle() }}</h2>
                <div class="specs-price-row font-mono">
                  <span class="specs-price">{{ formatMxn(itemPrice()) }}</span>
                  <span class="specs-tax-note">MXN · ENTREGA CULIACÁN</span>
                </div>
              </div>

              <!-- SPECS TABLE -->
              <div class="specs-table font-mono">
                <div class="spec-cell">
                  <span class="spec-k">TALLA</span>
                  <span class="spec-v">{{ itemSize() }}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-k">ESTADO</span>
                  <span class="spec-v">{{ itemCondition() }}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-k">ERA</span>
                  <span class="spec-v">{{ itemEra() }}</span>
                </div>
                <div class="spec-cell">
                  <span class="spec-k">DISPONIBILIDAD</span>
                  <span class="spec-v spec-v--available">1-OF-1 DISPONIBLE</span>
                </div>
              </div>

              @if (itemMeasurements()) {
                <div class="specs-measurements font-mono">
                  <span class="m-label">MEDIDAS EXACTAS:</span>
                  <span class="m-value">{{ itemMeasurements() }}</span>
                </div>
              }

              @if (itemDescription()) {
                <p class="specs-desc">{{ itemDescription() }}</p>
              }

              <div class="specs-culiacan-notice font-mono">
                <span class="notice-line">ENTREGA LOCAL INMEDIATA EN CULIACÁN, SINALOA</span>
                <span class="notice-sub">Aceptamos efectivo al entregar, transferencia SPEI directa y depósito OXXO. Aparta cualquier pieza con el 30%.</span>
              </div>

              <!-- ACTION BUTTONS -->
              <div class="specs-actions font-mono">
                <button
                  type="button"
                  class="btn-wa-order"
                  (click)="orderDirectWhatsApp()"
                >
                  <span class="btn-text">PEDIR DIRECTO POR WHATSAPP</span>
                  <span class="btn-arrow">↗</span>
                </button>

                <button
                  type="button"
                  class="btn-bag-add"
                  [class.is-added]="recentlyAdded()"
                  (click)="addToBag()"
                >
                  {{ recentlyAdded() ? 'AGREGADA A TU BOLSA' : '+ AGREGAR A LA BOLSA' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .qv-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.88);
      backdrop-filter: blur(8px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: clamp(0.5rem, 2vw, 2rem);
      animation: qvFadeIn 0.18s cubic-bezier(0.2, 0.9, 0.3, 1);
      overflow-y: auto;
      overflow-x: hidden;
      width: 100vw;
      box-sizing: border-box;
    }

    [data-theme='light'] .qv-overlay {
      background: rgba(255, 255, 255, 0.92);
    }

    @keyframes qvFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .qv-modal {
      position: relative;
      background: var(--bg-void);
      border: 1px solid var(--border-strong);
      width: 100%;
      max-width: 1060px;
      max-height: 92vh;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      box-sizing: border-box;
      margin: auto;
    }

    .qv-topbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.75rem 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      background: var(--bg-surface);
      flex-shrink: 0;
    }

    .qv-sku-tag {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-weight: 600;
    }

    .qv-dot {
      width: 6px;
      height: 6px;
      background: var(--text-bone);
      border-radius: 50%;
    }

    .qv-close-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0.25rem 0.5rem;
      font-size: 0.76rem;
      letter-spacing: 0.08em;
      transition: color 0.15s ease;
    }

    .qv-close-btn:hover {
      color: var(--text-bone);
    }

    .qv-layout {
      display: grid;
      grid-template-columns: 1.15fr 1fr;
      overflow-y: auto;
      overflow-x: hidden;
      flex: 1;
    }

    @media (max-width: 820px) {
      .qv-modal {
        max-height: 96vh;
      }
      .qv-layout {
        grid-template-columns: 1fr;
      }
    }

    /* VISUAL VIEWER */
    .qv-visual {
      background: var(--bg-media);
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--border-subtle);
      padding: 1.5rem;
      gap: 1rem;
      box-sizing: border-box;
      min-height: 380px;
    }

    @media (max-width: 820px) {
      .qv-visual {
        border-right: none;
        border-bottom: 1px solid var(--border-subtle);
        padding: 1rem;
      }
    }

    .qv-viewport {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      overflow: hidden;
      background: var(--bg-void);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: crosshair;
      border: 1px solid var(--border-subtle);
    }

    .qv-image {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.12s cubic-bezier(0.2, 0.8, 0.4, 1);
      will-change: transform, transform-origin;
      user-select: none;
      pointer-events: none;
    }

    .qv-zoom-indicator {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      padding: 0.25rem 0.55rem;
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      pointer-events: none;
      text-transform: uppercase;
    }

    .qv-thumbs {
      display: flex;
      gap: 0.5rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }

    .qv-thumb-btn {
      position: relative;
      width: 58px;
      height: 58px;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      padding: 2px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: border-color 0.15s ease;
    }

    .qv-thumb-btn img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }

    .qv-thumb-btn.is-active {
      border-color: var(--text-bone);
    }

    .thumb-idx {
      position: absolute;
      bottom: 2px;
      right: 2px;
      font-size: 0.55rem;
      background: var(--bg-void);
      padding: 0 2px;
      color: var(--text-muted);
    }

    /* SPECS COLUMN */
    .qv-specs {
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-sizing: border-box;
      background: var(--bg-void);
    }

    @media (max-width: 820px) {
      .qv-specs {
        padding: 1.25rem;
        gap: 1rem;
      }
    }

    .specs-category {
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .specs-title {
      font-size: 1.25rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin: 0.35rem 0 0.5rem;
      line-height: 1.25;
      color: var(--text-bone);
      text-transform: uppercase;
    }

    .specs-price-row {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
    }

    .specs-price {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-bone);
    }

    .specs-tax-note {
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }

    .specs-table {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1px;
      background: var(--border-subtle);
      border: 1px solid var(--border-subtle);
    }

    .spec-cell {
      background: var(--bg-void);
      padding: 0.65rem 0.85rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .spec-k {
      font-size: 0.65rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .spec-v {
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-bone);
    }

    .spec-v--available {
      color: #10b981;
    }

    .specs-measurements {
      padding: 0.65rem 0.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      font-size: 0.76rem;
      display: flex;
      flex-direction: column;
      gap: 0.2rem;
    }

    .m-label {
      font-size: 0.65rem;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .m-value {
      color: var(--text-bone);
    }

    .specs-desc {
      font-size: 0.82rem;
      line-height: 1.45;
      color: var(--text-secondary);
      margin: 0;
    }

    .specs-culiacan-notice {
      padding: 0.75rem;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      font-size: 0.7rem;
    }

    .notice-line {
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-bone);
    }

    .notice-sub {
      color: var(--text-muted);
      line-height: 1.35;
    }

    .specs-actions {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-top: auto;
      padding-top: 0.5rem;
    }

    .btn-wa-order {
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      padding: 0.95rem 1.25rem;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-weight: 700;
      font-size: 0.84rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: opacity 0.15s ease;
    }

    .btn-wa-order:hover {
      opacity: 0.92;
    }

    .btn-bag-add {
      background: transparent;
      color: var(--text-bone);
      border: 1px solid var(--border-strong);
      padding: 0.85rem 1.25rem;
      cursor: pointer;
      font-weight: 600;
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      transition: background 0.15s ease;
    }

    .btn-bag-add:hover {
      background: var(--bg-surface);
    }

    .btn-bag-add.is-added {
      background: var(--text-bone);
      color: var(--bg-void);
    }
  `]
})
export class DocoQuickViewComponent {
  readonly quickView = inject(QuickViewService);
  private readonly cart = inject(CartService);
  private readonly soundFx = inject(SoundFxService);
  private readonly whatsapp = inject(WhatsAppService);

  readonly selectedImage = signal<string | null>(null);
  readonly isZooming = signal(false);
  readonly zoomOrigin = signal('50% 50%');
  readonly recentlyAdded = signal(false);

  readonly detail = computed(() => this.quickView.detail());
  readonly summary = computed(() => this.quickView.summary());

  readonly itemSku = computed(() => this.detail()?.sku || this.summary()?.sku || '');
  readonly itemTitle = computed(() => this.detail()?.title || this.summary()?.title || '');
  readonly itemBrand = computed(() => this.detail()?.brand.name || this.summary()?.brandName || 'DOCO');
  readonly itemCategory = computed(() => this.detail()?.category.name || this.summary()?.categoryName || 'ARCHIVE');
  readonly itemPrice = computed(() => this.detail()?.priceMxn || this.summary()?.priceMxn || 0);
  readonly itemSize = computed(() => this.detail()?.sizeLabel || this.summary()?.sizeLabel || 'OS');
  readonly itemEra = computed(() => {
    const era = this.detail()?.styleEra || this.summary()?.styleEra;
    return era ? formatEra(era) : 'ARCHIVE';
  });
  readonly itemCondition = computed(() => {
    const cond = this.detail()?.conditionGrade || this.summary()?.conditionGrade;
    return cond ? formatCondition(cond) : 'VINTAGE 9/10';
  });
  readonly itemMeasurements = computed(() => this.detail()?.measurements || null);
  readonly itemDescription = computed(() => this.detail()?.description || '');
  readonly itemPrimaryImage = computed(() => this.detail()?.images[0]?.imageUrl || this.summary()?.primaryImageUrl || null);
  readonly images = computed(() => this.detail()?.images || []);

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.quickView.isOpen()) {
      this.quickView.close();
    }
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) {
      this.quickView.close();
    }
  }

  selectImage(url: string): void {
    this.selectedImage.set(url);
    this.isZooming.set(false);
    this.soundFx.playClick();
  }

  onMouseMove(e: MouseEvent): void {
    const el = e.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    this.zoomOrigin.set(`${x}% ${y}%`);
    this.isZooming.set(true);
  }

  onMouseLeave(): void {
    this.isZooming.set(false);
  }

  toggleMobileZoom(): void {
    this.isZooming.update((v) => !v);
  }

  orderDirectWhatsApp(): void {
    const title = this.itemTitle();
    const sku = this.itemSku();
    const size = this.itemSize();
    const price = this.itemPrice();
    const url = this.whatsapp.generatePieceInquiryUrl(title, sku, size, price);
    this.whatsapp.openUrl(url);
    this.soundFx.playClick();
  }

  addToBag(): void {
    const sum = this.summary();
    if (!sum) return;
    this.cart.addItem(sum);
    this.recentlyAdded.set(true);
    this.soundFx.playChime();
    setTimeout(() => this.recentlyAdded.set(false), 2200);
  }

  formatMxn(val: number): string {
    return formatMxn(val);
  }
}
