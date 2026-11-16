import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatMxn } from '../../core/utils/formatters';

@Component({
  selector: 'doco-cart-drawer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cart.isDrawerOpen()) {
      <div class="drawer-backdrop" (click)="cart.closeDrawer()" aria-hidden="true"></div>
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="Bolsa de compras DOCO">
        <header class="drawer__head">
          <div class="drawer__brand-badge">
            <span class="font-mono drawer__eyebrow">// FLIGHT CASE ARCHIVE</span>
            <h2 class="font-display drawer__title">TU BOLSA ({{ cart.itemCount() }})</h2>
          </div>
          <button type="button" class="drawer__close font-mono" (click)="cart.closeDrawer()" aria-label="Cerrar bolsa">✕</button>
        </header>

        <!-- Dynamic Free Shipping Meter -->
        <div class="drawer__meter font-mono">
          <div class="meter-labels">
            @if (cart.freeShippingRemainingMxn() === 0 && cart.itemCount() > 0) {
              <span class="meter-unlocked">ENTREGA GRATIS EN CULIACÁN DESBLOQUEADA</span>
            } @else {
              <span>Faltan <strong>{{ format(cart.freeShippingRemainingMxn()) }}</strong> para entrega gratis en Culiacán</span>
            }
            <span class="meter-pct">{{ cart.freeShippingProgressPct() }}%</span>
          </div>
          <div class="meter-track">
            <div class="meter-bar" [style.width.%]="cart.freeShippingProgressPct()"></div>
          </div>
        </div>

        <div class="drawer__body">
          @if (cart.items().length === 0) {
            <div class="drawer__empty">
              <div class="empty-icon font-mono">[ ∅ ]</div>
              <p class="font-display empty-title">TU BOLSA ESTÁ VACÍA</p>
              <p class="font-mono empty-sub">Piezas únicas de archivo se agotan rápido en cada drop.</p>
              <a routerLink="/catalog" class="drawer__btn font-mono" (click)="cart.closeDrawer()">
                EXPLORAR VAULT DROP #01 →
              </a>
            </div>
          } @else {
            @for (item of cart.items(); track item.product.id) {
              <article class="bag-item">
                <div class="bag-item__media">
                  <img
                    class="bag-item__img"
                    [src]="item.product.primaryImageUrl || '/assets/brand/doco-logo-light.png'"
                    [alt]="item.product.title"
                  />
                  <span class="bag-item__size font-mono">{{ item.product.sizeLabel }}</span>
                </div>

                <div class="bag-item__info">
                  <div class="bag-item__meta font-mono">
                    <span>{{ item.product.brandName }}</span>
                    <span class="bag-item__sku">[{{ item.product.sku }}]</span>
                  </div>
                  <h4 class="bag-item__title">{{ item.product.title }}</h4>
                  <div class="bag-item__price font-mono">
                    {{ format(item.product.priceMxn * item.quantity) }}
                    @if (item.quantity > 1) {
                      <small class="unit-price">({{ format(item.product.priceMxn) }} c/u)</small>
                    }
                  </div>

                  <div class="bag-item__controls font-mono">
                    <div class="qty-stepper">
                      <button
                        type="button"
                        (click)="cart.updateQuantity(item.product.id, item.quantity - 1)"
                        aria-label="Disminuir cantidad"
                      >-</button>
                      <span>{{ item.quantity }}</span>
                      <button
                        type="button"
                        [disabled]="item.quantity >= item.product.stock"
                        (click)="cart.updateQuantity(item.product.id, item.quantity + 1)"
                        aria-label="Aumentar cantidad"
                      >+</button>
                    </div>

                    <button
                      type="button"
                      class="remove-link"
                      (click)="cart.removeItem(item.product.id)"
                    >
                      QUITAR
                    </button>
                  </div>
                </div>
              </article>
            }
          }
        </div>

        @if (cart.items().length > 0) {
          <footer class="drawer__foot">
            <div class="summary-card">
              <div class="summary-row font-mono">
                <span>SUBTOTAL ({{ cart.itemCount() }} pzas)</span>
                <span>{{ format(cart.subtotalMxn()) }}</span>
              </div>
              <div class="summary-row font-mono">
                <span>ENTREGA LOCAL CULIACÁN</span>
                <span [class.free-text]="cart.shippingMxn() === 0">
                  {{ cart.shippingMxn() === 0 ? 'GRATIS' : format(cart.shippingMxn()) }}
                </span>
              </div>
              <div class="summary-row summary-row--total font-mono">
                <span>TOTAL A PAGAR</span>
                <strong class="total-amount">{{ format(cart.totalMxn()) }}</strong>
              </div>
            </div>

            <!-- Primary 1-Click WhatsApp Order -->
            <button
              type="button"
              class="drawer__wa-btn font-mono"
              (click)="orderViaWhatsApp()"
            >
              <span class="wa-icon">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
                </svg>
              </span>
              <span class="wa-text">
                <strong>PEDIR POR WHATSAPP</strong>
                <small>Apartado Inmediato · Culiacán, Sin.</small>
              </span>
              <span class="wa-arrow">↗</span>
            </button>

            <!-- Secondary Detail Checkout with Address -->
            <a
              routerLink="/checkout"
              class="drawer__checkout-link font-mono"
              (click)="cart.closeDrawer()"
            >
              O COMPLETAR DIRECCIÓN EN CULIACÁN →
            </a>

            <div class="drawer__trust font-mono">
              <span>Sin comisión extra</span>
              <span>•</span>
              <span>Efectivo / Transferencia / SPEI</span>
              <span>•</span>
              <span>Culiacán, Sinaloa</span>
            </div>
          </footer>
        }
      </aside>
    }
  `,
  styles: [`
    .drawer-backdrop {
      position: fixed;
      inset: 0;
      z-index: 200;
      background: rgba(0, 0, 0, 0.78);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      animation: fade-in 0.2s ease-out;
    }
    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 210;
      width: min(460px, 100vw);
      background: var(--bg-surface);
      border-left: 1px solid var(--border-strong);
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 35px rgba(0, 0, 0, 0.65);
      animation: slide-in 0.28s var(--ease-kinetic);
    }
    .drawer__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.4rem;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }
    .drawer__eyebrow {
      font-size: 0.68rem;
      color: var(--accent-crimson);
      letter-spacing: 0.14em;
    }
    .drawer__title {
      margin: 0.2rem 0 0;
      font-size: 1.2rem;
      font-weight: 800;
      letter-spacing: -0.01em;
    }
    .drawer__close {
      cursor: pointer;
      width: 2.3rem;
      height: 2.3rem;
      display: grid;
      place-items: center;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      color: var(--text-bone);
      transition: border-color 0.18s, transform 0.18s;
    }
    .drawer__close:hover {
      border-color: var(--border-strong);
      transform: scale(1.05);
    }
    .drawer__meter {
      padding: 0.75rem 1.4rem;
      background: var(--bg-elevated);
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.72rem;
    }
    .meter-labels {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      margin-bottom: 0.4rem;
    }
    .meter-unlocked {
      color: var(--accent-emerald);
      font-weight: 700;
    }
    .meter-track {
      height: 5px;
      background: var(--bg-void);
      border-radius: 999px;
      overflow: hidden;
      border: 1px solid var(--border-subtle);
    }
    .meter-bar {
      height: 100%;
      background: linear-gradient(90deg, #10b981 0%, #34d399 100%);
      transition: width 0.35s ease;
    }
    .drawer__body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 1.1rem;
    }
    .drawer__empty {
      margin: auto 0;
      text-align: center;
      padding: 2.5rem 1rem;
    }
    .empty-icon {
      font-size: 2.2rem;
      color: var(--text-dim);
      margin-bottom: 0.6rem;
    }
    .empty-title {
      font-size: 1.3rem;
      margin: 0 0 0.4rem;
    }
    .empty-sub {
      font-size: 0.76rem;
      color: var(--text-muted);
      margin: 0 0 1.5rem;
    }
    .drawer__btn {
      display: inline-block;
      padding: 0.85rem 1.4rem;
      background: var(--text-bone);
      color: var(--bg-void);
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      border-radius: var(--radius-sharp);
    }
    .drawer__wa-ask {
      display: block;
      margin: 1.5rem auto 0;
      background: transparent;
      border: none;
      color: #25d366;
      font-size: 0.74rem;
      font-weight: 600;
      cursor: pointer;
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .bag-item {
      display: grid;
      grid-template-columns: 84px 1fr;
      gap: 1rem;
      padding-bottom: 1.1rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .bag-item__media {
      position: relative;
      width: 84px;
      height: 84px;
      border-radius: var(--radius-sharp);
      overflow: hidden;
      background: var(--bg-media);
      border: 1px solid var(--border-subtle);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.35rem;
    }
    .bag-item__img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
    }
    .bag-item__size {
      position: absolute;
      top: 4px;
      right: 4px;
      padding: 0.12rem 0.38rem;
      background: var(--bg-void);
      color: var(--text-bone);
      font-size: 0.64rem;
      font-weight: 700;
      border: 1px solid var(--border-subtle);
    }
    .bag-item__info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
    }
    .bag-item__meta {
      font-size: 0.68rem;
      color: var(--text-muted);
      display: flex;
      gap: 0.45rem;
    }
    .bag-item__sku {
      color: var(--text-dim);
    }
    .bag-item__title {
      margin: 0.2rem 0;
      font-size: 0.94rem;
      font-weight: 600;
      line-height: 1.25;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .bag-item__price {
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--text-bone);
    }
    .unit-price {
      font-size: 0.7rem;
      color: var(--text-dim);
      margin-left: 0.35rem;
      font-weight: normal;
    }
    .bag-item__controls {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      margin-top: 0.45rem;
      font-size: 0.78rem;
    }
    .qty-stepper {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-subtle);
      background: var(--bg-elevated);
      border-radius: var(--radius-sharp);
    }
    .qty-stepper button {
      cursor: pointer;
      width: 26px;
      height: 26px;
      background: transparent;
      border: none;
      color: var(--text-bone);
      font-weight: 700;
    }
    .qty-stepper span {
      min-width: 24px;
      text-align: center;
      font-size: 0.74rem;
    }
    .remove-link {
      cursor: pointer;
      margin-left: auto;
      border: none;
      background: transparent;
      color: var(--text-dim);
      font-size: 0.66rem;
      letter-spacing: 0.08em;
    }
    .remove-link:hover {
      color: var(--accent-crimson);
      text-decoration: underline;
    }
    .drawer__foot {
      padding: 1.2rem 1.4rem 1.4rem;
      border-top: 1px solid var(--border-strong);
      background: var(--bg-void);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .summary-card {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      padding: 0.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
    }
    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.76rem;
      color: var(--text-muted);
    }
    .free-text {
      color: var(--accent-emerald);
      font-weight: 700;
    }
    .summary-row--total {
      margin-top: 0.35rem;
      padding-top: 0.45rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 0.98rem;
      color: var(--text-bone);
    }
    .total-amount {
      font-size: 1.05rem;
      color: var(--text-bone);
    }
    .drawer__wa-btn {
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.85rem;
      padding: 0.95rem 1.15rem;
      background: #25d366;
      color: #072a12;
      border: none;
      border-radius: var(--radius-sharp);
      box-shadow: 0 4px 18px rgba(37, 211, 102, 0.32);
      transition: transform 0.18s, box-shadow 0.18s;
      text-align: left;
    }
    .drawer__wa-btn:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(37, 211, 102, 0.48);
    }
    .wa-icon {
      font-size: 1.35rem;
      flex-shrink: 0;
    }
    .wa-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      line-height: 1.18;
    }
    .wa-text strong {
      font-size: 0.82rem;
      letter-spacing: 0.06em;
    }
    .wa-text small {
      font-size: 0.68rem;
      opacity: 0.88;
    }
    .wa-arrow {
      font-size: 1.1rem;
      font-weight: 800;
    }
    .drawer__checkout-link {
      cursor: pointer;
      text-align: center;
      padding: 0.75rem 0.9rem;
      background: var(--bg-surface);
      color: var(--text-bone);
      border: 1px solid var(--border-strong);
      font-size: 0.74rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      border-radius: var(--radius-sharp);
      transition: background 0.18s, border-color 0.18s;
    }
    .drawer__checkout-link:hover {
      background: var(--bg-elevated);
      border-color: var(--text-bone);
    }
    .drawer__trust {
      display: flex;
      justify-content: center;
      gap: 0.5rem;
      font-size: 0.64rem;
      color: var(--text-dim);
    }
    @keyframes slide-in {
      from { transform: translateX(100%); }
      to { transform: translateX(0); }
    }
    @keyframes fade-in {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  `]
})
export class DocoCartDrawerComponent {
  protected readonly cart = inject(CartService);
  protected readonly whatsapp = inject(WhatsAppService);
  protected readonly format = formatMxn;

  protected orderViaWhatsApp(): void {
    this.cart.openWhatsAppCheckout();
    this.cart.closeDrawer();
  }

  protected openDirectWa(): void {
    const url = this.whatsapp.generateGeneralInquiryUrl();
    this.whatsapp.openUrl(url);
    this.cart.closeDrawer();
  }
}
