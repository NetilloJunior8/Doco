import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CartService } from '../../core/services/cart.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'doco-cart-drawer',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (cart.isDrawerOpen()) {
      <div class="drawer-backdrop" (click)="cart.closeDrawer()" aria-hidden="true"></div>
      <aside class="drawer" role="dialog" aria-modal="true" aria-label="Bolsa de compras DOCO">
        <!-- HEADER (MONOCHROME MINIMAL) -->
        <header class="drawer__head font-mono">
          <div class="drawer__head-title">
            <span class="drawer__brand-tag">// DOCO ARCHIVE</span>
            <h2 class="drawer__title">BOLSA ({{ cart.itemCount() }})</h2>
          </div>
          <button
            type="button"
            class="drawer__close font-mono"
            (click)="cart.closeDrawer()"
            aria-label="Cerrar bolsa"
          >
            [X]
          </button>
        </header>

        <!-- SUBHEAD -->
        <div class="drawer__subhead font-mono">
          <span>CULIACÁN, SINALOA // PIEZAS 1-OF-1</span>
        </div>

        <!-- BODY -->
        <div class="drawer__body font-mono">
          @if (cart.items().length === 0) {
            <div class="drawer__empty">
              <div class="empty-icon font-mono">[ ∅ ]</div>
              <p class="empty-title">TU BOLSA ESTÁ VACÍA</p>
              <p class="empty-sub">Las piezas únicas de archivo se cotizan y apartan vía WhatsApp.</p>
              <button type="button" class="empty-btn" (click)="cart.closeDrawer()">
                [ VER CATÁLOGO ]
              </button>
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
                </div>

                <div class="bag-item__info">
                  <div class="bag-item__meta">
                    <span class="bag-item__sku">{{ item.product.sku.replace('DOCO-ARC-', 'DOCO-') }}</span>
                    <span class="bag-item__size">TALLA {{ item.product.sizeLabel }}</span>
                  </div>
                  <h4 class="bag-item__title">{{ item.product.title }}</h4>

                  <div class="bag-item__controls">
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
                      [ QUITAR ]
                    </button>
                  </div>
                </div>
              </article>
            }
          }
        </div>

        <!-- FOOTER (NO PRICES, PURE YEEZY MONOCHROME) -->
        @if (cart.items().length > 0) {
          <footer class="drawer__foot font-mono">
            <div class="summary-card">
              <div class="summary-row">
                <span class="summary-k">TOTAL DE PIEZAS:</span>
                <span class="summary-v">{{ cart.itemCount() }}</span>
              </div>
              <div class="summary-row">
                <span class="summary-k">DISPONIBILIDAD:</span>
                <span class="summary-v">1-OF-1 FÍSICO</span>
              </div>
              <div class="summary-row">
                <span class="summary-k">ENTREGA LOCAL:</span>
                <span class="summary-v">CULIACÁN, SIN</span>
              </div>
              <div class="summary-row summary-row--highlight">
                <span class="summary-k">COTIZACIÓN:</span>
                <span class="summary-v">DIRECTA VÍA WHATSAPP</span>
              </div>
            </div>

            <!-- Solid Monochrome Yeezy Button -->
            <button
              type="button"
              class="drawer__wa-btn font-mono"
              (click)="orderViaWhatsApp()"
            >
              <span>CONSULTAR PRECIOS Y PEDIR POR WHATSAPP</span>
              <span class="wa-arrow">↗</span>
            </button>

            <div class="drawer__trust font-mono">
              <span>RESPUESTA DIRECTA // +52 667 203 3174</span>
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
      z-index: 99990;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: fade-in 0.18s ease-out;
    }

    [data-theme='light'] .drawer-backdrop {
      background: rgba(255, 255, 255, 0.82);
    }

    .drawer {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 99995;
      width: min(440px, 100vw);
      background: var(--bg-void);
      border-left: 1px solid var(--border-strong);
      display: flex;
      flex-direction: column;
      box-shadow: -10px 0 35px rgba(0, 0, 0, 0.45);
      animation: slide-in 0.22s cubic-bezier(0.2, 0.9, 0.3, 1);
    }

    .drawer__head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.25rem 1.4rem;
      border-bottom: 1px solid var(--border-subtle);
      background: var(--bg-void);
    }

    .drawer__head-title {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .drawer__brand-tag {
      font-size: 0.65rem;
      color: var(--text-dim);
      letter-spacing: 0.12em;
    }

    .drawer__title {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-bone);
      text-transform: uppercase;
    }

    .drawer__close {
      cursor: pointer;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.85rem;
      padding: 0.25rem 0.5rem;
      transition: color 0.15s ease;
    }

    .drawer__close:hover {
      color: var(--text-bone);
    }

    .drawer__subhead {
      padding: 0.6rem 1.4rem;
      background: var(--bg-surface);
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.68rem;
      color: var(--text-dim);
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }

    .drawer__body {
      flex: 1;
      overflow-y: auto;
      padding: 1.25rem 1.4rem;
      display: flex;
      flex-direction: column;
      gap: 1.2rem;
    }

    .drawer__empty {
      margin: auto 0;
      text-align: center;
      padding: 2.5rem 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.75rem;
    }

    .empty-icon {
      font-size: 1.8rem;
      color: var(--text-dim);
    }

    .empty-title {
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      margin: 0;
      color: var(--text-bone);
    }

    .empty-sub {
      font-size: 0.72rem;
      color: var(--text-muted);
      margin: 0;
      line-height: 1.4;
      max-width: 280px;
    }

    .empty-btn {
      margin-top: 0.5rem;
      background: transparent;
      border: 1px solid var(--border-strong);
      color: var(--text-bone);
      font-size: 0.75rem;
      padding: 0.6rem 1.2rem;
      cursor: pointer;
      letter-spacing: 0.08em;
    }

    .bag-item {
      display: grid;
      grid-template-columns: 80px 1fr;
      gap: 1rem;
      padding-bottom: 1.1rem;
      border-bottom: 1px solid var(--border-subtle);
    }

    .bag-item__media {
      position: relative;
      width: 80px;
      height: 80px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }

    .bag-item__img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }

    .bag-item__info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      min-width: 0;
      gap: 0.35rem;
    }

    .bag-item__meta {
      font-size: 0.68rem;
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
      letter-spacing: 0.08em;
    }

    .bag-item__sku {
      font-weight: 600;
      color: var(--text-bone);
    }

    .bag-item__size {
      color: var(--text-dim);
    }

    .bag-item__title {
      margin: 0;
      font-size: 0.8rem;
      font-weight: 500;
      line-height: 1.3;
      color: var(--text-secondary);
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .bag-item__controls {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 0.25rem;
    }

    .qty-stepper {
      display: inline-flex;
      align-items: center;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
    }

    .qty-stepper button {
      cursor: pointer;
      width: 24px;
      height: 24px;
      background: transparent;
      border: none;
      color: var(--text-bone);
      font-weight: 700;
      font-size: 0.75rem;
    }

    .qty-stepper span {
      min-width: 20px;
      text-align: center;
      font-size: 0.72rem;
      color: var(--text-bone);
    }

    .remove-link {
      cursor: pointer;
      border: none;
      background: transparent;
      color: var(--text-dim);
      font-size: 0.66rem;
      letter-spacing: 0.08em;
      padding: 0;
    }

    .remove-link:hover {
      color: var(--text-bone);
    }

    .drawer__foot {
      padding: 1.2rem 1.4rem 1.4rem;
      border-top: 1px solid var(--border-strong);
      background: var(--bg-void);
      display: flex;
      flex-direction: column;
      gap: 0.85rem;
    }

    .summary-card {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      padding: 0.85rem 1rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
    }

    .summary-row {
      display: flex;
      justify-content: space-between;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
    }

    .summary-k {
      color: var(--text-dim);
    }

    .summary-v {
      color: var(--text-bone);
    }

    .summary-row--highlight {
      margin-top: 0.35rem;
      padding-top: 0.45rem;
      border-top: 1px solid var(--border-subtle);
    }

    .summary-row--highlight .summary-k,
    .summary-row--highlight .summary-v {
      font-weight: 700;
      color: var(--text-bone);
    }

    /* PURE MONOCHROME YEEZY RECTANGLE BUTTON */
    .drawer__wa-btn {
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0.95rem 1.25rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      box-sizing: border-box;
      transition: opacity 0.15s ease;
    }

    .drawer__wa-btn:hover {
      opacity: 0.88;
    }

    .wa-arrow {
      font-size: 1rem;
      font-weight: 800;
    }

    .drawer__trust {
      text-align: center;
      font-size: 0.65rem;
      color: var(--text-dim);
      letter-spacing: 0.1em;
      text-transform: uppercase;
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

  protected orderViaWhatsApp(): void {
    const url = this.whatsapp.generateCartCheckoutUrl(this.cart.items());
    this.whatsapp.openUrl(url);
    this.cart.closeDrawer();
  }
}
