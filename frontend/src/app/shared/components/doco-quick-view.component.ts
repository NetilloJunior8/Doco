import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  computed,
  inject,
  signal
} from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatCondition, formatEra, formatMxn } from '../../core/utils/formatters';
import { DocoBadgeComponent } from './doco-badge.component';

@Component({
  selector: 'doco-quick-view',
  standalone: true,
  imports: [DocoBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (quickView.isOpen() && quickView.product(); as item) {
      <div class="qv-backdrop" (click)="quickView.close()" aria-hidden="true"></div>

      <div class="qv-dialog" role="dialog" aria-modal="true" [attr.aria-label]="item.title">
        <header class="qv-head font-mono">
          <div class="qv-head__meta">
            <span class="qv-tag">// INSPECCIÓN DE ARCHIVO</span>
            <span class="qv-sku">{{ item.sku }}</span>
          </div>
          <button
            type="button"
            class="qv-close font-mono"
            (click)="quickView.close()"
            aria-label="Cerrar vista rápida"
          >
            ✕ ESC
          </button>
        </header>

        <div class="qv-body">
          <!-- Image column with hover zoom -->
          <div class="qv-media" (click)="navigateToProduct(item.slug)">
            @if (item.primaryImageUrl) {
              <img
                [src]="item.primaryImageUrl"
                [alt]="item.title"
                class="qv-img"
              />
            } @else {
              <div class="qv-placeholder font-mono">DOCO VAULT</div>
            }
            <div class="qv-media-overlay font-mono">
              <span>CLICK PARA VER FICHA COMPLETA ↗</span>
            </div>
            <span class="qv-size font-mono">TALLA {{ item.sizeLabel }}</span>
          </div>

          <!-- Specs & actions column -->
          <div class="qv-details">
            <div class="qv-badges">
              @if (item.dropTag) {
                <doco-badge tone="crimson">{{ item.dropTag }}</doco-badge>
              }
              <doco-badge tone="chrome">{{ formatEra(item.styleEra) }}</doco-badge>
              <doco-badge tone="dark">{{ formatCondition(item.conditionGrade) }}</doco-badge>
            </div>

            <span class="qv-brand font-mono">{{ item.brandName }} // {{ item.categoryName }}</span>
            <h2 class="qv-title font-display">{{ item.title }}</h2>

            <div class="qv-prices font-mono">
              <span class="qv-price">{{ formatMxn(item.priceMxn) }}</span>
              @if (item.compareAtPriceMxn) {
                <span class="qv-compare">{{ formatMxn(item.compareAtPriceMxn) }}</span>
              }
              <span class="qv-location-tag">ENTREGA LOCAL CULIACÁN, SIN</span>
            </div>

            <!-- Condition Metric Bar -->
            <div class="qv-condition-box font-mono">
              <div class="cond-header">
                <span>ESTADO DE CONSERVACIÓN:</span>
                <strong>{{ conditionRating(item.conditionGrade) }} / 10 · VINTAGE REAL</strong>
              </div>
              <div class="cond-bar-track">
                <div class="cond-bar-fill" [style.width.%]="conditionPercent(item.conditionGrade)"></div>
              </div>
            </div>

            <!-- Telemetry Spec Grid -->
            <div class="qv-spec-grid font-mono">
              <div class="qv-spec-item">
                <span class="k">TALLA</span>
                <strong class="v">{{ item.sizeLabel }}</strong>
              </div>
              <div class="qv-spec-item">
                <span class="k">INVENTARIO</span>
                <strong class="v" [class.v--warn]="item.stock === 1">
                  {{ item.stock > 0 ? (item.stock === 1 ? '1-OF-1 DISPONIBLE' : item.stock + ' EN BÓVEDA') : 'AGOTADO' }}
                </strong>
              </div>
              <div class="qv-spec-item">
                <span class="k">ZONA</span>
                <strong class="v">CULIACÁN, SINALOA</strong>
              </div>
              <div class="qv-spec-item">
                <span class="k">PAGO</span>
                <strong class="v">SPEI / OXXO / EFECTIVO</strong>
              </div>
            </div>

            <!-- Primary Action Buttons -->
            <div class="qv-actions font-mono">
              <button
                type="button"
                class="btn-add-bag"
                [disabled]="item.stock === 0"
                [class.btn-add-bag--success]="addedRecently()"
                (click)="handleAddToBag(item)"
              >
                {{ addedRecently() ? '¡AGREGADO A TU BOLSA!' : (item.stock === 0 ? 'PIEZA AGOTADA' : '+ AGREGAR A LA BOLSA') }}
              </button>

              <button
                type="button"
                class="btn-wa-order"
                [disabled]="item.stock === 0"
                (click)="orderDirectViaWa(item)"
              >
                <span class="wa-icon">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                    <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
                  </svg>
                </span>
                <span>PEDIR POR WHATSAPP ↗</span>
              </button>
            </div>

            <div class="qv-footer-links font-mono">
              <button type="button" class="view-detail-btn" (click)="navigateToProduct(item.slug)">
                VER FICHA COMPLETA CON ZOOM ÓPTICO 2.3X →
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .qv-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(4, 4, 6, 0.78);
      backdrop-filter: blur(10px);
      z-index: 400;
      animation: fadeIn 0.2s ease-out;
    }
    .qv-dialog {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: min(880px, calc(100vw - 2rem));
      max-height: calc(100vh - 3rem);
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-card);
      box-shadow: 0 24px 60px rgba(0, 0, 0, 0.65);
      z-index: 401;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: scaleIn 0.24s var(--ease-kinetic);
    }
    .qv-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 1.25rem;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-void);
    }
    .qv-head__meta {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      font-size: 0.74rem;
    }
    .qv-tag {
      color: var(--accent-crimson);
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    .qv-sku {
      color: var(--text-dim);
    }
    .qv-close {
      cursor: pointer;
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-bone);
      padding: 0.35rem 0.65rem;
      font-size: 0.7rem;
      border-radius: var(--radius-sharp);
      transition: all 0.16s ease;
    }
    .qv-close:hover {
      border-color: var(--text-bone);
      background: var(--text-bone);
      color: var(--bg-void);
    }
    .qv-body {
      display: grid;
      grid-template-columns: 1fr 1.2fr;
      overflow-y: auto;
      max-height: calc(100vh - 7.5rem);
    }
    .qv-media {
      position: relative;
      cursor: pointer;
      background: var(--bg-media);
      overflow: hidden;
      aspect-ratio: 4 / 5;
    }
    .qv-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s var(--ease-kinetic);
    }
    .qv-media:hover .qv-img {
      transform: scale(1.05);
    }
    .qv-media-overlay {
      position: absolute;
      inset: auto 0.75rem 0.75rem;
      background: rgba(9, 9, 11, 0.82);
      border: 1px solid rgba(245, 243, 238, 0.25);
      backdrop-filter: blur(8px);
      color: #f5f3ee;
      padding: 0.45rem 0.65rem;
      text-align: center;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      border-radius: var(--radius-sharp);
      opacity: 0;
      transform: translateY(6px);
      transition: all 0.22s var(--ease-kinetic);
    }
    .qv-media:hover .qv-media-overlay {
      opacity: 1;
      transform: translateY(0);
    }
    .qv-size {
      position: absolute;
      top: 0.75rem;
      right: 0.75rem;
      background: var(--text-bone);
      color: var(--bg-void);
      font-size: 0.68rem;
      font-weight: 700;
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sharp);
    }
    .qv-placeholder {
      display: grid;
      place-items: center;
      height: 100%;
      color: var(--text-dim);
      font-size: 0.85rem;
    }
    .qv-details {
      padding: 1.5rem 1.65rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .qv-badges {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }
    .qv-brand {
      font-size: 0.74rem;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      text-transform: uppercase;
    }
    .qv-title {
      margin: 0;
      font-size: 1.35rem;
      line-height: 1.25;
      color: var(--text-bone);
    }
    .qv-prices {
      display: flex;
      align-items: baseline;
      flex-wrap: wrap;
      gap: 0.65rem;
      padding-bottom: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .qv-price {
      font-size: 1.35rem;
      font-weight: 700;
      color: var(--text-bone);
    }
    .qv-compare {
      font-size: 0.85rem;
      color: var(--text-dim);
      text-decoration: line-through;
    }
    .qv-location-tag {
      font-size: 0.68rem;
      color: var(--text-dim);
      letter-spacing: 0.08em;
    }
    .qv-condition-box {
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .cond-header {
      display: flex;
      justify-content: space-between;
      font-size: 0.7rem;
      color: var(--text-muted);
    }
    .cond-header strong {
      color: var(--text-bone);
    }
    .cond-bar-track {
      height: 4px;
      background: var(--bg-media);
      border-radius: 2px;
      overflow: hidden;
    }
    .cond-bar-fill {
      height: 100%;
      background: var(--accent-emerald);
      border-radius: 2px;
    }
    .qv-spec-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem;
      font-size: 0.74rem;
    }
    .qv-spec-item {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      padding: 0.5rem 0.65rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
    }
    .qv-spec-item .k {
      color: var(--text-dim);
      font-size: 0.64rem;
      letter-spacing: 0.08em;
    }
    .qv-spec-item .v {
      color: var(--text-bone);
      font-weight: 700;
    }
    .qv-spec-item .v--warn {
      color: var(--accent-crimson);
    }
    .qv-actions {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      margin-top: 0.5rem;
    }
    .btn-add-bag {
      cursor: pointer;
      width: 100%;
      padding: 0.85rem 1.25rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      border-radius: var(--radius-sharp);
      font-size: 0.82rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      transition: all 0.18s var(--ease-kinetic);
    }
    .btn-add-bag:hover:not(:disabled) {
      background: transparent;
      color: var(--text-bone);
    }
    .btn-add-bag--success {
      background: var(--accent-emerald) !important;
      color: #ffffff !important;
      border-color: var(--accent-emerald) !important;
    }
    .btn-add-bag:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
    .btn-wa-order {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      width: 100%;
      padding: 0.75rem 1.25rem;
      background: #25d366;
      color: #04240f;
      border: 1px solid #25d366;
      border-radius: var(--radius-sharp);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      transition: opacity 0.18s ease;
    }
    .btn-wa-order:hover:not(:disabled) {
      opacity: 0.92;
    }
    .btn-wa-order:disabled {
      cursor: not-allowed;
      opacity: 0.35;
    }
    .wa-icon {
      display: grid;
      place-items: center;
    }
    .qv-footer-links {
      text-align: center;
      padding-top: 0.5rem;
    }
    .view-detail-btn {
      cursor: pointer;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-decoration: underline;
      text-underline-offset: 3px;
      transition: color 0.16s ease;
    }
    .view-detail-btn:hover {
      color: var(--text-bone);
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes scaleIn {
      from {
        opacity: 0;
        transform: translate(-50%, -47%) scale(0.96);
      }
      to {
        opacity: 1;
        transform: translate(-50%, -50%) scale(1);
      }
    }
    @media (max-width: 720px) {
      .qv-dialog {
        width: calc(100vw - 1rem);
        max-height: calc(100vh - 2rem);
      }
      .qv-body {
        grid-template-columns: 1fr;
      }
      .qv-media {
        max-height: 280px;
        aspect-ratio: auto;
      }
      .qv-details {
        padding: 1rem 1.15rem;
        gap: 0.75rem;
      }
      .qv-title {
        font-size: 1.15rem;
      }
      .qv-price {
        font-size: 1.15rem;
      }
    }
  `]
})
export class DocoQuickViewComponent {
  protected readonly quickView = inject(QuickViewService);
  protected readonly cart = inject(CartService);
  protected readonly whatsapp = inject(WhatsAppService);
  protected readonly soundFx = inject(SoundFxService);
  private readonly router = inject(Router);

  protected readonly formatEra = formatEra;
  protected readonly formatCondition = formatCondition;
  protected readonly formatMxn = formatMxn;

  protected readonly addedRecently = signal(false);

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.quickView.isOpen()) {
      this.quickView.close();
    }
  }

  protected conditionRating(grade: string): number {
    switch (grade) {
      case 'DEADSTOCK_NEW': return 10;
      case 'LIKE_NEW': return 9.5;
      case 'EXCELLENT_VINTAGE': return 9.0;
      case 'GOOD_DISTRESSED': return 8.0;
      case 'HEAVILY_DISTRESSED': return 7.0;
      default: return 9.0;
    }
  }

  protected conditionPercent(grade: string): number {
    return this.conditionRating(grade) * 10;
  }

  protected handleAddToBag(item: any): void {
    this.cart.addItem(item);
    this.soundFx.playChime();
    this.addedRecently.set(true);
    setTimeout(() => {
      this.addedRecently.set(false);
    }, 1500);
  }

  protected orderDirectViaWa(item: any): void {
    const url = this.whatsapp.generatePieceInquiryUrl(item.title, item.sku, item.sizeLabel, item.priceMxn);
    this.whatsapp.openUrl(url);
  }

  protected navigateToProduct(slug: string): void {
    this.quickView.close();
    this.router.navigate(['/piece', slug]);
  }
}
