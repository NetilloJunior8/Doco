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
  filterFallbackProducts,
  toProductSummary
} from '../../core/services/catalog.fallback.data';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';
import { DocoProductCardComponent } from '../../shared/components/doco-product-card.component';

@Component({
  selector: 'doco-home-page',
  standalone: true,
  imports: [DocoProductCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- CINEMATIC INTRO OVERLAY (YEEZY STYLE PORTAL) -->
    @if (archiveView.isIntroOpen()) {
      <div
        class="intro-portal"
        [class.is-leaving]="introLeaving()"
        (click)="enterArchive()"
        role="button"
        tabindex="0"
        aria-label="Entrar al archivo DOCO"
      >
        <div class="intro-portal__inner">
          <div class="intro-logo-box">
            <img
              [src]="theme.isLight() ? '/assets/brand/doco-logo-dark.png' : '/assets/brand/doco-logo-light.png'"
              alt="DOCO"
              class="intro-logo"
            />
          </div>

          <div class="intro-prompt font-mono">
            <span class="prompt-text">[ ENTRAR AL ARCHIVO ]</span>
            <span class="prompt-cursor">_</span>
          </div>

          <div class="intro-meta font-mono">
            <span>CULIACÁN, SINALOA // STREETWEAR & Y2K ARCHIVE</span>
            <span class="intro-hint">TOCA EN CUALQUIER LUGAR PARA EXPLORAR</span>
          </div>
        </div>
      </div>
    }

    <!-- MAIN VISUAL ARCHIVE CONTAINER -->
    <main class="archive-main">
      <!-- ARCHIVE TELEMETRY BAR -->
      <section class="archive-telemetry font-mono">
        <div class="telemetry-left">
          <span class="telemetry-dot"></span>
          <span>DOCO ARCHIVE // DROP 01</span>
          <span class="telemetry-sep">/</span>
          <span class="telemetry-count">{{ filteredProducts().length }} PIEZAS ACTIVAS</span>
        </div>
        <div class="telemetry-right">
          <span>CULIACÁN, SINALOA</span>
        </div>
      </section>

      <!-- VISUAL ARCHIVE GRID -->
      <section
        class="archive-grid"
        [class.density-s]="archiveView.density() === 'S'"
        [class.density-m]="archiveView.density() === 'M'"
        [class.density-l]="archiveView.density() === 'L'"
      >
        @for (item of filteredProducts(); track item.id) {
          <doco-product-card [product]="item" />
        }
      </section>

      <!-- EMPTY STATE -->
      @if (filteredProducts().length === 0) {
        <div class="archive-empty font-mono">
          <span class="empty-code">[ ∅ ]</span>
          <p class="empty-msg">NO SE ENCONTRARON PIEZAS CON LOS FILTROS SELECCIONADOS</p>
          <button type="button" class="empty-reset-btn" (click)="resetFilters()">
            [ REINICIAR FILTROS ]
          </button>
        </div>
      }

      <!-- MINIMAL FOOTER TELEMETRY -->
      <footer class="archive-foot font-mono">
        <div class="foot-col">
          <span class="foot-title">DOCO ARCHIVE</span>
          <span class="foot-text">Culiacán, Sinaloa, México · 1-of-1 Vintage Streetwear</span>
        </div>
        <div class="foot-col foot-col--right">
          <span class="foot-text">ATENCIÓN & APARTADOS: +52 667 203 3174</span>
          <span class="foot-text">PAGOS: EFECTIVO · TRANSFERENCIA SPEI · OXXO</span>
        </div>
      </footer>
    </main>
  `,
  styles: [`
    /* CINEMATIC INTRO PORTAL */
    .intro-portal {
      position: fixed;
      inset: 0;
      z-index: 100000;
      background: var(--bg-void);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      user-select: none;
      animation: introEnter 0.25s ease-out;
      overflow: hidden;
      width: 100vw;
      height: 100vh;
      box-sizing: border-box;
      padding: 1.5rem;
    }

    .intro-portal.is-leaving {
      animation: introExit 0.32s cubic-bezier(0.2, 0.9, 0.3, 1) forwards;
    }

    @keyframes introEnter {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes introExit {
      from {
        opacity: 1;
        transform: scale(1);
      }
      to {
        opacity: 0;
        transform: scale(1.04);
        pointer-events: none;
      }
    }

    .intro-portal__inner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2rem;
      text-align: center;
      max-width: 600px;
      margin: auto;
    }

    .intro-logo-box {
      width: 100%;
      max-width: 440px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    @media (max-width: 640px) {
      .intro-logo-box {
        max-width: 290px;
      }
    }

    .intro-logo {
      width: 100%;
      height: auto;
      object-fit: contain;
      filter: drop-shadow(0 2px 14px rgba(0, 0, 0, 0.4));
    }

    .intro-prompt {
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
      font-size: 0.88rem;
      letter-spacing: 0.14em;
      color: var(--text-bone);
      border: 1px solid var(--border-strong);
      padding: 0.75rem 1.75rem;
      background: var(--bg-surface);
      text-transform: uppercase;
      transition: background 0.15s ease, transform 0.15s ease;
    }

    .intro-portal:hover .intro-prompt {
      background: var(--text-bone);
      color: var(--bg-void);
      transform: translateY(-1px);
    }

    .prompt-cursor {
      animation: blink 1s infinite steps(2, start);
    }

    @keyframes blink {
      to {
        visibility: hidden;
      }
    }

    .intro-meta {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.68rem;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .intro-hint {
      color: var(--text-dim);
      font-size: 0.6rem;
    }

    /* MAIN ARCHIVE LAYOUT */
    .archive-main {
      width: 100%;
      max-width: 100%;
      overflow-x: hidden;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      padding: 0 clamp(0.75rem, 2.5vw, 2.5rem);
    }

    .archive-telemetry {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0.85rem 0;
      border-bottom: 1px solid var(--border-subtle);
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      text-transform: uppercase;
    }

    .telemetry-left {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }

    .telemetry-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
    }

    .telemetry-sep {
      color: var(--text-dim);
    }

    .telemetry-count {
      color: var(--text-bone);
      font-weight: 600;
    }

    .telemetry-right {
      display: none;
    }

    @media (min-width: 640px) {
      .telemetry-right {
        display: block;
      }
    }

    /* ARCHIVE GRID */
    .archive-grid {
      display: grid;
      width: 100%;
      padding: 1.5rem 0 3.5rem;
      box-sizing: border-box;
      gap: clamp(1rem, 2vw, 2rem) clamp(0.75rem, 1.8vw, 1.75rem);
    }

    /* DENSITY M (DEFAULT): 5 cols desktop, 4 tablet, 2 mobile */
    .archive-grid.density-m {
      grid-template-columns: repeat(5, 1fr);
    }

    @media (max-width: 1200px) {
      .archive-grid.density-m {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 900px) {
      .archive-grid.density-m {
        grid-template-columns: repeat(3, 1fr);
      }
    }

    @media (max-width: 600px) {
      .archive-grid.density-m {
        grid-template-columns: repeat(2, 1fr);
        gap: 1.25rem 0.65rem;
      }
    }

    /* DENSITY S (COMPACT - HOVERSTAT STYLE): 7-8 cols desktop, 5 tablet, 3 mobile */
    .archive-grid.density-s {
      grid-template-columns: repeat(7, 1fr);
      gap: clamp(0.6rem, 1.2vw, 1.25rem);
    }

    @media (min-width: 1500px) {
      .archive-grid.density-s {
        grid-template-columns: repeat(8, 1fr);
      }
    }

    @media (max-width: 1200px) {
      .archive-grid.density-s {
        grid-template-columns: repeat(5, 1fr);
      }
    }

    @media (max-width: 800px) {
      .archive-grid.density-s {
        grid-template-columns: repeat(4, 1fr);
      }
    }

    @media (max-width: 540px) {
      .archive-grid.density-s {
        grid-template-columns: repeat(3, 1fr);
        gap: 0.75rem 0.45rem;
      }
    }

    /* DENSITY L (EDITORIAL): 3 cols desktop, 2 tablet, 1 mobile */
    .archive-grid.density-l {
      grid-template-columns: repeat(3, 1fr);
      gap: clamp(1.5rem, 3vw, 3rem);
    }

    @media (max-width: 900px) {
      .archive-grid.density-l {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    @media (max-width: 540px) {
      .archive-grid.density-l {
        grid-template-columns: 1fr;
      }
    }

    /* EMPTY STATE */
    .archive-empty {
      padding: 5rem 1rem;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }

    .empty-code {
      font-size: 1.5rem;
      color: var(--text-dim);
    }

    .empty-msg {
      font-size: 0.78rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      margin: 0;
    }

    .empty-reset-btn {
      background: transparent;
      border: 1px solid var(--border-strong);
      color: var(--text-bone);
      padding: 0.5rem 1rem;
      cursor: pointer;
      font-size: 0.72rem;
    }

    /* MINIMAL FOOTER */
    .archive-foot {
      margin-top: auto;
      border-top: 1px solid var(--border-subtle);
      padding: 2rem 0 3rem;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1.5rem;
      font-size: 0.68rem;
      color: var(--text-muted);
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .foot-col {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }

    .foot-col--right {
      text-align: right;
    }

    @media (max-width: 640px) {
      .foot-col--right {
        text-align: left;
      }
    }

    .foot-title {
      font-weight: 700;
      color: var(--text-bone);
    }
  `]
})
export class HomePageComponent {
  readonly archiveView = inject(ArchiveViewService);
  readonly theme = inject(ThemeService);
  private readonly soundFx = inject(SoundFxService);

  readonly introLeaving = signal(false);

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
}
