import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'doco-whatsapp-float',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="wa-float-container" [class.is-expanded]="expanded()">
      <!-- Popover Menu -->
      @if (expanded()) {
        <div class="wa-popover font-mono" role="dialog" aria-label="Contacto directo WhatsApp">
          <div class="popover-head">
            <div class="status-indicator">
              <span class="status-dot"></span>
              <strong>DOCO VAULT // CULIACÁN</strong>
            </div>
            <button type="button" class="close-popover" (click)="toggle()">[X]</button>
          </div>

          <p class="popover-text">
            Atención personalizada de 10:00 a 20:00 (Hora Sinaloa). Apartados inmediatos y dudas de medidas.
          </p>

          <div class="popover-options">
            <button type="button" class="wa-action-btn" (click)="chatGeneral()">
              <span>Consultar disponibilidad de piezas</span>
              <small>Atención Directa</small>
            </button>
            <button type="button" class="wa-action-btn" (click)="chatStylist()">
              <span>Enviar comprobante SPEI / OXXO</span>
              <small>Confirmación de apartado</small>
            </button>
          </div>
        </div>
      }

      <!-- Main Floating Trigger Button -->
      <button
        type="button"
        class="wa-trigger-btn font-mono"
        (click)="handleClick()"
        aria-label="Abrir WhatsApp oficial DOCO"
        title="Atención directa por WhatsApp DOCO"
      >
        <span class="wa-pulse-ring"></span>
        <span class="wa-icon">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
            <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
          </svg>
        </span>
        <span class="wa-label">
          <strong>WHATSAPP</strong>
          <small>EN LÍNEA</small>
        </span>
      </button>
    </div>
  `,
  styles: [`
    .wa-float-container {
      position: fixed;
      right: 1.5rem;
      bottom: 1.75rem;
      z-index: 180;
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 0.75rem;
    }
    .wa-trigger-btn {
      position: relative;
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.75rem 1.15rem;
      background: #25d366;
      color: #04240f;
      border: 1px solid rgba(255, 255, 255, 0.4);
      border-radius: 999px;
      box-shadow: 0 8px 26px rgba(37, 211, 102, 0.4);
      transition: transform 0.22s var(--ease-kinetic), box-shadow 0.22s;
    }
    .wa-trigger-btn:hover {
      transform: translateY(-3px) scale(1.02);
      box-shadow: 0 12px 32px rgba(37, 211, 102, 0.58);
    }
    .wa-pulse-ring {
      position: absolute;
      inset: -4px;
      border-radius: 999px;
      border: 2px solid #25d366;
      animation: pulse-ring 2.5s cubic-bezier(0.215, 0.61, 0.355, 1) infinite;
      pointer-events: none;
    }
    .wa-icon {
      display: grid;
      place-items: center;
    }
    .wa-label {
      display: flex;
      flex-direction: column;
      text-align: left;
      line-height: 1.15;
    }
    .wa-label strong {
      font-size: 0.75rem;
      letter-spacing: 0.08em;
    }
    .wa-label small {
      font-size: 0.65rem;
      opacity: 0.88;
    }
    .wa-popover {
      width: 310px;
      padding: 1.15rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-card);
      box-shadow: 0 16px 40px rgba(0, 0, 0, 0.45);
      animation: popover-fade 0.2s var(--ease-kinetic);
    }
    .popover-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.65rem;
    }
    .status-indicator {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      font-size: 0.74rem;
      color: var(--text-bone);
    }
    .status-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #25d366;
      box-shadow: 0 0 8px #25d366;
    }
    .close-popover {
      cursor: pointer;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .popover-text {
      margin: 0 0 1rem;
      font-size: 0.72rem;
      color: var(--text-muted);
      line-height: 1.45;
    }
    .popover-options {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .wa-action-btn {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.2rem;
      padding: 0.65rem 0.85rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      color: var(--text-bone);
      text-align: left;
      transition: border-color 0.18s, background 0.18s;
    }
    .wa-action-btn:hover {
      border-color: #25d366;
      background: var(--bg-elevated);
    }
    .wa-action-btn span {
      font-size: 0.72rem;
      font-weight: 700;
    }
    .wa-action-btn small {
      font-size: 0.64rem;
      color: #25d366;
    }
    @keyframes pulse-ring {
      0% { transform: scale(0.95); opacity: 0.85; }
      50% { transform: scale(1.1); opacity: 0; }
      100% { transform: scale(1.1); opacity: 0; }
    }
    @keyframes popover-fade {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 768px) {
      .wa-float-container {
        display: none !important;
      }
    }
  `]
})
export class DocoWhatsappFloatComponent {
  protected readonly whatsapp = inject(WhatsAppService);
  private readonly soundFx = inject(SoundFxService);
  protected readonly expanded = signal(false);

  protected toggle(): void {
    this.soundFx.playClick();
    this.expanded.update((v) => !v);
  }

  protected handleClick(): void {
    if (this.expanded()) {
      this.toggle();
    } else {
      // Toggle popover or open directly
      this.toggle();
    }
  }

  protected chatGeneral(): void {
    const url = this.whatsapp.generateGeneralInquiryUrl();
    this.whatsapp.openUrl(url);
    this.expanded.set(false);
  }

  protected chatStylist(): void {
    const message = 'Hola DOCO! Quiero enviar mi comprobante de pago SPEI / OXXO para mi pedido de ropa.';
    const url = `https://wa.me/${this.whatsapp.phoneNumber}?text=${encodeURIComponent(message)}`;
    this.whatsapp.openUrl(url);
    this.expanded.set(false);
  }
}
