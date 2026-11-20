import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  effect,
  inject,
  signal
} from '@angular/core';
import { ProductDetail, ProductSummary } from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatCondition, formatEra } from '../../core/utils/formatters';

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

            <!-- Image Viewport with Preloaded Slides, Touch Swipe & Zoom -->
            <div
              class="image-viewport"
              (touchstart)="onTouchStart($event)"
              (touchend)="onTouchEnd($event)"
              (click)="handleViewportClick()"
              [class.is-zoomed]="isZoomed()"
            >
              @for (slide of slideList(); track slide.url; let i = $index) {
                <img
                  [src]="slide.url"
                  [alt]="itemTitle() + ' - ' + slide.type"
                  class="yeezy-slide-img"
                  [class.is-active]="currentSlideIndex() === i"
                  (error)="onImgError($event)"
                  loading="eager"
                />
              }

              @if (slideList().length === 0) {
                <div class="slide-placeholder font-mono">DOCO ARCHIVE</div>
              }

              <!-- Tag indicator for current view type -->
              <span class="slide-type-tag font-mono">
                {{ slideLabel(currentSlideIndex()) }}
              </span>

              <!-- Subtle Zoom Toggle Button -->
              <button
                type="button"
                class="zoom-toggle-btn font-mono"
                (click)="$event.stopPropagation(); toggleZoom()"
                [attr.aria-label]="isZoomed() ? 'Alejar' : 'Acercar'"
              >
                {{ isZoomed() ? 'ZOOM [−]' : 'ZOOM [+]' }}
              </button>
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

          <!-- HORIZONTAL THUMBNAIL SELECTOR (STRICTLY LEFT TO RIGHT) -->
          @if (slideList().length > 1) {
            <div class="carousel-thumbs font-mono" role="tablist" aria-label="Vistas del artículo">
              @for (slide of slideList(); track slide.url; let i = $index) {
                <button
                  type="button"
                  class="thumb-pill"
                  [class.is-active]="currentSlideIndex() === i"
                  (click)="goToSlide(i)"
                  [attr.aria-label]="'Ver ' + slide.type"
                >
                  <img [src]="slide.url" [alt]="slide.type" class="thumb-mini-img" (error)="onImgError($event)" />
                  <span class="thumb-lbl">{{ slideShortLabel(slide, i) }}</span>
                </button>
              }
            </div>
          }

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

          <!-- CENTERED SKU & DETAILS (EXACT YEEZY REFERENCE: WJ-02) -->
          <div class="yeezy-info font-mono">
            <h1 class="yeezy-code">{{ yeezyCode() }}</h1>
            <div class="yeezy-subhead">
              <span>{{ itemTitle() }}</span>
            </div>
            <div class="yeezy-talla">
              <span>TALLA {{ itemSize() }}</span>
              <span class="sep">·</span>
              <span>1-OF-1 DISPONIBLE</span>
              <span class="sep">·</span>
              <span>PRECIO VÍA WHATSAPP</span>
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
              <span>CONSULTAR PRECIO POR WHATSAPP (CULIACÁN)</span>
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
      padding: 0.5rem clamp(1rem, 3vw, 2.5rem) 4rem;
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
      cursor: zoom-in;
      user-select: none;
      touch-action: pan-y;
    }

    .image-viewport.is-zoomed {
      cursor: zoom-out;
    }

    /* ALL SLIDES PRELOADED & STACKED IN DOM FOR 0-STUTTER INSTANT FLIP */
    .yeezy-slide-img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      opacity: 0;
      transition: opacity 0.2s cubic-bezier(0.2, 0.8, 0.4, 1), transform 0.25s cubic-bezier(0.2, 0.8, 0.4, 1);
      will-change: opacity, transform;
      pointer-events: none;
    }

    .yeezy-slide-img.is-active {
      opacity: 1;
      z-index: 2;
    }

    .image-viewport.is-zoomed .yeezy-slide-img.is-active {
      transform: scale(1.85);
    }

    .slide-placeholder {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.12em;
    }

    .slide-type-tag {
      position: absolute;
      bottom: 8px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      color: var(--text-dim);
      text-transform: uppercase;
      pointer-events: none;
      z-index: 5;
    }

    .zoom-toggle-btn {
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-dim);
      font-size: 0.58rem;
      letter-spacing: 0.1em;
      padding: 3px 6px;
      cursor: pointer;
      z-index: 6;
      transition: color 0.15s ease, border-color 0.15s ease;
    }

    .zoom-toggle-btn:hover {
      color: var(--text-bone);
      border-color: var(--text-bone);
    }

    /* HORIZONTAL THUMBNAILS (LTR STRIP) */
    .carousel-thumbs {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin: 0.75rem 0 0.5rem;
      flex-wrap: wrap;
      max-width: 100%;
    }

    .thumb-pill {
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-dim);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.25rem 0.55rem;
      font-size: 0.62rem;
      letter-spacing: 0.08em;
      transition: all 0.15s ease;
      user-select: none;
    }

    .thumb-pill:hover {
      border-color: var(--text-bone);
      color: var(--text-bone);
    }

    .thumb-pill.is-active {
      border-color: var(--text-bone);
      color: var(--text-bone);
      background: rgba(255, 255, 255, 0.08);
    }

    .thumb-mini-img {
      width: 22px;
      height: 22px;
      object-fit: contain;
      display: block;
    }

    .thumb-lbl {
      text-transform: uppercase;
      font-weight: 500;
    }

    /* DOTS (YEEZY STYLE: • • •) */
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
      font-size: 1.4rem;
      line-height: 1;
      padding: 0.2rem 0.35rem;
      transition: color 0.15s ease;
    }

    .dot-btn.is-active {
      color: var(--text-bone);
    }

    /* INFO BLOCK */
    .yeezy-info {
      text-align: center;
      margin-bottom: 1.5rem;
      width: 100%;
    }

    .yeezy-code {
      font-size: clamp(1rem, 2.5vw, 1.3rem);
      font-weight: 500;
      letter-spacing: 0.12em;
      margin: 0 0 0.35rem 0;
      color: var(--text-bone);
      text-transform: uppercase;
    }

    .yeezy-subhead {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.08em;
      margin-bottom: 0.4rem;
      text-transform: uppercase;
    }

    .yeezy-talla {
      font-size: 0.7rem;
      color: var(--text-dim);
      letter-spacing: 0.08em;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
    }

    .yeezy-talla .sep {
      color: var(--border-subtle);
    }

    /* ORDER BOX */
    .yeezy-order-box {
      width: 100%;
      max-width: 360px;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      align-items: stretch;
    }

    .yeezy-btn-add {
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      padding: 0.95rem 1.25rem;
      font-size: 0.75rem;
      font-weight: 600;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      transition: opacity 0.15s ease, background 0.15s ease;
      width: 100%;
    }

    .yeezy-btn-add:hover {
      opacity: 0.85;
    }

    .yeezy-btn-add.is-added {
      background: #555555;
      color: #ffffff;
      border-color: #555555;
    }

    .yeezy-btn-wa {
      background: transparent;
      color: var(--text-bone);
      border: 1px solid var(--border-subtle);
      padding: 0.85rem 1.25rem;
      font-size: 0.7rem;
      font-weight: 500;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: space-between;
      transition: border-color 0.15s ease, color 0.15s ease;
      width: 100%;
      box-sizing: border-box;
    }

    .yeezy-btn-wa:hover {
      border-color: var(--text-bone);
    }

    .yeezy-info-toggle {
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 0.7rem;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      cursor: pointer;
      padding: 0.5rem 0;
      text-align: center;
      margin-top: 0.25rem;
      transition: color 0.15s ease;
    }

    .yeezy-info-toggle:hover {
      color: var(--text-bone);
    }

    .yeezy-info-content {
      border-top: 1px solid var(--border-subtle);
      padding-top: 0.85rem;
      margin-top: 0.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      text-align: left;
    }

    .info-line {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.68rem;
      letter-spacing: 0.06em;
    }

    .info-k {
      color: var(--text-dim);
      font-weight: 500;
      flex-shrink: 0;
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
  readonly isZoomed = signal(false);
  readonly infoExpanded = signal(false);
  readonly recentlyAdded = signal(false);

  // Touch Swipe tracking
  private touchStartX = 0;
  private touchStartY = 0;

  constructor() {
    // Reset slide, zoom, and info every time a product is opened
    effect(() => {
      if (this.quickView.isOpen()) {
        this.currentSlideIndex.set(0);
        this.isZoomed.set(false);
        this.infoExpanded.set(false);
      }
    }, { allowSignalWrites: true });
  }

  readonly summary = computed<ProductSummary | null>(() => this.quickView.summary());
  readonly detail = computed<ProductDetail | null>(() => this.quickView.detail());

  readonly yeezyCode = computed(() => {
    const s = this.summary();
    if (!s) return 'DOCO-ARC';
    return s.sku.replace('DOCO-ARC-', 'DOCO-');
  });

  readonly itemTitle = computed(() => this.summary()?.title || '');
  readonly itemSize = computed(() => this.summary()?.sizeLabel || 'UNISIZE');
  readonly itemCondition = computed(() => {
    const d = this.detail();
    const s = this.summary();
    const grade = d?.conditionGrade || s?.conditionGrade || 'MINT_9_10';
    return formatCondition(grade);
  });
  readonly itemEra = computed(() => {
    const d = this.detail();
    const s = this.summary();
    const era = d?.styleEra || s?.styleEra || 'Y2K';
    return formatEra(era);
  });
  readonly itemMeasurements = computed(() => this.detail()?.measurements || '');

  // PURE GARMENT SLIDES: FRONT & BACK USE TRANSPARENT CUTOUTS, ALL DETAILS USE PRISTINE ORIGINAL PHOTOS
  readonly slideList = computed<{ url: string; type: string }[]>(() => {
    const d = this.detail();
    const s = this.summary();
    const slides: { url: string; type: string }[] = [];

    const normalizeBase = (url: string) =>
      url
        .replace('_cutout.webp', '')
        .replace('_mannequin_front.webp', '')
        .replace('_mannequin_back.webp', '')
        .replace('.webp', '');

    const images = d?.images || [];

    if (images.length > 0) {
      // 1. FRONT (Always first in LTR sequence)
      const prim = images[0];
      const primUrl = prim.imageUrl.includes('_cutout.webp')
        ? prim.imageUrl
        : `${normalizeBase(prim.imageUrl)}_cutout.webp`;
      slides.push({ url: primUrl, type: 'PRENDA // FRENTE' });

      // 2. BACK (If an explicit back view exists)
      const back = images.find((img) => img.altText?.toLowerCase().includes('espalda'));
      if (back && normalizeBase(back.imageUrl) !== normalizeBase(prim.imageUrl)) {
        const backUrl = back.imageUrl.includes('_cutout.webp')
          ? back.imageUrl
          : `${normalizeBase(back.imageUrl)}_cutout.webp`;
        slides.push({ url: backUrl, type: 'PRENDA // ESPALDA' });
      }

      // 3. DETAILS: Transparent cutout photos with zero wooden table background
      images.forEach((img, idx) => {
        const b = normalizeBase(img.imageUrl);
        if (slides.some((sl) => normalizeBase(sl.url) === b)) return;
        const detailUrl = img.imageUrl.includes('_cutout.webp')
          ? img.imageUrl
          : `${b}_cutout.webp`;
        slides.push({
          url: detailUrl,
          type: img.altText ? img.altText.toUpperCase() : `DETALLE 0${idx + 1}`
        });
      });
    } else {
      const prim = s?.primaryImageUrl;
      if (prim) {
        slides.push({
          url: prim.includes('_cutout.webp') ? prim : `${normalizeBase(prim)}_cutout.webp`,
          type: 'PRENDA // FRENTE'
        });
      }
      const sec = s?.secondaryImageUrl;
      if (sec && normalizeBase(sec) !== (prim ? normalizeBase(prim) : '')) {
        slides.push({
          url: sec.includes('_cutout.webp') ? sec : `${normalizeBase(sec)}_cutout.webp`,
          type: 'PRENDA // ESPALDA'
        });
      }
    }

    return slides.length
      ? slides
      : [{ url: '/assets/archive/img_5487_2_cutout.webp', type: 'PRENDA // FRENTE' }];
  });

  slideLabel(idx: number): string {
    const list = this.slideList();
    return list[idx]?.type || '';
  }

  slideShortLabel(slide: { url: string; type: string }, i: number): string {
    if (slide.type.includes('FRENTE')) return 'FRENTE';
    if (slide.type.includes('ESPALDA')) return 'ESPALDA';
    return `DETALLE 0${i + 1}`;
  }

  handleViewportClick(): void {
    if (this.isZoomed()) {
      this.isZoomed.set(false);
      return;
    }
    const total = this.slideList().length;
    if (total <= 1) return;
    const next = (this.currentSlideIndex() + 1) % total;
    this.goToSlide(next);
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
      this.isZoomed.set(false);
      this.soundFx.playClick();
    }
  }

  nextSlide(): void {
    if (this.currentSlideIndex() < this.slideList().length - 1) {
      this.currentSlideIndex.update((i) => i + 1);
      this.isZoomed.set(false);
      this.soundFx.playClick();
    }
  }

  goToSlide(i: number): void {
    this.currentSlideIndex.set(i);
    this.isZoomed.set(false);
    this.soundFx.playClick();
  }

  toggleZoom(): void {
    this.isZoomed.update((v) => !v);
  }

  onTouchStart(e: TouchEvent): void {
    if (e.touches.length === 1) {
      this.touchStartX = e.touches[0].clientX;
      this.touchStartY = e.touches[0].clientY;
    }
  }

  onTouchEnd(e: TouchEvent): void {
    if (e.changedTouches.length === 1) {
      const deltaX = e.changedTouches[0].clientX - this.touchStartX;
      const deltaY = e.changedTouches[0].clientY - this.touchStartY;
      // If horizontal swipe is dominant and exceeds threshold
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
        if (deltaX < 0) {
          this.nextSlide();
        } else {
          this.prevSlide();
        }
      }
    }
  }

  onImgError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el && el.src.includes('_cutout.webp')) {
      el.src = el.src.replace('_cutout.webp', '.webp');
    }
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
    const sum = this.summary();
    if (!sum) return;
    const url = this.whatsapp.generatePieceInquiryUrl(sum.title, sum.sku, sum.sizeLabel);
    this.soundFx.playClick();
    window.open(url, '_blank', 'noopener,noreferrer');
  }

  openBag(): void {
    this.soundFx.playClick();
    this.quickView.close();
    this.cart.openDrawer();
  }
}
