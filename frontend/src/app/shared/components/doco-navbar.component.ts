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
    <header class="yeezy-nav" [class.is-open]="archiveView.isFilterOpen()">
      <div class="yeezy-nav__inner">
        <!-- TOP LEFT: PLUS SYMBOL (+) / ZOOM SWITCHER (EXACT YEEZY REFERENCE) -->
        <div class="yeezy-nav__left">
          <button
            type="button"
            class="yeezy-plus-btn font-mono"
            [class.is-active]="archiveView.isZoomedGrid()"
            (click)="toggleZoom()"
            [attr.aria-label]="archiveView.isZoomedGrid() ? 'Vista normal de cuadrícula' : 'Ampliar prendas en cuadrícula'"
            [title]="archiveView.isZoomedGrid() ? 'Vista normal' : 'Ampliar prendas'"
          >
            <span class="plus-icon">{{ archiveView.isZoomedGrid() ? '‹' : '+' }}</span>
          </button>

          <button
            type="button"
            class="yeezy-filter-icon-btn font-mono"
            [class.is-active]="archiveView.isFilterOpen()"
            (click)="toggleFilters()"
            aria-label="Buscar y filtrar prendas"
            title="Buscar y filtrar"
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="11" cy="11" r="7" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>
        </div>

        <!-- TOP CENTER: DISCREET SMALL THEDOCOO LOGO -->
        <div class="yeezy-nav__center">
          <a routerLink="/" class="yeezy-brand" (click)="onLogoClick($event)" aria-label="Thedocoo">
            <img
              [src]="theme.isLight() ? '/assets/brand/doco-logo-dark.png' : '/assets/brand/doco-logo-light.png'"
              alt="Thedocoo"
              class="yeezy-logo"
            />
          </a>
        </div>

        <!-- TOP RIGHT: THEME TOGGLE & SHOPPING BAG ICON -->
        <div class="yeezy-nav__right font-mono">
          <!-- Theme Toggle -->
          <button
            type="button"
            class="yeezy-theme-btn"
            (click)="toggleTheme()"
            aria-label="Cambiar tema de color"
            title="Alternar blanco y negro"
          >
            {{ theme.isLight() ? 'DARK' : 'WHITE' }}
          </button>

          <!-- Minimal Yeezy Shopping Bag Icon -->
          <button
            type="button"
            class="yeezy-bag-btn"
            (click)="openCart()"
            aria-label="Abrir bolsa de compras"
            title="Bolsa de compras"
          >
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.8" class="bag-svg">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <span class="bag-count">({{ cart.itemCount() }})</span>
          </button>

          @if (auth.isAdmin()) {
            <a routerLink="/admin" class="yeezy-admin-link">ADMIN</a>
          }
        </div>
      </div>

      <!-- EXPANDABLE MINIMALIST SEARCH & CATEGORIES DRAWER -->
      @if (archiveView.isFilterOpen()) {
        <div class="yeezy-filter-drawer font-mono">
          <div class="filter-drawer-inner">
            <!-- Search bar -->
            <div class="drawer-search-row">
              <span class="search-label">BUSCAR:</span>
              <input
                type="search"
                class="drawer-search-input font-mono"
                placeholder="Nombre, marca, SKU o estilo..."
                [ngModel]="archiveView.searchQuery()"
                (ngModelChange)="archiveView.setSearch($event)"
              />
              @if (archiveView.searchQuery()) {
                <button type="button" class="clear-btn" (click)="archiveView.setSearch('')">[X]</button>
              }
            </div>

            <!-- Categories -->
            <div class="drawer-row">
              <span class="row-label">CATEGORÍA:</span>
              <div class="row-items">
                <button
                  type="button"
                  class="filter-pill"
                  [class.is-active]="!archiveView.selectedCategory()"
                  (click)="archiveView.selectCategory(null)"
                >
                  TODAS
                </button>
                @for (cat of categories; track cat.id) {
                  <button
                    type="button"
                    class="filter-pill"
                    [class.is-active]="archiveView.selectedCategory() === cat.slug"
                    (click)="archiveView.selectCategory(cat.slug)"
                  >
                    {{ cat.name }}
                  </button>
                }
              </div>
            </div>

            <!-- Brands -->
            <div class="drawer-row">
              <span class="row-label">MARCA:</span>
              <div class="row-items">
                <button
                  type="button"
                  class="filter-pill"
                  [class.is-active]="!archiveView.selectedBrand()"
                  (click)="archiveView.selectBrand(null)"
                >
                  TODAS
                </button>
                @for (br of brands; track br.id) {
                  <button
                    type="button"
                    class="filter-pill"
                    [class.is-active]="archiveView.selectedBrand() === br.slug"
                    (click)="archiveView.selectBrand(br.slug)"
                  >
                    {{ br.name }}
                  </button>
                }
              </div>
            </div>

            <!-- Footer actions -->
            <div class="drawer-actions">
              <button type="button" class="action-btn" (click)="archiveView.resetFilters()">
                [ REINICIAR FILTROS ]
              </button>
              <button type="button" class="action-btn" (click)="archiveView.closeFilters()">
                [ CERRAR ]
              </button>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .yeezy-nav {
      position: sticky;
      top: 0;
      left: 0;
      right: 0;
      z-index: 1000;
      background: var(--bg-void);
      width: 100%;
      box-sizing: border-box;
      transition: background 0.15s ease;
    }

    .yeezy-nav__inner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      padding: 0 clamp(1rem, 3vw, 2.5rem);
      width: 100%;
      box-sizing: border-box;
    }

    .yeezy-nav__left {
      display: flex;
      align-items: center;
      flex: 1;
    }

    .yeezy-plus-btn {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      font-size: 1.5rem;
      line-height: 1;
      padding: 0.25rem 0.5rem 0.25rem 0;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      transition: transform 0.15s ease, opacity 0.15s ease;
    }

    .yeezy-plus-btn:hover {
      opacity: 0.7;
      transform: scale(1.08);
    }

    .plus-icon {
      font-weight: 300;
    }

    .yeezy-filter-icon-btn {
      background: transparent;
      border: none;
      color: var(--text-dim);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 0.25rem 0.5rem;
      margin-left: 0.25rem;
      transition: color 0.15s ease, opacity 0.15s ease;
    }

    .yeezy-filter-icon-btn:hover,
    .yeezy-filter-icon-btn.is-active {
      color: var(--text-bone);
    }

    .yeezy-nav__center {
      display: flex;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .yeezy-brand {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      text-decoration: none;
      cursor: pointer;
    }

    .yeezy-logo {
      height: 18px;
      width: auto;
      object-fit: contain;
      display: block;
      transition: opacity 0.15s ease;
    }

    .yeezy-logo:hover {
      opacity: 0.8;
    }

    .yeezy-nav__right {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 1.25rem;
      flex: 1;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }

    .yeezy-theme-btn {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      padding: 0.25rem 0.4rem;
      transition: opacity 0.15s ease;
    }

    .yeezy-theme-btn:hover {
      opacity: 0.7;
    }

    .yeezy-bag-btn {
      background: transparent;
      border: none;
      color: var(--text-bone);
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.25rem 0;
      transition: opacity 0.15s ease;
    }

    .yeezy-bag-btn:hover {
      opacity: 0.7;
    }

    .bag-svg {
      display: block;
    }

    .bag-count {
      font-size: 0.75rem;
      font-weight: 500;
    }

    .yeezy-admin-link {
      color: var(--text-muted);
      text-decoration: none;
      font-size: 0.7rem;
    }

    /* EXPANDABLE FILTER DRAWER */
    .yeezy-filter-drawer {
      background: var(--bg-void);
      border-top: 1px solid var(--border-subtle);
      border-bottom: 1px solid var(--border-strong);
      padding: 1.25rem clamp(1rem, 3vw, 2.5rem);
      box-sizing: border-box;
      animation: yeezyFilterIn 0.16s ease-out;
    }

    @keyframes yeezyFilterIn {
      from {
        opacity: 0;
        transform: translateY(-4px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .filter-drawer-inner {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .drawer-search-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      border-bottom: 1px solid var(--border-subtle);
      padding-bottom: 0.5rem;
    }

    .search-label {
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    .drawer-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      color: var(--text-bone);
      font-size: 0.8rem;
    }

    .clear-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.75rem;
    }

    .drawer-row {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    @media (min-width: 640px) {
      .drawer-row {
        flex-direction: row;
        align-items: center;
        gap: 1rem;
      }
    }

    .row-label {
      font-size: 0.68rem;
      color: var(--text-dim);
      min-width: 90px;
    }

    .row-items {
      display: flex;
      flex-wrap: wrap;
      gap: 0.4rem;
    }

    .filter-pill {
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.68rem;
      padding: 0.3rem 0.65rem;
      letter-spacing: 0.06em;
      transition: all 0.12s ease;
      text-transform: uppercase;
    }

    .filter-pill:hover {
      border-color: var(--border-strong);
      color: var(--text-bone);
    }

    .filter-pill.is-active {
      background: var(--text-bone);
      color: var(--bg-void);
      border-color: var(--text-bone);
      font-weight: 600;
    }

    .drawer-actions {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      padding-top: 0.5rem;
      border-top: 1px solid var(--border-subtle);
    }

    .action-btn {
      background: transparent;
      border: none;
      color: var(--text-muted);
      cursor: pointer;
      font-size: 0.72rem;
      letter-spacing: 0.08em;
      padding: 0.25rem 0.5rem;
    }

    .action-btn:hover {
      color: var(--text-bone);
    }
  `]
})
export class DocoNavbarComponent {
  readonly archiveView = inject(ArchiveViewService);
  readonly theme = inject(ThemeService);
  readonly cart = inject(CartService);
  readonly auth = inject(AuthService);
  private readonly soundFx = inject(SoundFxService);

  readonly categories = FALLBACK_CATEGORIES;
  readonly brands = FALLBACK_BRANDS;

  toggleZoom(): void {
    this.soundFx.playClick();
    this.archiveView.toggleGridZoom();
  }

  toggleFilters(): void {
    this.soundFx.playClick();
    this.archiveView.toggleFilters();
  }

  toggleTheme(): void {
    this.soundFx.playClick();
    this.theme.toggle();
  }

  openCart(): void {
    this.soundFx.playClick();
    this.cart.openDrawer();
  }

  onLogoClick(e: Event): void {
    this.soundFx.playClick();
    if (typeof window !== 'undefined' && window.scrollY === 0) {
      this.archiveView.openIntro();
    } else if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
}
