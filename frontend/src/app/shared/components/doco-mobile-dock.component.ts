import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

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

        <!-- 4. WhatsApp Direct Trigger -->
        <button
          type="button"
          class="dock-item dock-item--wa"
          (click)="openWhatsApp()"
          aria-label="Atención por WhatsApp DOCO Culiacán"
        >
          <span class="dock-icon">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M12.04 2c-5.46 0-9.91 4.45-9.91 9.91 0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.26.86 5.82 2.42a8.225 8.225 0 0 1 2.41 5.83c0 4.54-3.7 8.24-8.24 8.24-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.196 8.196 0 0 1-1.26-4.36c0-4.54 3.7-8.24 8.24-8.24zm4.52 11.66c-.25-.13-1.47-.72-1.7-.81-.23-.08-.39-.13-.56.13-.17.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.13-1.06-.39-2.02-1.25-.75-.67-1.26-1.5-1.41-1.75-.15-.25-.02-.39.11-.51.11-.11.25-.29.38-.44.13-.14.17-.25.25-.42.08-.17.04-.31-.02-.44-.06-.13-.56-1.35-.77-1.85-.2-.49-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.88.86-.88 2.1 0 1.24.9 2.44 1.03 2.61.13.17 1.78 2.72 4.31 3.81.6.26 1.07.42 1.44.54.61.19 1.16.17 1.6.1.49-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.15-1.18-.06-.11-.22-.17-.47-.3z"/>
            </svg>
          </span>
          <span class="dock-label">WHATSAPP</span>
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
    .dock-item--wa {
      color: #25d366;
    }
    .dock-item--wa:hover {
      color: #2bf075;
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
  protected readonly whatsapp = inject(WhatsAppService);

  protected openBag(): void {
    this.soundFx.playChime();
    this.cart.openDrawer();
  }

  protected openWhatsApp(): void {
    this.soundFx.playClick();
    this.whatsapp.openUrl(this.whatsapp.generateGeneralInquiryUrl());
  }

  protected toggleTheme(): void {
    this.soundFx.playClick();
    this.theme.toggle();
  }
}
