import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductDetail, ProductSummary } from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { getFallbackProductBySlug } from '../../core/services/catalog.fallback.data';
import { CatalogService } from '../../core/services/catalog.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatCondition, formatEra, formatMxn } from '../../core/utils/formatters';
import { DocoBadgeComponent } from '../../shared/components/doco-badge.component';
import { DocoStateViewComponent } from '../../shared/components/doco-state-view.component';

@Component({
  selector: 'doco-product-detail-page',
  standalone: true,
  imports: [RouterLink, DocoBadgeComponent, DocoStateViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="doco-container detail-wrap">
      <nav class="detail-nav font-mono">
        <a routerLink="/" class="back-link">‹ VOLVER AL ARCHIVO</a>
        <span class="detail-path">// {{ piece()?.category?.name || 'ARCHIVO' }} // {{ piece()?.sku || '' }}</span>
      </nav>

      @if (loading()) {
        <doco-state-view mode="loading" />
      } @else if (error()) {
        <doco-state-view mode="error" [message]="error()" (retry)="loadPiece()" />
      } @else if (piece(); as item) {
        <div class="detail-grid">
          <!-- GALLERY WITH LOUPE ZOOM -->
          <div class="gallery">
            <div
              class="gallery__main"
              [class.is-zooming]="zoomActive()"
              (mousemove)="onImageMouseMove($event)"
              (mouseleave)="zoomActive.set(false)"
              (click)="openLightbox()"
              role="button"
              tabindex="0"
              aria-label="Hacer zoom en los detalles de la prenda"
            >
              <img
                [src]="activeImageUrl() || '/assets/brand/doco-logo-light.png'"
                [alt]="item.title"
                [style.transformOrigin]="zoomOrigin()"
                [style.transform]="zoomActive() ? 'scale(2.3)' : 'scale(1)'"
              />
              <span class="zoom-hud font-mono">
                {{ zoomActive() ? 'LOUPE ÓPTICO 2.3X // CLICK PARA PANTALLA COMPLETA' : 'PASA EL CURSOR O TOCA PARA ZOOM EN TEJIDO' }}
              </span>
            </div>

            @if (item.images.length > 1) {
              <div class="gallery__thumbs">
                @for (img of item.images; track img.imageUrl) {
                  <button
                    type="button"
                    class="thumb"
                    [class.is-active]="activeImageUrl() === img.imageUrl"
                    (click)="selectImage(img.imageUrl)"
                  >
                    <img [src]="img.imageUrl" [alt]="img.altText || item.title" />
                  </button>
                }
              </div>
            }

            <div class="archival-authenticity font-mono">
              <span class="auth-icon">::</span>
              <span>INSPECCIÓN FÍSICA // CULIACÁN, SIN // COSTURAS & ETIQUETAS ORIGINALES</span>
            </div>
          </div>

          <!-- SPECS & ACTIONS -->
          <div class="specs">
            <div class="specs__badges">
              @if (item.dropTag) {
                <doco-badge tone="crimson">{{ item.dropTag }}</doco-badge>
              }
              <doco-badge tone="chrome">{{ formatEra(item.styleEra) }}</doco-badge>
              <doco-badge tone="dark">{{ formatCondition(item.conditionGrade) }}</doco-badge>
            </div>

            <span class="font-mono specs__sku">SKU: {{ item.sku }} · {{ item.brand.name }}</span>
            <h1 class="font-display specs__title">{{ item.title }}</h1>

            <div class="specs__price-row font-mono">
              <span class="specs__price">{{ formatMxn(item.priceMxn) }}</span>
              @if (item.compareAtPriceMxn) {
                <span class="specs__compare">{{ formatMxn(item.compareAtPriceMxn) }}</span>
              }
              <span class="specs__tax-tag">MXN · ENTREGA EN CULIACÁN</span>
            </div>

            <p class="specs__desc">{{ item.description }}</p>

            <div class="specs__table font-mono">
              <div><span>TALLA</span><strong>{{ item.sizeLabel }}</strong></div>
              <div><span>MEDIDAS EXACTAS</span><strong>{{ item.measurements || 'Verificadas por DOCO Vault' }}</strong></div>
              <div><span>CATEGORÍA</span><strong>{{ item.category.name }}</strong></div>
              <div><span>ERA / ESTILO</span><strong>{{ formatEra(item.styleEra) }}</strong></div>
              <div>
                <span>DISPONIBILIDAD</span>
                <strong [class.stock-warn]="item.stock === 1">
                  {{ item.stock > 0 ? (item.stock === 1 ? '¡Última pieza 1-of-1 disponible!' : item.stock + ' pzas en bóveda') : 'AGOTADO' }}
                </strong>
              </div>
            </div>

            <!-- PRIMARY BUY ACTIONS: WHATSAPP DIRECT + CART -->
            <div class="action-stack">
              <button
                type="button"
                class="wa-direct-btn font-mono"
                [disabled]="item.stock === 0"
                (click)="orderDirectViaWa(item)"
              >
                <span class="wa-icon">
                  <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
                  </svg>
                </span>
                <span class="wa-btn-copy">
                  <strong>PEDIR POR WHATSAPP</strong>
                  <small>Apartado Inmediato · Culiacán, Sin.</small>
                </span>
                <span class="wa-arrow">↗</span>
              </button>

              <button
                type="button"
                class="add-bag-btn font-mono"
                [disabled]="item.stock === 0"
                (click)="addToBag(item)"
              >
                {{ item.stock === 0 ? 'PIEZA AGOTADA' : '+ AGREGAR A LA BOLSA' }}
              </button>
            </div>

            <div class="trust-pill-grid font-mono">
              <div>
                <strong>ENTREGA LOCAL</strong>
                <span>Culiacán, Sinaloa directa</span>
              </div>
              <div>
                <strong>PAGOS PROTEGIDOS</strong>
                <span>SPEI directo / OXXO / Efectivo</span>
              </div>
              <div>
                <strong>ATENCIÓN PERSONAL</strong>
                <span>Apartado inmediato en Culiacán</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Sticky Mobile Bottom Buy Bar -->
        <div class="mobile-buy-bar">
          <div class="mobile-buy-bar__price font-mono">
            <small>{{ item.sizeLabel }} · {{ item.brand.name }}</small>
            <strong>{{ formatMxn(item.priceMxn) }}</strong>
          </div>
          <div class="mobile-buy-bar__buttons">
            <button
              type="button"
              class="mobile-wa-btn font-mono"
              [disabled]="item.stock === 0"
              (click)="orderDirectViaWa(item)"
            >
              WHATSAPP
            </button>
            <button
              type="button"
              class="mobile-add-btn font-mono"
              [disabled]="item.stock === 0"
              (click)="addToBag(item)"
            >
              {{ item.stock === 0 ? 'AGOTADO' : '+ BOLSA' }}
            </button>
          </div>
        </div>

        <!-- Fullscreen Lightbox Modal with Tap Zoom -->
        @if (lightboxOpen()) {
          <div class="lightbox" role="dialog" aria-modal="true" aria-label="Vista ampliada de la prenda" (click)="lightboxOpen.set(false)">
            <div class="lightbox__toolbar font-mono" (click)="$event.stopPropagation()">
              <span>{{ item.sku }} // INSPECCIÓN EN ALTA RESOLUCIÓN</span>
              <div class="lightbox__btns">
                <button type="button" (click)="toggleLightboxScale()">
                  {{ lightboxScale() === 1 ? 'ZOOM 2X' : 'ZOOM 1X' }}
                </button>
                <button type="button" (click)="lightboxOpen.set(false)">CERRAR [X]</button>
              </div>
            </div>
            <div class="lightbox__stage" (click)="$event.stopPropagation()">
              <img
                [src]="activeImageUrl()"
                [alt]="item.title"
                [style.transform]="'scale(' + lightboxScale() + ')'"
                (click)="toggleLightboxScale()"
              />
            </div>
          </div>
        }
      }
    </section>
  `,
  styles: [`
    .detail-wrap {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      padding-top: 2rem;
      padding-bottom: 5rem;
    }
    .detail-nav {
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      font-size: 0.74rem;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .back-link {
      color: var(--text-muted);
      letter-spacing: 0.1em;
      transition: color 0.18s;
    }
    .back-link:hover {
      color: var(--text-bone);
    }
    .detail-path {
      color: var(--text-dim);
      font-size: 0.68rem;
    }
    .detail-grid {
      display: grid;
      grid-template-columns: 1.05fr 1fr;
      gap: 3rem;
      align-items: start;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }
    .gallery__main {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1 / 1;
      background: var(--bg-media);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
      overflow: hidden;
      cursor: zoom-in;
      padding: 1.25rem;
    }
    .gallery__main.is-zooming {
      cursor: crosshair;
    }
    .gallery__main img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
      transition: transform 0.15s ease-out;
      will-change: transform;
    }
    .zoom-hud {
      position: absolute;
      left: 0.85rem;
      right: 0.85rem;
      bottom: 0.85rem;
      padding: 0.45rem 0.75rem;
      background: rgba(9, 9, 11, 0.85);
      color: #f5f3ee;
      border: 1px solid rgba(245, 243, 238, 0.25);
      border-radius: var(--radius-sharp);
      font-size: 0.66rem;
      text-align: center;
      letter-spacing: 0.08em;
      pointer-events: none;
    }
    .gallery__thumbs {
      display: flex;
      gap: 0.75rem;
      margin-top: 0.85rem;
    }
    .thumb {
      cursor: pointer;
      width: 68px;
      height: 68px;
      padding: 0.25rem;
      border: 1px solid var(--border-subtle);
      background: var(--bg-media);
      overflow: hidden;
      border-radius: var(--radius-sharp);
      transition: border-color 0.18s;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .thumb.is-active {
      border-color: var(--text-bone);
      border-width: 2px;
    }
    .thumb img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
    .archival-authenticity {
      margin-top: 1rem;
      padding: 0.65rem 0.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      color: var(--text-muted);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .auth-icon {
      color: var(--accent-emerald);
      font-weight: 800;
    }
    .specs__badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 0.95rem;
    }
    .specs__sku {
      display: block;
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.12em;
    }
    .specs__title {
      margin: 0.45rem 0 1rem;
      font-size: clamp(1.7rem, 3.2vw, 2.6rem);
      line-height: 1.08;
      font-weight: 800;
    }
    .specs__price-row {
      display: flex;
      align-items: baseline;
      gap: 0.85rem;
      margin-bottom: 1.5rem;
      flex-wrap: wrap;
    }
    .specs__price {
      font-size: 1.6rem;
      font-weight: 800;
      color: var(--text-bone);
    }
    .specs__compare {
      font-size: 0.95rem;
      color: var(--text-dim);
      text-decoration: line-through;
    }
    .specs__tax-tag {
      font-size: 0.68rem;
      color: var(--text-muted);
    }
    .specs__desc {
      color: var(--text-muted);
      line-height: 1.55;
      margin-bottom: 1.75rem;
      font-size: 0.92rem;
    }
    .specs__table {
      display: flex;
      flex-direction: column;
      border-top: 1px solid var(--border-subtle);
      margin-bottom: 1.75rem;
    }
    .specs__table > div {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.78rem 0;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.78rem;
    }
    .specs__table span {
      color: var(--text-muted);
    }
    .stock-warn {
      color: var(--accent-crimson);
    }
    .action-stack {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-bottom: 1.75rem;
    }
    .wa-direct-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.95rem 1.25rem;
      background: #25d366;
      color: #04240f;
      border: none;
      border-radius: var(--radius-sharp);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
      transition: transform 0.18s, box-shadow 0.18s;
      text-align: left;
    }
    .wa-direct-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(37, 211, 102, 0.5);
    }
    .wa-direct-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      box-shadow: none;
    }
    .wa-bolt {
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .wa-btn-copy {
      display: flex;
      flex-direction: column;
      flex: 1;
      line-height: 1.15;
    }
    .wa-btn-copy strong {
      font-size: 0.84rem;
      letter-spacing: 0.06em;
    }
    .wa-btn-copy small {
      font-size: 0.68rem;
      opacity: 0.88;
    }
    .wa-arrow {
      font-size: 1.1rem;
      font-weight: 800;
    }
    .add-bag-btn {
      width: 100%;
      cursor: pointer;
      padding: 0.95rem 1.4rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: none;
      border-radius: var(--radius-sharp);
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      transition: transform 0.18s;
    }
    .add-bag-btn:hover:not(:disabled) {
      transform: translateY(-2px);
    }
    .add-bag-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
    }
    .trust-pill-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.65rem;
      padding: 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
    }
    .trust-pill-grid > div {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .trust-pill-grid strong {
      color: var(--text-bone);
    }
    .trust-pill-grid span {
      color: var(--text-muted);
      font-size: 0.62rem;
    }
    .mobile-buy-bar {
      display: none;
    }
    .lightbox {
      position: fixed;
      inset: 0;
      z-index: 300;
      background: rgba(5, 5, 7, 0.95);
      display: flex;
      flex-direction: column;
      animation: fade-in 0.2s ease-out;
    }
    .lightbox__toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem 1.25rem;
      color: #f5f3ee;
      border-bottom: 1px solid rgba(245, 243, 238, 0.15);
      font-size: 0.75rem;
    }
    .lightbox__btns {
      display: flex;
      gap: 0.6rem;
    }
    .lightbox__btns button {
      cursor: pointer;
      padding: 0.45rem 0.85rem;
      background: #18181f;
      color: #f5f3ee;
      border: 1px solid rgba(245, 243, 238, 0.3);
      border-radius: var(--radius-sharp);
    }
    .lightbox__stage {
      flex: 1;
      overflow: auto;
      display: grid;
      place-items: center;
      padding: 1rem;
    }
    .lightbox__stage img {
      max-height: 82vh;
      max-width: 92vw;
      object-fit: contain;
      cursor: zoom-in;
      transition: transform 0.25s var(--ease-kinetic);
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @media (max-width: 860px) {
      .detail-wrap {
        padding-top: 1rem;
        padding-bottom: 7.5rem;
      }
      .detail-grid {
        grid-template-columns: 1fr;
        gap: 1.25rem;
      }
      .zoom-hud {
        display: none !important;
      }
      .specs__title {
        font-size: clamp(1.4rem, 6vw, 1.85rem);
        margin: 0.35rem 0 0.65rem;
      }
      .specs__price {
        font-size: 1.35rem;
      }
      .specs__price-row {
        margin-bottom: 0.85rem;
      }
      .action-stack {
        display: none;
      }
      .specs__table {
        margin-bottom: 1.25rem;
      }
      .specs__table > div {
        padding: 0.6rem 0;
        font-size: 0.74rem;
      }
      .trust-pill-grid {
        grid-template-columns: 1fr;
      }
      .mobile-buy-bar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 190;
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 0.75rem;
        padding: 0.75rem 1rem max(0.75rem, env(safe-area-inset-bottom));
        background: var(--bg-surface);
        border-top: 1px solid var(--border-strong);
        box-shadow: 0 -8px 25px rgba(0, 0, 0, 0.45);
      }
      .mobile-buy-bar__price {
        display: flex;
        flex-direction: column;
        line-height: 1.15;
      }
      .mobile-buy-bar__price small {
        font-size: 0.64rem;
        color: var(--text-muted);
      }
      .mobile-buy-bar__price strong {
        font-size: 0.95rem;
      }
      .mobile-buy-bar__buttons {
        display: flex;
        gap: 0.45rem;
      }
      .mobile-wa-btn {
        cursor: pointer;
        padding: 0.75rem 0.9rem;
        background: #25d366;
        color: #04240f;
        border: none;
        font-size: 0.75rem;
        font-weight: 800;
        border-radius: var(--radius-sharp);
      }
      .mobile-add-btn {
        cursor: pointer;
        padding: 0.75rem 1.15rem;
        background: var(--text-bone);
        color: var(--bg-void);
        border: none;
        font-size: 0.75rem;
        font-weight: 700;
        border-radius: var(--radius-sharp);
      }
    }
  `]
})
export class ProductDetailPageComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly catalogService = inject(CatalogService);
  private readonly cart = inject(CartService);
  private readonly soundFx = inject(SoundFxService);
  protected readonly whatsapp = inject(WhatsAppService);

  protected readonly piece = signal<ProductDetail | null>(null);
  protected readonly activeImageUrl = signal<string>('');
  protected readonly loading = signal(true);
  protected readonly error = signal('');

  protected readonly zoomActive = signal(false);
  protected readonly zoomOrigin = signal('50% 50%');
  protected readonly lightboxOpen = signal(false);
  protected readonly lightboxScale = signal(1);

  protected readonly formatMxn = formatMxn;
  protected readonly formatEra = formatEra;
  protected readonly formatCondition = formatCondition;

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => this.loadPiece());
  }

  protected onImageMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    this.zoomOrigin.set(`${x.toFixed(1)}% ${y.toFixed(1)}%`);
    this.zoomActive.set(true);
  }

  protected selectImage(url: string): void {
    this.soundFx.playClick();
    this.activeImageUrl.set(url);
  }

  protected openLightbox(): void {
    this.soundFx.playClick();
    this.lightboxScale.set(1);
    this.lightboxOpen.set(true);
  }

  protected toggleLightboxScale(): void {
    this.soundFx.playClick();
    this.lightboxScale.update((s) => (s === 1 ? 2 : 1));
  }

  protected loadPiece(): void {
    const slug = this.route.snapshot.paramMap.get('slug') ?? '';
    const cached = getFallbackProductBySlug(slug);
    if (cached) {
      this.piece.set(cached);
      this.activeImageUrl.set(cached.images[0]?.imageUrl ?? '');
      this.loading.set(false);
    } else {
      this.loading.set(true);
    }
    this.error.set('');
    this.catalogService.getProductBySlug(slug).subscribe({
      next: (item) => {
        this.piece.set(item);
        this.activeImageUrl.set(item.images[0]?.imageUrl ?? '');
        this.loading.set(false);
      },
      error: (err) => {
        if (!this.piece()) {
          this.error.set(err?.message || 'No se encontró la prenda.');
          this.loading.set(false);
        }
      }
    });
  }

  protected orderDirectViaWa(item: ProductDetail): void {
    this.soundFx.playVault();
    const url = this.whatsapp.generatePieceInquiryUrl(item.title, item.sku, item.sizeLabel, item.priceMxn);
    this.whatsapp.openUrl(url);
  }

  protected addToBag(item: ProductDetail): void {
    const summary: ProductSummary = {
      id: item.id,
      sku: item.sku,
      title: item.title,
      slug: item.slug,
      priceMxn: item.priceMxn,
      compareAtPriceMxn: item.compareAtPriceMxn,
      sizeLabel: item.sizeLabel,
      styleEra: item.styleEra,
      conditionGrade: item.conditionGrade,
      stock: item.stock,
      dropTag: item.dropTag,
      featured: item.featured,
      categoryName: item.category.name,
      categorySlug: item.category.slug,
      brandName: item.brand.name,
      brandSlug: item.brand.slug,
      primaryImageUrl: item.images[0]?.imageUrl ?? null
    };
    this.cart.addItem(summary, 1);
  }
}
