import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CheckoutSessionResponse } from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatMxn } from '../../core/utils/formatters';
import { DocoSectionHeaderComponent } from '../../shared/components/doco-section-header.component';
import { DocoTurnstileComponent } from '../../shared/components/doco-turnstile.component';

@Component({
  selector: 'doco-checkout-page',
  standalone: true,
  imports: [FormsModule, RouterLink, DocoSectionHeaderComponent, DocoTurnstileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="doco-container checkout-wrap">
      <doco-section-header
        eyebrow="PEDIDO DIRECTO // CULIACÁN, SINALOA"
        title="CHECKOUT WHATSAPP OFICIAL"
      />

      @if (confirmation(); as order) {
        <div class="confirm-card">
          <div class="confirm-header font-mono">
            <span class="confirm-tag">PEDIDO REGISTRADO EXITOSAMENTE</span>
            <span class="confirm-date">// DOCO VAULT</span>
          </div>

          <h2 class="font-display confirm-number">{{ order.orderNumber }}</h2>
          <p class="confirm-desc">
            Tu apartado ha sido reservado. Se ha generado tu mensaje personalizado para nuestro WhatsApp oficial
            <strong>({{ whatsapp.displayPhone }})</strong>.
          </p>

          <div class="confirm-totals font-mono">
            <div>
              <span>TOTAL A TRANSFERIR:</span>
              <strong>{{ format(order.totalMxn) }}</strong>
            </div>
            <span class="confirm-status">ESPERANDO COMPROBANTE SPEI / OXXO</span>
          </div>

          <div class="confirm-actions font-mono">
            <a
              [href]="order.checkoutUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn-wa-confirm"
            >
              ABRIR CHAT DE WHATSAPP OFICIAL ↗
            </a>
            <a routerLink="/catalog" class="btn-ghost">VOLVER AL CATÁLOGO</a>
          </div>

          <div class="instructions-box font-mono">
            <h4>// PRÓXIMOS PASOS:</h4>
            <ol>
              <li>Envía el mensaje prellenado en WhatsApp para apartar formalmente tu(s) pieza(s).</li>
              <li>Te enviaremos la CLABE interbancaria (SPEI) o número de tarjeta para depósito OXXO.</li>
              <li>Envía tu comprobante de pago para coordinar la entrega directa en Culiacán.</li>
            </ol>
          </div>
        </div>
      } @else if (cart.items().length === 0) {
        <div class="empty-card font-mono">
          <p>Tu bolsa está vacía. Selecciona piezas antes de continuar al checkout.</p>
          <a routerLink="/catalog" class="btn-primary">EXPLORAR DROP #01 →</a>
        </div>
      } @else {
        <!-- WhatsApp Priority Notice -->
        <div class="wa-notice font-mono">
          <span class="wa-badge">MÉTODO ACTIVO: WHATSAPP DIRECTO</span>
          <p>
            Los pagos en línea automatizados con tarjeta se habilitarán en la siguiente fase. Por ahora, todas las compras se gestionan directamente a través de nuestro <strong>WhatsApp oficial</strong> con atención directa desde Culiacán, Sin.
          </p>
        </div>

        <div class="checkout-grid">
          <form class="checkout-form" (ngSubmit)="submitCheckout()">
            <h3 class="font-mono form-section">1. DATOS DE ENTREGA EN CULIACÁN, SINALOA</h3>
            <div class="field-row">
              <label>
                <span>Nombre completo *</span>
                <input
                  type="text"
                  [(ngModel)]="customerName"
                  name="customerName"
                  placeholder="Ej. Ernesto Ramos"
                  required
                />
              </label>
              <label>
                <span>Teléfono / WhatsApp (10 dígitos) *</span>
                <input
                  type="tel"
                  [(ngModel)]="customerPhone"
                  name="customerPhone"
                  placeholder="Ej. 6671234567"
                  maxlength="15"
                  required
                />
              </label>
            </div>

            <div class="field-row">
              <label>
                <span>Correo electrónico (opcional)</span>
                <input
                  type="email"
                  [(ngModel)]="customerEmail"
                  name="customerEmail"
                  placeholder="Para tu confirmación digital"
                />
              </label>
              <label>
                <span>Código Postal (5 dígitos) *</span>
                <input
                  type="text"
                  [(ngModel)]="shippingPostalCode"
                  name="postalCode"
                  placeholder="80000"
                  maxlength="5"
                  required
                />
              </label>
            </div>

            <div class="field-row">
              <label>
                <span>Ciudad *</span>
                <input
                  type="text"
                  [(ngModel)]="shippingCity"
                  name="city"
                  placeholder="Culiacán"
                  required
                />
              </label>
              <label>
                <span>Estado *</span>
                <input
                  type="text"
                  [(ngModel)]="shippingState"
                  name="state"
                  placeholder="Sinaloa"
                  required
                />
              </label>
            </div>

            <label>
              <span>Dirección completa (Calle, Número exterior/interior, Colonia) *</span>
              <input
                type="text"
                [(ngModel)]="shippingAddress"
                name="address"
                placeholder="Ej. Av. Álvaro Obregón #1420 Col. Centro"
                required
              />
            </label>

            <label>
              <span>Referencias o Entrega especial</span>
              <input
                type="text"
                [(ngModel)]="shippingNotes"
                name="notes"
                placeholder="Ej. Casa blanca de 2 pisos, entre calles..."
              />
            </label>

            <h3 class="font-mono form-section">2. MÉTODO DE LIQUIDACIÓN</h3>
            <div class="method-card">
              <div class="method-card__head">
                <span class="method-tag font-mono">RECOMENDADO // SIN COMISIONES</span>
                <h4 class="font-display">WHATSAPP DIRECTO + SPEI / OXXO</h4>
              </div>
              <p class="method-desc">
                Al presionar el botón inferior se abrirá tu WhatsApp con el desglose exacto de tus piezas y tu dirección para darte atención inmediata y reservar el stock atómico.
              </p>
            </div>

            <h3 class="font-mono form-section">3. SEGURIDAD & ESCUDO ANTI-BOT</h3>
            <doco-turnstile (tokenChange)="captchaToken.set($event)" />

            @if (errorMessage()) {
              <div class="error-banner font-mono" role="alert">{{ errorMessage() }}</div>
            }

            <button
              type="submit"
              class="submit-btn font-mono"
              [disabled]="submitting() || !isFormValid()"
            >
              <span class="btn-wa-icon">
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
                </svg>
              </span>
              <span>{{ submitting() ? 'PREPARANDO APARTADO...' : 'ENVIAR PEDIDO POR WHATSAPP ↗' }}</span>
            </button>
          </form>

          <aside class="order-summary">
            <h3 class="font-mono form-section">RESUMEN DEL PEDIDO</h3>
            @for (item of cart.items(); track item.product.id) {
              <div class="sum-item">
                <div class="sum-item__info">
                  <span class="sum-item__title">{{ item.product.title }}</span>
                  <small class="font-mono">Talla {{ item.product.sizeLabel }} · Cant: {{ item.quantity }}</small>
                </div>
                <strong class="font-mono">{{ format(item.product.priceMxn * item.quantity) }}</strong>
              </div>
            }

            <div class="sum-divider"></div>

            <div class="sum-calc font-mono">
              <div class="sum-row">
                <span>Subtotal</span>
                <span>{{ format(cart.subtotalMxn()) }}</span>
              </div>
              <div class="sum-row">
                <span>Entrega en Culiacán</span>
                <span [class.free-pill]="cart.shippingMxn() === 0">
                  {{ cart.shippingMxn() === 0 ? 'GRATIS' : format(cart.shippingMxn()) }}
                </span>
              </div>
              <div class="sum-row sum-total">
                <span>TOTAL ESTIMADO</span>
                <span class="sum-total-val">{{ format(cart.totalMxn()) }}</span>
              </div>
            </div>

            <div class="summary-wa-cta font-mono">
              <span>Entrega directa y atención en Culiacán, Sinaloa</span>
            </div>
          </aside>
        </div>
      }
    </section>
  `,
  styles: [`
    .checkout-wrap {
      padding-top: 3rem;
      padding-bottom: 4rem;
    }
    .wa-notice {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1.15rem 1.4rem;
      margin-bottom: 2rem;
      background: rgba(37, 211, 102, 0.08);
      border: 1px solid rgba(37, 211, 102, 0.35);
      border-radius: var(--radius-card);
      font-size: 0.78rem;
      color: var(--text-bone);
    }
    .wa-badge {
      color: #25d366;
      font-weight: 700;
      letter-spacing: 0.1em;
    }
    .wa-notice p {
      margin: 0;
      line-height: 1.45;
      color: var(--text-secondary);
    }
    .checkout-grid {
      display: grid;
      grid-template-columns: 1.35fr 0.95fr;
      gap: 2.5rem;
      align-items: start;
    }
    .checkout-form,
    .order-summary,
    .confirm-card,
    .empty-card {
      padding: 1.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
    }
    .form-section {
      margin: 1.4rem 0 0.85rem;
      font-size: 0.74rem;
      color: var(--accent-crimson);
      letter-spacing: 0.12em;
    }
    .form-section:first-child {
      margin-top: 0;
    }
    .field-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.9rem;
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 0.85rem;
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    input {
      padding: 0.7rem 0.85rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      color: var(--text-bone);
      outline: none;
      transition: border-color 0.2s;
    }
    input:focus {
      border-color: var(--border-strong);
    }
    .method-card {
      padding: 1.15rem;
      background: var(--bg-void);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      margin-bottom: 1rem;
    }
    .method-card__head {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      margin-bottom: 0.5rem;
    }
    .method-tag {
      font-size: 0.68rem;
      color: var(--accent-emerald);
      letter-spacing: 0.08em;
      font-weight: 700;
    }
    .method-card h4 {
      margin: 0;
      font-size: 1.1rem;
    }
    .method-desc {
      margin: 0;
      font-size: 0.78rem;
      color: var(--text-muted);
      line-height: 1.4;
    }
    .error-banner {
      margin-top: 1rem;
      padding: 0.85rem;
      background: var(--accent-crimson-soft);
      border: 1px solid var(--accent-crimson);
      font-size: 0.78rem;
    }
    .submit-btn {
      width: 100%;
      margin-top: 1.4rem;
      cursor: pointer;
      padding: 1.05rem 1.4rem;
      background: #25d366;
      color: #052610;
      border: none;
      font-size: 0.84rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.6rem;
      border-radius: var(--radius-sharp);
      box-shadow: 0 6px 20px rgba(37, 211, 102, 0.35);
      transition: transform 0.18s, box-shadow 0.18s;
    }
    .submit-btn:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 10px 28px rgba(37, 211, 102, 0.48);
    }
    .submit-btn:disabled {
      opacity: 0.45;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }
    .btn-wa-bolt {
      font-size: 1.15rem;
    }
    .sum-item {
      display: flex;
      justify-content: space-between;
      gap: 0.85rem;
      margin-bottom: 0.75rem;
    }
    .sum-item__info {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }
    .sum-item__title {
      font-size: 0.88rem;
      font-weight: 600;
    }
    .sum-item__info small {
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .sum-divider {
      height: 1px;
      background: var(--border-subtle);
      margin: 1.1rem 0;
    }
    .sum-calc {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      font-size: 0.78rem;
    }
    .sum-row {
      display: flex;
      justify-content: space-between;
      color: var(--text-muted);
    }
    .free-pill {
      color: var(--accent-emerald);
      font-weight: 700;
    }
    .sum-total {
      margin-top: 0.5rem;
      padding-top: 0.65rem;
      border-top: 1px solid var(--border-subtle);
      font-size: 1.05rem;
      color: var(--text-bone);
    }
    .sum-total-val {
      font-weight: 800;
    }
    .summary-wa-cta {
      margin-top: 1.5rem;
      padding: 0.95rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
      font-size: 0.72rem;
      text-align: center;
    }
    .wa-direct-link {
      cursor: pointer;
      background: transparent;
      border: none;
      color: #25d366;
      font-weight: 700;
      text-decoration: underline;
    }
    .confirm-card {
      max-width: 740px;
      margin: 0 auto;
    }
    .confirm-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1rem;
    }
    .confirm-tag {
      color: var(--accent-emerald);
      font-size: 0.82rem;
      font-weight: 700;
    }
    .confirm-date {
      color: var(--text-dim);
      font-size: 0.72rem;
    }
    .confirm-number {
      font-size: 2.2rem;
      margin: 0 0 0.75rem;
    }
    .confirm-desc {
      color: var(--text-muted);
      line-height: 1.5;
      margin: 0 0 1.5rem;
    }
    .confirm-totals {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.15rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      margin-bottom: 1.75rem;
    }
    .confirm-status {
      font-size: 0.74rem;
      color: var(--accent-crimson);
    }
    .confirm-actions {
      display: flex;
      flex-wrap: wrap;
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .btn-wa-confirm {
      display: inline-flex;
      align-items: center;
      padding: 0.95rem 1.6rem;
      background: #25d366;
      color: #052610;
      font-weight: 700;
      font-size: 0.82rem;
      letter-spacing: 0.08em;
      border-radius: var(--radius-sharp);
      box-shadow: 0 6px 22px rgba(37, 211, 102, 0.4);
    }
    .btn-ghost {
      display: inline-flex;
      align-items: center;
      padding: 0.95rem 1.4rem;
      border: 1px solid var(--border-strong);
      font-size: 0.8rem;
    }
    .instructions-box {
      padding: 1.25rem;
      background: var(--bg-elevated);
      border-left: 3px solid var(--text-bone);
      font-size: 0.76rem;
    }
    .instructions-box h4 {
      margin: 0 0 0.65rem;
      color: var(--text-bone);
    }
    .instructions-box ol {
      margin: 0;
      padding-left: 1.2rem;
      line-height: 1.6;
      color: var(--text-muted);
    }
    .empty-card {
      text-align: center;
      padding: 3.5rem 1.5rem;
    }
    .btn-primary {
      display: inline-block;
      margin-top: 1.2rem;
      padding: 0.9rem 1.5rem;
      background: var(--text-bone);
      color: var(--bg-void);
      font-weight: 700;
      font-size: 0.8rem;
    }
    @media (max-width: 860px) {
      .checkout-grid,
      .field-row {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class CheckoutPageComponent {
  protected readonly cart = inject(CartService);
  private readonly checkoutService = inject(CheckoutService);
  protected readonly whatsapp = inject(WhatsAppService);
  protected readonly format = formatMxn;

  protected customerName = '';
  protected customerEmail = '';
  protected customerPhone = '';
  protected shippingCity = 'Culiacán';
  protected shippingState = 'Sinaloa';
  protected shippingPostalCode = '';
  protected shippingAddress = '';
  protected shippingNotes = '';

  protected readonly captchaToken = signal<string | null>(null);
  protected readonly submitting = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly confirmation = signal<CheckoutSessionResponse | null>(null);

  private readonly idempotencyKey =
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : 'doco-' + Date.now();

  protected isFormValid(): boolean {
    return (
      this.customerName.trim().length >= 3 &&
      this.customerPhone.trim().length >= 10 &&
      this.shippingCity.trim().length >= 2 &&
      this.shippingState.trim().length >= 2 &&
      this.shippingPostalCode.trim().length >= 4 &&
      this.shippingAddress.trim().length >= 5
    );
  }

  protected askViaWa(): void {
    const url = this.whatsapp.generateGeneralInquiryUrl();
    this.whatsapp.openUrl(url);
  }

  protected submitCheckout(): void {
    if (this.submitting() || !this.isFormValid()) return;
    this.submitting.set(true);
    this.errorMessage.set('');

    const customerData = {
      name: this.customerName,
      phone: this.customerPhone,
      city: this.shippingCity,
      state: this.shippingState,
      postalCode: this.shippingPostalCode,
      address: this.shippingAddress,
      notes: this.shippingNotes
    };

    // Try backend order reservation; if backend is available it reserves stock and returns formal orderNumber
    this.checkoutService
      .createCheckout(
        {
          idempotencyKey: this.idempotencyKey,
          customerName: this.customerName,
          customerEmail: this.customerEmail || 'wa@doco.mx',
          customerPhone: this.customerPhone,
          shippingCity: this.shippingCity,
          shippingState: this.shippingState,
          shippingPostalCode: this.shippingPostalCode,
          shippingAddress: this.shippingAddress,
          paymentProvider: 'TRANSFER_WHATSAPP',
          items: this.cart.items().map((i) => ({ productId: i.product.id, quantity: i.quantity }))
        },
        this.captchaToken()
      )
      .subscribe({
        next: (res) => {
          // Open WhatsApp immediately with the generated order number
          const finalWaUrl = this.cart.getWhatsAppCheckoutUrl({
            ...customerData,
            orderNumber: res.orderNumber
          });
          this.whatsapp.openUrl(finalWaUrl);

          this.confirmation.set({
            ...res,
            checkoutUrl: finalWaUrl
          });
          this.cart.clear();
          this.submitting.set(false);
        },
        error: () => {
          // Fallback to client-side order creation if backend offline or CORS in local dev
          const fallbackOrderNumber = 'DOCO-WA-' + Date.now().toString().slice(-6);
          const finalWaUrl = this.cart.getWhatsAppCheckoutUrl({
            ...customerData,
            orderNumber: fallbackOrderNumber
          });
          this.whatsapp.openUrl(finalWaUrl);

          this.confirmation.set({
            orderNumber: fallbackOrderNumber,
            status: 'RESERVED_WHATSAPP',
            paymentProvider: 'TRANSFER_WHATSAPP',
            subtotalMxn: this.cart.subtotalMxn(),
            shippingMxn: this.cart.shippingMxn(),
            totalMxn: this.cart.totalMxn(),
            checkoutUrl: finalWaUrl,
            instructions: 'Tu pedido se ha canalizado a WhatsApp para atención directa y apartado inmediato.'
          });
          this.cart.clear();
          this.submitting.set(false);
        }
      });
  }
}
