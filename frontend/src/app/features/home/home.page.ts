import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal
} from '@angular/core';
import { ProductSummary } from '../../core/models/catalog.models';
import { ArchiveViewService } from '../../core/services/archive-view.service';
import {
  FALLBACK_PRODUCTS,
  toProductSummary
} from '../../core/services/catalog.fallback.data';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { DocoProductCardComponent } from '../../shared/components/doco-product-card.component';

@Component({
  selector: 'doco-home-page',
  standalone: true,
  imports: [DocoProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CINEMATIC INTRO PORTAL (CLICK ON DOCO LOGO TO ENTER) -->
    @if (archiveView.isIntroOpen()) {
      <div
        class="yeezy-intro"
        [class.is-leaving]="introLeaving()"
        role="dialog"
        aria-label="Portada de introducción DOCO"
      >
        <div class="intro-box">
          <!-- User clicks directly on the logo to enter -->
          <div
            class="intro-logo-trigger"
            (click)="enterArchive()"
            role="button"
            tabindex="0"
            aria-label="Pulsar el logotipo de DOCO para ingresar al catálogo"
            title="Pulsar para entrar"
          >
            <img
              [src]="theme.isLight() ? '/assets/brand/doco-logo-dark.png' : '/assets/brand/doco-logo-light.png'"
              alt="DOCO"
              class="intro-logo-img"
            />
          </div>

          <div class="intro-hint font-mono">
            <span>PULSA EL LOGO PARA INGRESAR</span>
          </div>

          <div class="intro-meta font-mono">
            <span>CULIACÁN, SINALOA // ARCHIVO 1-OF-1</span>
          </div>
        </div>
      </div>
    }

    <!-- MAIN YEEZY ARCHIVE STAGE -->
    <main class="yeezy-stage">
      <!-- 6-COLUMN GRID (EXACT YEEZY REFERENCE: BD-10, WJ-02...) -->
      <section
        class="yeezy-grid"
        [class.is-zoomed]="archiveView.isZoomedGrid()"
        [class.is-filtered]="archiveView.selectedCategory() || archiveView.selectedBrand()"
      >
        @for (item of filteredProducts(); track item.id) {
          <doco-product-card [product]="item" />
        }
      </section>

      <!-- EMPTY STATE IF SEARCH YIELDS 0 RESULTS -->
      @if (filteredProducts().length === 0) {
        <div class="yeezy-empty font-mono">
          <p class="empty-code">[ ∅ ]</p>
          <p class="empty-text">NO HAY PIEZAS DISPONIBLES CON ESTE FILTRO</p>
          <button type="button" class="empty-btn" (click)="resetFilters()">
            [ REINICIAR FILTROS ]
          </button>
        </div>
      }

      <!-- FOOTER LINKS (EXACT YEEZY REFERENCE: CUSTOMER CARE, TERMS, PRIVACY...) -->
      <footer class="yeezy-footer font-mono">
        <div class="footer-links">
          <button type="button" class="foot-link" (click)="openCustomerCare()">CUSTOMER CARE</button>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="foot-link">INSTAGRAM</a>
          <button type="button" class="foot-link" (click)="openWhatsApp()">WHATSAPP</button>
          <button type="button" class="foot-link" (click)="openTerms()">TERMS</button>
          <button type="button" class="foot-link" (click)="openPrivacy()">PRIVACY</button>
          <span class="foot-static">CULIACÁN, SINALOA</span>
        </div>
      </footer>
    </main>

    <!-- CUSTOMER CARE MODAL -->
    @if (modalOpen() === 'care') {
      <div class="info-modal-backdrop" (click)="closeModal()">
        <div class="info-modal-dialog font-mono" role="dialog" aria-modal="true" aria-label="Customer Care DOCO">
          <div class="modal-head">
            <span class="modal-tag">// CUSTOMER CARE</span>
            <button type="button" class="modal-close" (click)="closeModal()">[X]</button>
          </div>
          <div class="modal-body">
            <h2 class="modal-title font-mono">CUIDADO & ATENCIÓN DE PIEZAS</h2>
            <p class="modal-p">
              Todas las prendas de DOCO Archive son piezas originales vintage y de archivo 1-of-1. Cada pieza ha sido inspeccionada físicamente y acondicionada antes de entrar al catálogo.
            </p>
            <div class="modal-specs-list">
              <div class="spec-row">
                <strong>LAVADO:</strong>
                <span>Lavar siempre con agua fría (máx. 30°C) del revés para preservar serigrafías y bordados.</span>
              </div>
              <div class="spec-row">
                <strong>SECADO:</strong>
                <span>Secado al aire libre a la sombra. No utilizar secadora automática en prendas vintage.</span>
              </div>
              <div class="spec-row">
                <strong>PLANCHAR:</strong>
                <span>Planchar a temperatura baja del revés o con paño de protección sobre los gráficos.</span>
              </div>
              <div class="spec-row">
                <strong>ASESORÍA EN TALLAS:</strong>
                <span>Medidas exactas en centímetros disponibles vía WhatsApp para confirmar tu fit antes de apartar.</span>
              </div>
            </div>
            <button type="button" class="modal-btn font-mono" (click)="openWhatsApp()">
              <span>CONSULTAR POR WHATSAPP (+52 667 203 3174)</span>
              <span>↗</span>
            </button>
          </div>
        </div>
      </div>
    }

    <!-- TERMS MODAL -->
    @if (modalOpen() === 'terms') {
      <div class="info-modal-backdrop" (click)="closeModal()">
        <div class="info-modal-dialog font-mono" role="dialog" aria-modal="true" aria-label="Términos DOCO">
          <div class="modal-head">
            <span class="modal-tag">// TERMS & CONDITIONS</span>
            <button type="button" class="modal-close" (click)="closeModal()">[X]</button>
          </div>
          <div class="modal-body">
            <h2 class="modal-title font-mono">TÉRMINOS DEL ARCHIVO</h2>
            <div class="modal-specs-list">
              <div class="spec-row">
                <strong>1. PIEZAS 1-OF-1:</strong>
                <span>Cada artículo publicado en DOCO es una pieza vintage única física en existencia. No hay reposiciones una vez agotada.</span>
              </div>
              <div class="spec-row">
                <strong>2. ENTREGAS LOCALES:</strong>
                <span>Entregas personales inmediatas en puntos céntricos de Culiacán, Sinaloa (Fórum, Tres Ríos, La Primavera, Isla Musala).</span>
              </div>
              <div class="spec-row">
                <strong>3. APARTADOS:</strong>
                <span>Se puede apartar cualquier prenda con un anticipo del 30% mediante transferencia SPEI directa o depósito OXXO.</span>
              </div>
              <div class="spec-row">
                <strong>4. FORMAS DE PAGO:</strong>
                <span>Aceptamos efectivo al entregar en mano en Culiacán, transferencia bancaria SPEI directa y depósito en tiendas OXXO.</span>
              </div>
            </div>
            <button type="button" class="modal-btn font-mono" (click)="closeModal()">
              [ ENTENDIDO ]
            </button>
          </div>
        </div>
      </div>
    }

    <!-- PRIVACY MODAL -->
    @if (modalOpen() === 'privacy') {
      <div class="info-modal-backdrop" (click)="closeModal()">
        <div class="info-modal-dialog font-mono" role="dialog" aria-modal="true" aria-label="Privacidad DOCO">
          <div class="modal-head">
            <span class="modal-tag">// PRIVACY POLICY</span>
            <button type="button" class="modal-close" (click)="closeModal()">[X]</button>
          </div>
          <div class="modal-body">
            <h2 class="modal-title font-mono">POLÍTICA DE PRIVACIDAD</h2>
            <p class="modal-p">
              DOCO Archive protege la privacidad de sus clientes y compradores. La información proporcionada (nombre, número de WhatsApp y dirección de entrega en Culiacán) se utiliza única y exclusivamente para coordinar la entrega y apartado de las prendas solicitadas.
            </p>
            <p class="modal-p">
              No compartimos, vendemos ni transferimos ningún dato personal a terceros. La plataforma opera bajo navegación cifrada de punta a punta.
            </p>
            <button type="button" class="modal-btn font-mono" (click)="closeModal()">
              [ CERRAR ]
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    /* YEEZY CINEMATIC INTRO */
    .yeezy-intro {
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: var(--bg-void);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      padding: 1.5rem;
      user-select: none;
      animation: introFadeIn 0.22s ease-out;
    }

    .yeezy-intro.is-leaving {
      animation: introFadeOut 0.28s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
    }

    @keyframes introFadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    @keyframes introFadeOut {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(1.03);
        pointer-events: none;
      }
    }

    .intro-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 1.5rem;
      text-align: center;
      max-width: 520px;
      margin: auto;
    }

    /* CLICKABLE LOGO TRIGGER (AS REQUESTED) */
    .intro-logo-trigger {
      cursor: pointer;
      display: inline-block;
      transition: transform 0.2s cubic-bezier(0.2, 0.8, 0.4, 1), opacity 0.18s ease;
      padding: 1rem;
    }

    .intro-logo-trigger:hover {
      transform: scale(1.03);
      opacity: 0.92;
    }

    .intro-logo-img {
      width: 100%;
      max-width: 420px;
      height: auto;
      object-fit: contain;
      display: block;
      filter: drop-shadow(0 2px 18px rgba(0, 0, 0, 0.35));
    }

    @media (max-width: 600px) {
      .intro-logo-img {
        max-width: 280px;
      }
    }

    .intro-hint {
      font-size: 0.72rem;
      letter-spacing: 0.16em;
      color: var(--text-dim);
      text-transform: uppercase;
      animation: pulseHint 2.4s infinite ease-in-out;
    }

    @keyframes pulseHint {
      0%, 100% { opacity: 0.45; }
      50% { opacity: 0.95; }
    }

    .intro-meta {
      font-size: 0.65rem;
      letter-spacing: 0.12em;
      color: var(--text-dim);
      text-transform: uppercase;
    }

    /* MAIN STAGE */
    .yeezy-stage {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      min-height: calc(100vh - 48px);
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 1.5rem clamp(1rem, 3.5vw, 3.5rem) 2rem;
    }

    /* EXACT YEEZY 6-COLUMN GRID */
    .yeezy-grid {
      display: grid;
      width: 100%;
      grid-template-columns: repeat(6, 1fr);
      gap: clamp(1.5rem, 3vw, 3rem) clamp(1rem, 2vw, 2.5rem);
      box-sizing: border-box;
      margin-bottom: 5rem;
    }

    @media (max-width: 1400px) {
      .yeezy-grid {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    @media (max-width: 1100px) {
      .yeezy-grid {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 800px) {
      .yeezy-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 1.75rem 1rem;
      }
    }

    @media (max-width: 520px) {
      .yeezy-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.5rem 0.75rem;
      }
    }

    /* ZOOMED GRID (3-COLUMN YEEZY VIEW) */
    .yeezy-grid.is-zoomed {
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(2.5rem, 4.5vw, 5rem) clamp(1.5rem, 3vw, 3.5rem);
    }

    @media (max-width: 1000px) {
      .yeezy-grid.is-zoomed {
        grid-template-columns: repeat(2, 1fr);
        gap: 2rem 1.25rem;
      }
    }

    @media (max-width: 560px) {
      .yeezy-grid.is-zoomed {
        grid-template-columns: 1fr;
        gap: 2.25rem 1rem;
      }
    }

    /* EMPTY STATE */
    .yeezy-empty {
      padding: 6rem 1rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-code {
      font-size: 1.5rem;
      color: var(--text-dim);
      margin: 0;
    }

    .empty-text {
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin: 0;
    }

    .empty-btn {
      background: transparent;
      border: 1px solid var(--border-strong);
      color: var(--text-bone);
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.72rem;
    }

    /* FOOTER (EXACT YEEZY REFERENCE: CUSTOMER CARE, TERMS, PRIVACY) */
    .yeezy-footer {
      margin-top: auto;
      padding: 3rem 0 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      box-sizing: border-box;
    }

    .footer-links {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      align-items: center;
      gap: clamp(1rem, 2.5vw, 2.75rem);
      font-size: 0.72rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
    }

    .foot-link {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      padding: 0;
      font: inherit;
      letter-spacing: inherit;
      transition: color 0.15s ease;
      text-decoration: none;
    }

    .foot-link:hover {
      color: var(--text-bone);
    }

    .foot-static {
      color: var(--text-dim);
    }

    /* INFO MODALS */
    .info-modal-backdrop {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.82);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.25rem;
      box-sizing: border-box;
    }

    [data-theme='light'] .info-modal-backdrop {
      background: rgba(255, 255, 255, 0.88);
    }

    .info-modal-dialog {
      background: var(--bg-void);
      border: 1px solid var(--border-strong);
      width: 100%;
      max-width: 580px;
      padding: 1.75rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      animation: modalPop 0.16s ease-out;
    }

    @keyframes modalPop {
      from {
        opacity: 0;
        transform: scale(0.97);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    .modal-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.5rem;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
    }

    .modal-tag {
      color: var(--text-muted);
    }

    .modal-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.8rem;
    }

    .modal-close:hover {
      color: var(--text-bone);
    }

    .modal-body {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .modal-title {
      font-size: 1.15rem;
      letter-spacing: 0.04em;
      margin: 0;
      color: var(--text-bone);
    }

    .modal-p {
      font-size: 0.78rem;
      line-height: 1.5;
      color: var(--text-secondary);
      margin: 0;
    }

    .modal-specs-list {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 1rem;
      font-size: 0.74rem;
    }

    .spec-row {
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
    }

    .spec-row strong {
      color: var(--text-bone);
      letter-spacing: 0.06em;
    }

    .spec-row span {
      color: var(--text-muted);
      line-height: 1.4;
    }

    .modal-btn {
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      padding: 0.85rem 1rem;
      font-size: 0.78rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  `]
})
export class HomePageComponent {
  readonly archiveView = inject(ArchiveViewService);
  readonly theme = inject(ThemeService);
  private readonly soundFx = inject(SoundFxService);
  private readonly whatsapp = inject(WhatsAppService);

  readonly introLeaving = signal(false);
  readonly modalOpen = signal<'care' | 'terms' | 'privacy' | null>(null);

  private readonly allSummaries: ProductSummary[] = FALLBACK_PRODUCTS.map(toProductSummary);

  readonly filteredProducts = computed(() => {
    let list = this.allSummaries;
    const cat = this.archiveView.selectedCategory();
    const brand = this.archiveView.selectedBrand();
    const q = this.archiveView.searchQuery().trim().toLowerCase();

    if (cat) {
      list = list.filter((p) => p.categorySlug.toLowerCase() === cat.toLowerCase());
    }
    if (brand) {
      list = list.filter((p) => p.brandSlug.toLowerCase() === brand.toLowerCase());
    }
    if (q) {
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brandName.toLowerCase().includes(q) ||
          p.categoryName.toLowerCase().includes(q)
      );
    }
    return list;
  });

  enterArchive(): void {
    if (this.introLeaving()) return;
    this.soundFx.playVault();
    this.introLeaving.set(true);
    setTimeout(() => {
      this.archiveView.closeIntro();
      this.introLeaving.set(false);
    }, 280);
  }

  resetFilters(): void {
    this.soundFx.playClick();
    this.archiveView.resetFilters();
  }

  openCustomerCare(): void {
    this.soundFx.playClick();
    this.modalOpen.set('care');
  }

  openTerms(): void {
    this.soundFx.playClick();
    this.modalOpen.set('terms');
  }

  openPrivacy(): void {
    this.soundFx.playClick();
    this.modalOpen.set('privacy');
  }

  closeModal(): void {
    this.modalOpen.set(null);
  }

  openWhatsApp(): void {
    this.whatsapp.openUrl(this.whatsapp.generateGeneralInquiryUrl());
  }
}
