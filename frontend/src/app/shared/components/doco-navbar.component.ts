import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ArchiveViewService } from '../../core/services/archive-view.service';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { FALLBACK_BRANDS, FALLBACK_CATEGORIES } from '../../core/services/catalog.fallback.data';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'doco-navbar',
  standalone: true,
  imports: [RouterLink, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="arch-nav" [class.arch-nav--open]="archiveView.isFilterOpen()">
      <div class="arch-nav__inner font-mono">
        <!-- LEFT: FILTER TOGGLE -->
        <div class="arch-nav__left">
          <button
            type="button"
            class="nav-btn nav-btn--filter"
            [class.is-active]="archiveView.isFilterOpen() || archiveView.selectedCategory() || archiveView.selectedBrand()"
            (click)="toggleFilters()"
            aria-label="Abrir filtros del archivo"
          >
            <span class="btn-sign">{{ archiveView.isFilterOpen() ? '−' : '+' }}</span>
            <span>FILTRO{{ activeFilterCount() ? ' (' + activeFilterCount() + ')' : '' }}</span>
          </button>
        </div>

        <!-- CENTER: DISCREET DOCO LOGO -->
        <div class="arch-nav__center">
          <a routerLink="/" class="arch-brand" (click)="onLogoClick($event)" aria-label="DOCO Archivo">
            <img
              [src]="theme.isLight() ? '/assets/brand/doco-logo-dark.png' : '/assets/brand/doco-logo-light.png'"
              alt="DOCO"
              class="arch-logo"
            />
            <span class="arch-tag">ARCHIVE</span>
          </a>
        </div>

        <!-- RIGHT: UTILITIES (DENSITY, BAG, THEME, INFO) -->
        <div class="arch-nav__right">
          <!-- Density Switcher (Desktop/Tablet) -->
          <div class="density-group">
            <button
              type="button"
              class="density-btn"
              [class.is-active]="archiveView.density() === 'S'"
              (click)="setDensity('S')"
              title="Vista compacta (alta densidad)"
            >
              S
            </button>
            <button
              type="button"
              class="density-btn"
              [class.is-active]="archiveView.density() === 'M'"
              (click)="setDensity('M')"
              title="Vista estándar"
            >
              M
            </button>
            <button
              type="button"
              class="density-btn"
              [class.is-active]="archiveView.density() === 'L'"
              (click)="setDensity('L')"
              title="Vista editorial (grande)"
            >
              L
            </button>
          </div>

          <!-- Theme Toggle -->
          <button
            type="button"
            class="nav-btn nav-btn--theme"
            (click)="toggleTheme()"
            aria-label="Cambiar modo de color"
            title="Alternar modo claro / oscuro"
          >
            {{ theme.isLight() ? 'DARK' : 'WHITE' }}
          </button>

          <!-- Info Dialog Trigger -->
          <button
            type="button"
            class="nav-btn nav-btn--info"
            (click)="toggleInfo()"
            aria-label="Información sobre DOCO en Culiacán"
          >
            INFO
          </button>

          <!-- Cart Drawer Trigger -->
          <button
            type="button"
            class="nav-btn nav-btn--bag"
            (click)="openCart()"
            aria-label="Abrir bolsa de compras"
          >
            BOLSA ({{ cart.itemCount() }})
          </button>

          @if (auth.isAdmin()) {
            <a routerLink="/admin" class="nav-btn nav-btn--admin">ADMIN</a>
          }
        </div>
      </div>

      <!-- MINIMALIST EXPANDABLE FILTER DRAWER -->
      @if (archiveView.isFilterOpen()) {
        <div class="arch-filters font-mono">
          <div class="filters-inner">
            <!-- Search field -->
            <div class="filter-search-row">
              <span class="search-prefix">BUSCAR:</span>
              <input
                type="search"
                class="filter-search-input font-mono"
                placeholder="Nombre, marca, SKU o palabra clave..."
                [ngModel]="archiveView.searchQuery()"
                (ngModelChange)="archiveView.setSearch($event)"
              />
              @if (archiveView.searchQuery()) {
                <button type="button" class="clear-search-btn" (click)="archiveView.setSearch('')">X</button>
              }
            </div>

            <!-- Categories -->
            <div class="filter-section">
              <span class="filter-label">CATEGORÍA:</span>
              <div class="filter-pills">
                <button
                  type="button"
                  class="pill-btn"
                  [class.is-active]="!archiveView.selectedCategory()"
                  (click)="archiveView.selectCategory(null)"
                >
                  TODAS
                </button>
                @for (cat of categories; track cat.id) {
                  <button
                    type="button"
                    class="pill-btn"
                    [class.is-active]="archiveView.selectedCategory() === cat.slug"
                    (click)="archiveView.selectCategory(cat.slug)"
                  >
                    {{ cat.name }}
                  </button>
                }
              </div>
            </div>

            <!-- Brands -->
            <div class="filter-section">
              <span class="filter-label">MARCA:</span>
              <div class="filter-pills">
                <button
                  type="button"
                  class="pill-btn"
                  [class.is-active]="!archiveView.selectedBrand()"
                  (click)="archiveView.selectBrand(null)"
                >
                  TODAS
                </button>
                @for (br of brands; track br.id) {
                  <button
                    type="button"
                    class="pill-btn"
                    [class.is-active]="archiveView.selectedBrand() === br.slug"
                    (click)="archiveView.selectBrand(br.slug)"
                  >
                    {{ br.name }}
                  </button>
                }
              </div>
            </div>

            <div class="filter-actions-row">
              <button
                type="button"
                class="reset-btn"
                (click)="archiveView.resetFilters()"
              >
                [ REINICIAR FILTROS ]
              </button>
              <button
                type="button"
                class="apply-btn"
                (click)="archiveView.closeFilters()"
              >
                [ CERRAR FILTROS ]
              </button>
            </div>
          </div>
        </div>
      }
    </header>

    <!-- MINIMALIST INFO MODAL (CULIACÁN MANIFESTO) -->
    @if (archiveView.isInfoOpen()) {
      <div class="info-overlay" (click)="onInfoBackdropClick($event)">
        <div class="info-dialog font-mono" role="dialog" aria-modal="true" aria-label="Información DOCO Archive">
          <div class="info-head">
            <span class="info-tag">// ARCHIVO DOCO</span>
            <button type="button" class="info-close" (click)="archiveView.closeInfo()">[X] ESC</button>
          </div>

          <div class="info-body">
            <h3 class="info-title font-display">DOCO ARCHIVE</h3>
            <p class="info-desc">
              Archivo independiente de streetwear curado y piezas vintage 1-of-1 con base en Culiacán, Sinaloa. Cada prenda pasa por un proceso de verificación física de autenticidad, condición del tejido y conservación de gráficos originales.
            </p>

            <div class="info-grid">
              <div class="info-row">
                <span class="row-k">BASE:</span>
                <strong class="row-v">CULIACÁN, SINALOA, MÉXICO</strong>
              </div>
              <div class="info-row">
                <span class="row-k">ENTREGAS:</span>
                <strong class="row-v">PUNTOS CLAVE EN CULIACÁN & ENVÍOS</strong>
              </div>
              <div class="info-row">
                <span class="row-k">PAGOS:</span>
                <strong class="row-v">EFECTIVO AL RECIBIR, SPEI DIRECTO, OXXO</strong>
              </div>
              <div class="info-row">
                <span class="row-k">APARTADOS:</span>
                <strong class="row-v">30% DE ANTICIPO VÍA WHATSAPP</strong>
              </div>
              <div class="info-row">
                <span class="row-k">CONTACTO:</span>
                <strong class="row-v">+52 667 203 3174</strong>
              </div>
            </div>

            <div class="info-actions">
              <button
                type="button"
                class="info-wa-btn"
                (click)="openWhatsAppContact()"
              >
                <span>CONTACTAR POR WHATSAPP</span>
                <span>↗</span>
              </button>
              <button
                type="button"
                class="info-intro-btn"
                (click)="reopenIntro()"
              >
                <span>VER INTRO DOCO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .arch-nav {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--bg-glass);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-subtle);
      width: 100%;
      box-sizing: border-box;
      transition: background 0.2s ease, border-color 0.2s ease;
    }

    .arch-nav__inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      padding: 0 clamp(0.75rem, 2.5vw, 1.75rem);
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      box-sizing: border-box;
      width: 100%;
    }

    .arch-nav__left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .arch-nav__center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .arch-brand {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      text-decoration: none;
      color: var(--text-bone);
    }

    .arch-logo {
      height: 19px;
      width: auto;
      object-fit: contain;
      display: block;
    }

    .arch-tag {
      font-size: 0.62rem;
      letter-spacing: 0.12em;
      color: var(--text-muted);
      display: none;
    }

    @media (min-width: 640px) {
      .arch-tag {
        display: inline;
      }
    }

    .arch-nav__right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: clamp(0.4rem, 1.2vw, 1rem);
      flex: 1;
    }

    .nav-btn {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      padding: 0.35rem 0.5rem;
      white-space: nowrap;
      transition: color 0.15s ease, opacity 0.15s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.25rem;
    }

    .nav-btn:hover {
      opacity: 0.75;
    }

    .nav-btn--filter.is-active {
      color: var(--text-bone);
      text-decoration: underline;
      text-underline-offset: 3px;
    }

    .nav-btn--bag {
      font-weight: 600;
    }

    .density-group {
      display: none;
      align-items: center;
      gap: 2px;
      border: 1px solid var(--border-subtle);
      padding: 2px;
      background: var(--bg-surface);
    }

    @media (min-width: 768px) {
      .density-group {
        display: flex;
      }
    }

    .density-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.65rem;
      font-weight: 600;
      padding: 0.2rem 0.45rem;
      line-height: 1;
      transition: all 0.15s ease;
    }

    .density-btn.is-active {
      background: var(--text-bone);
      color: var(--bg-void);
    }

    /* EXPANDABLE FILTER DRAWER */
    .arch-filters {
      background: var(--bg-void);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-strong);
      padding: 1.25rem clamp(0.75rem, 2.5vw, 1.75rem);
      box-sizing: border-box;
      animation: filterSlide 0.18s cubic-bezier(0.2, 0.9, 0.3, 1);
    }

    @keyframes filterSlide {
      from {
        opacity: 0;
        transform: translateY(-6px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .filters-inner {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .filter-search-row {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.5rem;
    }

    .search-prefix {
      font-size: 0.68rem;
      color: var(--text-muted);
    }

    .filter-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-bone);
      font-size: 0.78rem;
    }

    .clear-search-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.72rem;
    }

    .filter-section {
      display: flex;
      flex-direction: column;
      gap: 0.4rem;
    }

    @media (min-width: 640px) {
      .filter-section {
        flex-direction: row;
        align-items: center;
        gap: 0.85rem;
      }
    }

    .filter-label {
      font-size: 0.65rem;
      color: var(--text-dim);
      min-width: 85px;
    }

    .filter-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }

    .pill-btn {
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.65rem;
      letter-spacing: 0.06em;
      padding: 0.3rem 0.65rem;
      transition: all 0.12s ease;
      text-transform: uppercase;
    }

    .pill-btn:hover {
      border-color: var(--border-strong);
      color: var(--text-bone);
    }

    .pill-btn.is-active {
      background: var(--text-bone);
      border-color: var(--text-bone);
      color: var(--bg-void);
      font-weight: 600;
    }

    .filter-actions-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
    }

    .reset-btn,
    .apply-btn {
      background: transparent;
      border: none;
      cursor: pointer;
      font-size: 0.68rem;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      padding: 0.25rem 0.5rem;
    }

    .reset-btn:hover,
    .apply-btn:hover {
      color: var(--text-bone);
    }

    /* INFO OVERLAY */
    .info-overlay {
      position: fixed;
      inset: 0;
      z-index: 99999;
      background: rgba(0, 0, 0, 0.85);
      backdrop-filter: blur(6px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
      box-sizing: border-box;
    }

    [data-theme='light'] .info-overlay {
      background: rgba(255, 255, 255, 0.9);
    }

    .info-dialog {
      background: var(--bg-void);
      border: 1px solid var(--border-strong);
      width: 100%;
      max-width: 560px;
      padding: 1.5rem;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }

    .info-head {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.5rem;
      font-size: 0.72rem;
    }

    .info-tag {
      color: var(--text-muted);
    }

    .info-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.72rem;
    }

    .info-close:hover {
      color: var(--text-bone);
    }

    .info-title {
      font-size: 1.35rem;
      letter-spacing: -0.02em;
      color: var(--text-bone);
      margin: 0 0 0.5rem;
    }

    .info-desc {
      font-size: 0.82rem;
      line-height: 1.5;
      color: var(--text-secondary);
      margin: 0;
      font-family: var(--font-sans);
    }

    .info-grid {
      display: flex;
      flex-direction: column;
      gap: 0.65rem;
      border: 1px solid var(--border-subtle);
      background: var(--bg-surface);
      padding: 0.85rem;
      font-size: 0.72rem;
    }

    .info-row {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
    }

    .row-k {
      color: var(--text-dim);
    }

    .row-v {
      color: var(--text-bone);
      text-align: right;
    }

    .info-actions {
      display: flex;
      gap: 0.65rem;
    }

    .info-wa-btn {
      flex: 1;
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-weight: 700;
      font-size: 0.76rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
      letter-spacing: 0.06em;
    }

    .info-intro-btn {
      background: transparent;
      color: var(--text-bone);
      border: 1px solid var(--border-subtle);
      padding: 0.75rem 1rem;
      cursor: pointer;
      font-size: 0.74rem;
    }
  `]
})
export class DocoNavbarComponent {
  readonly archiveView = inject(ArchiveViewService);
  readonly theme = inject(ThemeService);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly soundFx = inject(SoundFxService);
  private readonly router = inject(Router);

  readonly categories = FALLBACK_CATEGORIES;
  readonly brands = FALLBACK_BRANDS;

  activeFilterCount(): number {
    let count = 0;
    if (this.archiveView.selectedCategory()) count++;
    if (this.archiveView.selectedBrand()) count++;
    if (this.archiveView.searchQuery().trim()) count++;
    return count;
  }

  toggleFilters(): void {
    this.soundFx.playClick();
    this.archiveView.toggleFilters();
  }

  toggleTheme(): void {
    this.soundFx.playClick();
    this.theme.toggle();
  }

  toggleInfo(): void {
    this.soundFx.playClick();
    this.archiveView.toggleInfo();
  }

  openCart(): void {
    this.soundFx.playClick();
    this.cart.openDrawer();
  }

  setDensity(d: 'S' | 'M' | 'L'): void {
    this.soundFx.playClick();
    this.archiveView.setDensity(d);
  }

  onLogoClick(e: Event): void {
    this.soundFx.playClick();
    if (typeof window !== 'undefined' && window.scrollY === 0) {
      // Re-trigger intro if at top
      this.archiveView.openIntro();
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  onInfoBackdropClick(e: MouseEvent): void {
    if (e.target === e.currentTarget) {
      this.archiveView.closeInfo();
    }
  }

  openWhatsAppContact(): void {
    if (typeof window !== 'undefined') {
      const msg = encodeURIComponent('Hola DOCO! Me gustaría consultar disponibilidad de piezas del archivo en Culiacán.');
      window.open(`https://wa.me/526672033174?text=${msg}`, '_blank', 'noopener,noreferrer');
    }
  }

  reopenIntro(): void {
    this.archiveView.closeInfo();
    this.archiveView.openIntro();
  }
}
