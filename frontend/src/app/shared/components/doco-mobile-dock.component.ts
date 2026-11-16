import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';

@Component({
  selector: 'doco-mobile-dock',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <nav class="mobile-dock" aria-label="Navegación móvil inferior">
      <div class="dock-inner font-mono">
        <!-- 1. Home -->
        <a
          routerLink="/"
          routerLinkActive="is-active"
          [routerLinkActiveOptions]="{ exact: true }"
          class="dock-item"
          (click)="soundFx.playClick()"
        >
          <span class="dock-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </span>
          <span class="dock-label">INICIO</span>
        </a>

        <!-- 2. Catalog -->
        <a
          routerLink="/catalog"
          routerLinkActive="is-active"
          class="dock-item"
          (click)="soundFx.playClick()"
        >
          <span class="dock-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
            </svg>
          </span>
          <span class="dock-label">CATÁLOGO</span>
        </a>

        <!-- 3. Bag / Cart Trigger with dynamic count -->
        <button
          type="button"
          class="dock-item dock-item--bag"
          (click)="openBag()"
          aria-label="Abrir bolsa de compras"
        >
          <span class="dock-icon dock-icon--bag-wrap">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            @if (cart.itemCount() > 0) {
              <span class="dock-badge">{{ cart.itemCount() }}</span>
            }
          </span>
          <span class="dock-label">BOLSA</span>
        </button>

        <!-- 4. Audio FX Toggle -->
        <button
          type="button"
          class="dock-item"
          [class.is-fx-active]="soundFx.isEnabled()"
          (click)="soundFx.toggle()"
          aria-label="Alternar efectos de sonido"
        >
          <span class="dock-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              @if (soundFx.isEnabled()) {
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              } @else {
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              }
            </svg>
          </span>
          <span class="dock-label">{{ soundFx.isEnabled() ? 'FX: ON' : 'FX: OFF' }}</span>
        </button>

        <!-- 5. Theme Toggle -->
        <button
          type="button"
          class="dock-item"
          (click)="toggleTheme()"
          aria-label="Alternar modo de pantalla"
        >
          <span class="dock-icon">
            @if (theme.isLight()) {
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>
            } @else {
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5" />
                <line x1="12" y1="1" x2="12" y2="3" />
                <line x1="12" y1="21" x2="12" y2="23" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                <line x1="1" y1="12" x2="3" y2="12" />
                <line x1="21" y1="12" x2="23" y2="12" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
              </svg>
            }
          </span>
          <span class="dock-label">{{ theme.isLight() ? 'DARK' : 'WHITE' }}</span>
        </button>
      </div>
    </nav>
  `,
  styles: [`
    .mobile-dock {
      display: none;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 150;
      background: var(--bg-glass);
      backdrop-filter: blur(18px);
      -webkit-backdrop-filter: blur(18px);
      border-top: 1px solid var(--border-subtle);
      padding-bottom: max(0.45rem, env(safe-area-inset-bottom));
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.25);
    }
    .dock-inner {
      display: grid;
      grid-template-columns: repeat(5, 1fr);
      height: 56px;
      align-items: center;
    }
    .dock-item {
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.22rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      text-decoration: none;
      padding: 0.35rem 0;
      transition: color 0.18s ease;
      touch-action: manipulation;
    }
    .dock-item:hover,
    .dock-item.is-active {
      color: var(--text-bone);
    }
    .dock-icon {
      display: grid;
      place-items: center;
      height: 22px;
    }
    .dock-icon--bag-wrap {
      position: relative;
    }
    .dock-badge {
      position: absolute;
      top: -5px;
      right: -8px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--accent-crimson);
      color: #ffffff;
      font-size: 0.62rem;
      font-weight: 700;
      display: grid;
      place-items: center;
      box-shadow: 0 0 6px rgba(225, 29, 72, 0.6);
      animation: doco-pulse-glow 2s infinite ease-in-out;
    }
    .dock-label {
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.08em;
    }
    .is-fx-active {
      color: var(--text-bone);
    }
    @media (max-width: 768px) {
      .mobile-dock {
        display: block;
      }
    }
  `]
})
export class DocoMobileDockComponent {
  protected readonly cart = inject(CartService);
  protected readonly theme = inject(ThemeService);
  protected readonly soundFx = inject(SoundFxService);

  protected openBag(): void {
    this.soundFx.playChime();
    this.cart.openDrawer();
  }

  protected toggleTheme(): void {
    this.soundFx.playClick();
    this.theme.toggle();
  }
}
