import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CartService } from '../../core/services/cart.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'doco-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- TOP KINETIC MARQUEE -->
    <div class="ticker-bar" aria-label="Anuncios de drop">
      <div class="ticker-track font-mono">
        <span>DOCO ARCHIVE // DROP #01 · ENTREGA LOCAL EN CULIACÁN, SINALOA · PIEZAS 1-OF-1 DEADSTOCK & VINTAGE STREETWEAR · 100% HEAVYWEIGHT COTTON · CATÁLOGO EXCLUSIVO ·&nbsp;</span>
        <span>DOCO ARCHIVE // DROP #01 · ENTREGA LOCAL EN CULIACÁN, SINALOA · PIEZAS 1-OF-1 DEADSTOCK & VINTAGE STREETWEAR · 100% HEAVYWEIGHT COTTON · CATÁLOGO EXCLUSIVO ·&nbsp;</span>
      </div>
    </div>

    <header class="nav-shell">
      <div class="doco-container nav-inner">
        <div class="nav-left">
          <a routerLink="/" class="brand" aria-label="DOCO Inicio" (click)="closeMobileMenu()">
            <img
              [src]="theme.isLight() ? '/assets/brand/doco-logo-dark.png' : '/assets/brand/doco-logo-light.png'"
              alt="DOCO"
              class="brand__logo"
            />
            <div class="brand__text">
              <span class="brand__name font-display">DOCO</span>
              <div class="brand__sub-row font-mono">
                <span class="brand-radar-dot"></span>
                <span class="brand__sub">CULIACÁN // ARCHIVE</span>
              </div>
            </div>
          </a>
        </div>

        <nav class="nav-links font-mono" aria-label="Navegación principal">
          <a routerLink="/" routerLinkActive="is-active" [routerLinkActiveOptions]="{ exact: true }" (click)="onNavClick()">INICIO</a>
          <a routerLink="/catalog" routerLinkActive="is-active" (click)="onNavClick()">CATÁLOGO</a>
          <a [routerLink]="['/catalog']" [queryParams]="{ era: 'Y2K' }" (click)="onNavClick()">Y2K</a>
          <a [routerLink]="['/catalog']" [queryParams]="{ era: 'WORKWEAR' }" (click)="onNavClick()">WORKWEAR</a>
          <a [routerLink]="['/catalog']" [queryParams]="{ era: 'STREETWEAR' }" (click)="onNavClick()">STREETWEAR</a>
          @if (auth.isAdmin()) {
            <a routerLink="/admin" routerLinkActive="is-active" class="nav-admin" (click)="onNavClick()">ADMIN</a>
          }
        </nav>

        <div class="nav-actions">
          <form class="search-box" (ngSubmit)="submitSearch()">
            <input
              type="search"
              [(ngModel)]="searchTerm"
              name="q"
              placeholder="Buscar Carhartt, BAPE..."
              aria-label="Buscar prendas"
            />
          </form>

          <!-- Audio FX Synthesizer Toggle (Desktop only) -->
          <button
            type="button"
            class="fx-btn font-mono desktop-only"
            (click)="soundFx.toggle()"
            [class.is-active]="soundFx.isEnabled()"
            title="Activar/Desactivar efectos de sonido"
          >
            <span>{{ soundFx.isEnabled() ? 'FX: ON' : 'FX: OFF' }}</span>
          </button>

          <!-- Theme White/Dark Toggle (Desktop only) -->
          <button
            type="button"
            class="theme-btn font-mono desktop-only"
            (click)="toggleTheme()"
            [attr.aria-label]="theme.isLight() ? 'Cambiar a modo oscuro' : 'Cambiar a modo claro'"
            title="Alternar entre White Mode y Dark Mode"
          >
            <span>{{ theme.isLight() ? 'DARK' : 'WHITE' }}</span>
          </button>

          @if (auth.isAdmin()) {
            <a routerLink="/admin" class="action-pill font-mono desktop-only" (click)="onNavClick()">ADMIN</a>
          }
          @if (auth.isAuthenticated()) {
            <button type="button" class="action-pill font-mono desktop-only" (click)="auth.logout()">
              SALIR
            </button>
          }

          <button type="button" class="bag-btn font-mono" (click)="cart.openDrawer()" aria-label="Abrir bolsa de compras">
            <span class="bag-btn__label">BOLSA</span>
            <span class="bag-btn__count">{{ cart.itemCount() }}</span>
          </button>

          <!-- Mobile menu toggle (Mobile only) -->
          <button
            type="button"
            class="mobile-menu-btn font-mono"
            (click)="toggleMobileMenu()"
            [attr.aria-expanded]="mobileMenuOpen()"
            aria-label="Abrir menú de navegación"
          >
            <span>{{ mobileMenuOpen() ? '✕' : 'MENÚ' }}</span>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Navigation -->
      @if (mobileMenuOpen()) {
        <div class="mobile-drawer">
          <div class="doco-container mobile-drawer__inner">
            <form class="mobile-search" (ngSubmit)="submitSearch()">
              <input
                type="search"
                [(ngModel)]="searchTerm"
                name="mobileQ"
                placeholder="Buscar por marca, talla, SKU..."
                aria-label="Buscar en catálogo móvil"
              />
              <button type="submit" class="font-mono">IR</button>
            </form>

            <nav class="mobile-links font-display" aria-label="Menú móvil">
              <a routerLink="/" (click)="closeMobileMenu()">INICIO</a>
              <a routerLink="/catalog" (click)="closeMobileMenu()">CATÁLOGO COMPLETO</a>
              <a [routerLink]="['/catalog']" [queryParams]="{ era: 'Y2K' }" (click)="closeMobileMenu()">ARCHIVO Y2K</a>
              <a [routerLink]="['/catalog']" [queryParams]="{ era: 'WORKWEAR' }" (click)="closeMobileMenu()">WORKWEAR // CARHARTT</a>
              <a [routerLink]="['/catalog']" [queryParams]="{ era: 'STREETWEAR' }" (click)="closeMobileMenu()">STREETWEAR // BAPE</a>
              @if (auth.isAdmin()) {
                <a routerLink="/admin" class="nav-admin" (click)="closeMobileMenu()">CONSOLA ADMIN</a>
              }
            </nav>

            <div class="mobile-drawer__foot font-mono">
              <button type="button" class="mobile-action" (click)="toggleTheme()">
                {{ theme.isLight() ? 'DARK MODE' : 'WHITE MODE' }}
              </button>
              <button type="button" class="mobile-action" (click)="soundFx.toggle()">
                {{ soundFx.isEnabled() ? 'AUDIO: ON' : 'AUDIO: OFF' }}
              </button>
            </div>
          </div>
        </div>
      }
    </header>
  `,
  styles: [`
    .ticker-bar {
      background: var(--text-bone);
      color: var(--bg-void);
      overflow: hidden;
      white-space: nowrap;
      border-bottom: 1px solid var(--border-subtle);
      width: 100%;
      max-width: 100%;
    }
    .ticker-track {
      display: inline-flex;
      padding: 0.38rem 0;
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      animation: doco-marquee 28s linear infinite;
    }
    .nav-shell {
      position: sticky;
      top: 0;
      z-index: 120;
      width: 100%;
      max-width: 100%;
      background: var(--bg-glass);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-bottom: 1px solid var(--border-subtle);
    }
    .nav-inner {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.9rem;
      min-height: 4.3rem;
      width: 100%;
      max-width: 100%;
    }
    .nav-left {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .mobile-menu-btn {
      display: none;
      cursor: pointer;
      min-width: 52px;
      height: 36px;
      padding: 0 0.5rem;
      place-items: center;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-bone);
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-shrink: 0;
    }
    .brand__logo {
      height: 34px;
      width: auto;
      object-fit: contain;
    }
    .brand__text {
      display: flex;
      flex-direction: column;
      line-height: 1;
    }
    .brand__name {
      font-size: 1.15rem;
      font-weight: 800;
      letter-spacing: 0.08em;
    }
    .brand__sub-row {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      margin-top: 2px;
    }
    .brand-radar-dot {
      width: 5px;
      height: 5px;
      border-radius: 50%;
      background: var(--accent-emerald);
      box-shadow: 0 0 6px var(--accent-emerald);
      animation: doco-pulse-glow 2s infinite;
    }
    .brand__sub {
      font-size: 0.58rem;
      color: var(--text-muted);
      letter-spacing: 0.15em;
    }
    .nav-links {
      display: flex;
      align-items: center;
      gap: 1.35rem;
      font-size: 0.74rem;
      letter-spacing: 0.12em;
    }
    .nav-links a {
      color: var(--text-muted);
      position: relative;
      padding: 0.35rem 0;
      transition: color 0.2s;
    }
    .nav-links a:hover,
    .nav-links a.is-active {
      color: var(--text-bone);
    }
    .nav-links a.is-active::after {
      content: '';
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0;
      height: 2px;
      background: var(--accent-crimson);
    }
    .nav-admin {
      color: var(--accent-crimson) !important;
      font-weight: 700;
    }
    .nav-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .search-box input {
      width: 175px;
      padding: 0.44rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.78rem;
      outline: none;
      transition: border-color 0.2s, width 0.25s;
    }
    .search-box input:focus {
      border-color: var(--border-strong);
      width: 215px;
    }
    .nav-wa-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.45rem 0.75rem;
      background: rgba(37, 211, 102, 0.12);
      border: 1px solid rgba(37, 211, 102, 0.4);
      color: #25d366;
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.06em;
      transition: background 0.18s, border-color 0.18s;
    }
    .nav-wa-pill:hover {
      background: rgba(37, 211, 102, 0.24);
      border-color: #25d366;
    }
    .wa-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #25d366;
      box-shadow: 0 0 6px #25d366;
    }
    .fx-btn,
    .theme-btn,
    .action-pill {
      cursor: pointer;
      padding: 0.48rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.7rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      white-space: nowrap;
      transition: border-color 0.2s, transform 0.15s;
    }
    .fx-btn.is-active {
      border-color: var(--accent-emerald);
      color: var(--accent-emerald);
    }
    .fx-btn:hover,
    .theme-btn:hover,
    .action-pill:hover {
      border-color: var(--border-strong);
      transform: translateY(-1px);
    }
    .bag-btn {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.48rem 0.85rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: none;
      border-radius: var(--radius-sharp);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      transition: transform 0.18s;
    }
    .bag-btn:hover {
      transform: translateY(-1px);
    }
    .bag-btn__count {
      display: inline-grid;
      place-items: center;
      min-width: 1.25rem;
      height: 1.25rem;
      padding: 0 0.25rem;
      background: var(--accent-crimson);
      color: #fff;
      border-radius: 2px;
      font-size: 0.68rem;
    }
    .mobile-drawer {
      border-top: 1px solid var(--border-subtle);
      background: var(--bg-void);
      padding: 1.25rem 0 1.65rem;
      animation: slide-down 0.22s var(--ease-kinetic);
    }
    .mobile-drawer__inner {
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }
    .mobile-search {
      display: flex;
      gap: 0.5rem;
    }
    .mobile-search input {
      flex: 1;
      padding: 0.7rem 0.85rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
    }
    .mobile-search button {
      cursor: pointer;
      padding: 0 1.15rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: none;
      font-weight: 700;
      border-radius: var(--radius-sharp);
    }
    .mobile-links {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    .mobile-links a {
      padding: 0.72rem 0;
      font-size: 1.18rem;
      font-weight: 700;
      border-bottom: 1px solid var(--border-subtle);
    }
    .mobile-wa-banner {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      padding: 0.95rem 1rem;
      background: #25d366;
      color: #04240f;
      border-radius: var(--radius-sharp);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.06em;
    }
    .mobile-drawer__foot {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.65rem;
    }
    .mobile-action {
      cursor: pointer;
      text-align: center;
      padding: 0.78rem 0.6rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      font-size: 0.7rem;
      font-weight: 700;
    }
    @keyframes slide-down {
      from { opacity: 0; transform: translateY(-8px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @media (max-width: 1080px) {
      .nav-links,
      .search-box,
      .desktop-only {
        display: none !important;
      }
      .mobile-menu-btn {
        display: grid;
      }
      .nav-inner {
        min-height: 3.6rem;
      }
    }
    @media (max-width: 768px) {
      .brand__sub-row {
        display: none !important;
      }
      .brand__name {
        font-size: 1.15rem;
      }
      .brand__logo {
        height: 28px;
      }
      .nav-inner {
        min-height: 3.4rem;
        padding-top: 0.25rem;
        padding-bottom: 0.25rem;
      }
      .bag-btn {
        padding: 0.42rem 0.65rem;
        font-size: 0.68rem;
      }
      .mobile-menu-btn {
        min-width: 46px;
        height: 32px;
        padding: 0 0.5rem;
        font-size: 0.65rem;
      }
    }
  `]
})
export class DocoNavbarComponent {
  protected readonly cart = inject(CartService);
  protected readonly auth = inject(AuthService);
  protected readonly theme = inject(ThemeService);
  protected readonly soundFx = inject(SoundFxService);
  protected readonly whatsapp = inject(WhatsAppService);
  private readonly router = inject(Router);

  protected readonly mobileMenuOpen = signal(false);
  protected searchTerm = '';

  protected onNavClick(): void {
    this.soundFx.playClick();
  }

  protected toggleTheme(): void {
    this.soundFx.playClick();
    this.theme.toggle();
  }

  protected toggleMobileMenu(): void {
    this.soundFx.playClick();
    this.mobileMenuOpen.update((v) => !v);
  }

  protected closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  protected submitSearch(): void {
    const q = this.searchTerm.trim();
    this.mobileMenuOpen.set(false);
    this.router.navigate(['/catalog'], { queryParams: q ? { search: q } : {} });
  }
}
