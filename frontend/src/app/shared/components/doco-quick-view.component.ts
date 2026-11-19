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
    @if (quickView.isOpen()) {
      <div class="yeezy-view" role="dialog" aria-modal="true" [attr.aria-label]="itemTitle()">
        <!-- TOP MINIMAL NAV (< on left, bag on right) -->
        <header class="yeezy-view__top font-mono">
          <button
            type="button"
            class="yeezy-back-btn"
            (click)="quickView.close()"
            aria-label="Volver al catálogo"
            title="Volver"
          >
            <span class="back-arrow">‹</span>
          </button>

          <button
            type="button"
            class="yeezy-view-bag"
            (click)="openBag()"
            aria-label="Abrir bolsa"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span>({{ cart.itemCount() }})</span>
          </button>
        </header>

        <!-- MAIN STAGE (CAROUSEL WITH LEFT/RIGHT ARROWS) -->
        <main class="yeezy-view__stage">
          <div class="carousel-container">
            <!-- Left Arrow -->
            <button
              type="button"
              class="carousel-nav-btn carousel-nav-btn--prev"
              [disabled]="currentSlideIndex() === 0"
              (click)="prevSlide()"
              aria-label="Imagen anterior"
            >
              ‹
            </button>

            <!-- Image Viewport with Loupe Zoom -->
            <div
              class="image-viewport"
              [class.is-zooming]="isZooming()"
              (mousemove)="onMouseMove($event)"
              (mouseleave)="onMouseLeave()"
              (click)="toggleMobileZoom()"
            >
              @if (currentSlideUrl()) {
                <img
                  [src]="currentSlideUrl()"
                  [alt]="itemTitle()"
                  class="yeezy-slide-img"
                  (error)="onImgError($event)"
                  [style.transform-origin]="zoomOrigin()"
                  [style.transform]="isZooming() ? 'scale(2.2)' : 'scale(1)'"
                />
              } @else {
                <div class="slide-placeholder font-mono">DOCO ARCHIVE</div>
              }

              <!-- Tag indicator for current view type -->
              <span class="slide-type-tag font-mono">
                {{ slideLabel(currentSlideIndex()) }}
              </span>
            </div>

            <!-- Right Arrow -->
            <button
              type="button"
              class="carousel-nav-btn carousel-nav-btn--next"
              [disabled]="currentSlideIndex() >= slideList().length - 1"
              (click)="nextSlide()"
              aria-label="Siguiente imagen"
            >
              ›
            </button>
          </div>

          <!-- DOT INDICATORS (YEEZY EXACT STYLE) -->
          @if (slideList().length > 1) {
            <div class="carousel-dots font-mono" role="tablist">
              @for (slide of slideList(); track $index; let i = $index) {
                <button
                  type="button"
                  class="dot-btn"
                  [class.is-active]="currentSlideIndex() === i"
                  (click)="goToSlide(i)"
                  [attr.aria-label]="'Ver imagen ' + (i + 1)"
                >
                  •
                </button>
              }
            </div>
          }

          <!-- CENTERED SKU & PRICE (EXACT YEEZY REFERENCE: WJ-02) -->
          <div class="yeezy-info font-mono">
            <h1 class="yeezy-code">{{ yeezyCode() }}</h1>
            <div class="yeezy-subhead">
              <span>{{ itemTitle() }}</span>
              <span class="sep">·</span>
              <span class="price">{{ formatMxn(itemPrice()) }}</span>
            </div>
            <div class="yeezy-talla">
              <span>TALLA {{ itemSize() }}</span>
              <span class="sep">·</span>
              <span>1-OF-1 DISPONIBLE</span>
            </div>
          </div>

          <!-- ORDER ACTIONS (BLACK RECTANGLE BUTTON YEEZY STYLE) -->
          <div class="yeezy-order-box font-mono">
            <!-- Solid Black Button (Inverse in Dark Mode) -->
            <button
              type="button"
              class="yeezy-btn-add"
              [class.is-added]="recentlyAdded()"
              (click)="addToBag()"
            >
              {{ recentlyAdded() ? 'AGREGADA A LA BOLSA' : 'AGREGAR A LA BOLSA' }}
            </button>

            <!-- Direct WhatsApp Order Button -->
            <button
              type="button"
              class="yeezy-btn-wa"
              (click)="orderWhatsApp()"
            >
              <span>PEDIR POR WHATSAPP (CULIACÁN)</span>
              <span>↗</span>
            </button>

            <!-- Collapsible Information Link (Yeezy Style) -->
            <button
              type="button"
              class="yeezy-info-toggle"
              (click)="toggleInformation()"
            >
              INFORMATION {{ infoExpanded() ? '−' : '+' }}
            </button>

            @if (infoExpanded()) {
              <div class="yeezy-info-content">
                <div class="info-line">
                  <span class="info-k">MEDIDAS EXACTAS:</span>
                  <span class="info-v">{{ itemMeasurements() || 'Pecho 56cm · Largo 72cm' }}</span>
                </div>
                <div class="info-line">
                  <span class="info-k">ESTADO VINTAGE:</span>
                  <span class="info-v">{{ itemCondition() }}</span>
                </div>
                <div class="info-line">
                  <span class="info-k">ERA / ESTILO:</span>
                  <span class="info-v">{{ itemEra() }}</span>
                </div>
                <div class="info-line">
                  <span class="info-k">ENTREGA LOCAL:</span>
                  <span class="info-v">Entrega personal en Culiacán, Sinaloa</span>
                </div>
                <div class="info-line">
                  <span class="info-k">MÉTODOS DE PAGO:</span>
                  <span class="info-v">Efectivo al recibir, SPEI directo y depósito OXXO</span>
                </div>
                <div class="info-line">
                  <span class="info-k">APARTADOS:</span>
                  <span class="info-v">Aparta cualquier pieza con el 30% vía WhatsApp</span>
                </div>
                <div class="info-line">
                  <span class="info-k">WHATSAPP OFICIAL:</span>
                  <span class="info-v">+52 667 203 3174</span>
                </div>
              </div>
            }
          </div>
        </main>
      </div>
    }
  `,
  styles: [`
    .yeezy-view {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: var(--bg-void);
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      width: 100vw;
      min-height: 100vh;
      box-sizing: border-box;
      animation: yeezyFadeIn 0.2s cubic-bezier(0.2, 0.9, 0.3, 1);
    }

    @keyframes yeezyFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    /* TOP BAR WITH < AND BAG */
    .yeezy-view__top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 clamp(1.2rem, 3.5vw, 3rem);
      width: 100%;
      box-sizing: border-box;
      flex-shrink: 0;
    }

    .yeezy-back-btn {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      font-size: 2rem;
      line-height: 1;
      padding: 0.25rem 0.5rem 0.25rem 0;
      transition: opacity 0.15s ease;
    }

    .yeezy-back-btn:hover {
      opacity: 0.6;
    }

    .back-arrow {
      font-weight: 300;
    }

    .yeezy-view-bag {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      transition: opacity 0.15s ease;
    }

    .yeezy-view-bag:hover {
      opacity: 0.7;
    }

    /* MAIN STAGE */
    .yeezy-view__stage {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: flex-start;
      padding: 1rem clamp(1rem, 3vw, 2.5rem) 4rem;
      box-sizing: border-box;
      width: 100%;
      max-width: 900px;
      margin: 0 auto;
    }

    /* CAROUSEL */
    .carousel-container {
      position: relative;
      width: 100%;
      max-width: 580px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .carousel-nav-btn {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      font-size: 2.2rem;
      line-height: 1;
      padding: 1rem;
      user-select: none;
      transition: opacity 0.15s ease;
      z-index: 10;
    }

    .carousel-nav-btn:hover:not(:disabled) {
      opacity: 0.5;
    }

    .carousel-nav-btn:disabled {
      opacity: 0.15;
      cursor: default;
    }

    .image-viewport {
      position: relative;
      width: 100%;
      max-width: 480px;
      aspect-ratio: 4 / 5;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      cursor: crosshair;
      user-select: none;
    }

    .yeezy-slide-img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      transition: transform 0.14s cubic-bezier(0.2, 0.8, 0.4, 1);
      will-change: transform, transform-origin;
      pointer-events: none;
    }

    .slide-placeholder {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.12em;
    }

    .slide-type-tag {
      position: absolute;
      bottom: 6px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.62rem;
      letter-spacing: 0.1em;
      color: var(--text-dim);
      text-transform: uppercase;
      pointer-events: none;
    }

    /* DOTS (YEEZY STYLE: · · ·) */
    .carousel-dots {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.65rem;
      margin: 0.75rem 0 1.25rem;
    }

    .dot-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      font-size: 1.25rem;
      line-height: 1;
      padding: 0.2rem;
      transition: color 0.15s ease;
    }

    .dot-btn.is-active {
      color: var(--text-bone);
    }

    /* CENTERED SKU & TITLE (YEEZY WJ-02) */
    .yeezy-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 0.35rem;
      text-transform: uppercase;
      margin-bottom: 1.75rem;
    }

    .yeezy-code {
      font-size: 1.1rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      margin: 0;
      color: var(--text-bone);
    }

    .yeezy-subhead {
      font-size: 0.8rem;
      letter-spacing: 0.08em;
      color: var(--text-secondary);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .yeezy-talla {
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .sep {
      color: var(--text-dim);
    }

    .price {
      font-weight: 700;
      color: var(--text-bone);
    }

    /* ORDER BOX (YEEZY SUBSCRIBE RECTANGLE STYLE) */
    .yeezy-order-box {
      width: 100%;
      max-width: 440px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.85rem;
    }

    .yeezy-btn-add {
      width: 100%;
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      padding: 0.95rem 1.25rem;
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: opacity 0.15s ease;
      display: block;
      text-align: center;
    }

    .yeezy-btn-add:hover {
      opacity: 0.88;
    }

    .yeezy-btn-add.is-added {
      background: #10b981;
      border-color: #10b981;
      color: #ffffff;
    }

    .yeezy-btn-wa {
      width: 100%;
      background: transparent;
      color: var(--text-bone);
      border: 1px solid var(--border-strong);
      padding: 0.85rem 1.25rem;
      font-size: 0.78rem;
      font-weight: 600;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      transition: background 0.15s ease;
    }

    .yeezy-btn-wa:hover {
      background: var(--bg-surface);
    }

    /* COLLAPSIBLE INFORMATION */
    .yeezy-info-toggle {
      background: transparent;
      border: none;
      color: var(--text-bone);
      font-size: 0.75rem;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      cursor: pointer;
      padding: 0.5rem;
      margin-top: 0.5rem;
      transition: opacity 0.15s ease;
    }

    .yeezy-info-toggle:hover {
      opacity: 0.6;
    }

    .yeezy-info-content {
      width: 100%;
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-subtle);
      padding: 1rem 0;
      display: flex;
      flex-direction: column;
      gap: 0.55rem;
      font-size: 0.72rem;
      animation: infoFade 0.16s ease-out;
    }

    @keyframes infoFade {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .info-line {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .info-k {
      color: var(--text-dim);
      letter-spacing: 0.08em;
    }

    .info-v {
      color: var(--text-bone);
      text-align: right;
    }
  `]
})
export class DocoQuickViewComponent {
  readonly quickView = inject(QuickViewService);
  readonly cart = inject(CartService);
  private readonly soundFx = inject(SoundFxService);
  private readonly whatsapp = inject(WhatsAppService);

  readonly currentSlideIndex = signal(0);
  readonly isZooming = signal(false);
  readonly zoomOrigin = signal('50% 50%');
  readonly recentlyAdded = signal(false);
  readonly infoExpanded = signal(false);

  readonly detail = computed(() => this.quickView.detail());
  readonly summary = computed(() => this.quickView.summary());

  readonly itemSku = computed(() => this.detail()?.sku || this.summary()?.sku || '');
  readonly yeezyCode = computed(() => this.itemSku().replace('DOCO-ARC-', 'DOCO-'));
  readonly itemTitle = computed(() => this.detail()?.title || this.summary()?.title || '');
  readonly itemPrice = computed(() => this.detail()?.priceMxn || this.summary()?.priceMxn || 0);
  readonly itemSize = computed(() => this.detail()?.sizeLabel || this.summary()?.sizeLabel || 'OS');
  readonly itemEra = computed(() => {
    const era = this.detail()?.styleEra || this.summary()?.styleEra;
    return era ? formatEra(era) : 'Y2K / STREETWEAR';
  });
  readonly itemCondition = computed(() => {
    const cond = this.detail()?.conditionGrade || this.summary()?.conditionGrade;
    return cond ? formatCondition(cond) : 'VINTAGE 9/10';
  });
  readonly itemMeasurements = computed(() => this.detail()?.measurements || null);

  readonly slideList = computed(() => {
    const d = this.detail();
    const s = this.summary();
    const slides: { url: string; type: string }[] = [];

    // Primary cutout (or primary image)
    const prim = d?.images[0]?.imageUrl || s?.primaryImageUrl;
    if (prim) {
      const cutout = prim.replace('.webp', '_cutout.webp');
      slides.push({ url: cutout, type: 'PRENDA // FRENTE' });

      // Mannequin front
      const mFront = prim.replace('.webp', '_mannequin_front.webp');
      slides.push({ url: mFront, type: 'MANIQUÍ // FRENTE' });
    }

    // Secondary cutout / mannequin back
    const sec = d?.images[1]?.imageUrl || s?.secondaryImageUrl;
    if (sec) {
      const mBack = sec.replace('.webp', '_mannequin_back.webp');
      slides.push({ url: mBack, type: 'MANIQUÍ // ESPALDA' });

      const backCutout = sec.replace('.webp', '_cutout.webp');
      slides.push({ url: backCutout, type: 'PRENDA // ESPALDA' });
    }

    // Additional authentic photos (details, labels)
    if (d?.images) {
      d.images.slice(2).forEach((img, idx) => {
        slides.push({ url: img.imageUrl, type: `DETALLE 0${idx + 1}` });
      });
    }

    return slides.length ? slides : [{ url: prim || '', type: 'PRENDA' }];
  });

  readonly currentSlideUrl = computed(() => {
    const list = this.slideList();
    const idx = this.currentSlideIndex();
    return list[idx]?.url || list[0]?.url || '';
  });

  slideLabel(idx: number): string {
    const list = this.slideList();
    return list[idx]?.type || '';
  }

  @HostListener('window:keydown.escape')
  onEscape(): void {
    if (this.quickView.isOpen()) {
      this.quickView.close();
    }
  }

  @HostListener('window:keydown.arrowleft')
  onArrowLeft(): void {
    if (this.quickView.isOpen()) {
      this.prevSlide();
    }
  }

  @HostListener('window:keydown.arrowright')
  onArrowRight(): void {
    if (this.quickView.isOpen()) {
      this.nextSlide();
    }
  }

  prevSlide(): void {
    if (this.currentSlideIndex() > 0) {
      this.currentSlideIndex.update((i) => i - 1);
      this.isZooming.set(false);
      this.soundFx.playClick();
    }
  }

  nextSlide(): void {
    if (this.currentSlideIndex() < this.slideList().length - 1) {
      this.currentSlideIndex.update((i) => i + 1);
      this.isZooming.set(false);
      this.soundFx.playClick();
    }
  }

  goToSlide(i: number): void {
    this.currentSlideIndex.set(i);
    this.isZooming.set(false);
    this.soundFx.playClick();
  }

  onImgError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el) {
      if (el.src.includes('_cutout.webp')) {
        el.src = el.src.replace('_cutout.webp', '.webp');
      } else if (el.src.includes('_mannequin_front.webp')) {
        el.src = el.src.replace('_mannequin_front.webp', '.webp');
      } else if (el.src.includes('_mannequin_back.webp')) {
        el.src = el.src.replace('_mannequin_back.webp', '.webp');
      }
    }
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

  toggleInformation(): void {
    this.soundFx.playClick();
    this.infoExpanded.update((v) => !v);
  }

  addToBag(): void {
    const sum = this.summary();
    if (!sum) return;
    this.cart.addItem(sum);
    this.recentlyAdded.set(true);
    this.soundFx.playChime();
    setTimeout(() => this.recentlyAdded.set(false), 2000);
  }

  orderWhatsApp(): void {
    const title = this.itemTitle();
    const sku = this.itemSku();
    const size = this.itemSize();
    const price = this.itemPrice();
    const url = this.whatsapp.generatePieceInquiryUrl(title, sku, size, price);
    this.whatsapp.openUrl(url);
    this.soundFx.playClick();
  }

  openBag(): void {
    this.soundFx.playClick();
    this.cart.openDrawer();
  }

  formatMxn(val: number): string {
    return formatMxn(val);
  }
}
