import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { ThemeService } from '../../core/services/theme.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';

@Component({
  selector: 'doco-footer',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <footer class="footer">
      <div class="doco-container footer__grid">
        <div class="footer__brand">
          <img
            [src]="theme.isLight() ? '/assets/brand/doco-logo-dark.png' : '/assets/brand/doco-logo-light.png'"
            alt="DOCO Logo"
            class="footer__logo"
          />
          <p class="footer__desc">
            Archivo curado de prendas Vintage, Streetwear y Y2K seleccionadas minuciosamente en Culiacán, Sinaloa.
            Entrega local y directa en Culiacán.
          </p>
        </div>

        <div class="footer__col font-mono">
          <h4>EXPLORAR ARCHIVO</h4>
          <a routerLink="/catalog">Catálogo Completo</a>
          <a [routerLink]="['/catalog']" [queryParams]="{ era: 'Y2K' }">Archivo Y2K</a>
          <a [routerLink]="['/catalog']" [queryParams]="{ era: 'WORKWEAR' }">Workwear & Carhartt</a>
          <a [routerLink]="['/catalog']" [queryParams]="{ era: 'STREETWEAR' }">Streetwear & BAPE</a>
        </div>

        <div class="footer__col font-mono">
          <h4>ENTREGA & PAGOS</h4>
          <span>Entrega Local en Culiacán</span>
          <span>Transferencia SPEI Inmediata</span>
          <span>Efectivo Contra-Entrega</span>
          <span>Depósito OXXO</span>
        </div>

        <div class="footer__col font-mono">
          <h4>PREFERENCIAS & ACCESO</h4>
          <a href="https://instagram.com/doco.tm" target="_blank" rel="noopener noreferrer">
            Instagram @doco.tm ↗
          </a>
          <a routerLink="/auth">Consola de Administrador</a>
          <div class="footer-buttons">
            <button type="button" class="footer__btn font-mono" (click)="toggleTheme()">
              {{ theme.isLight() ? 'DARK MODE' : 'WHITE MODE' }}
            </button>
            <button type="button" class="footer__btn font-mono" (click)="soundFx.toggle()">
              {{ soundFx.isEnabled() ? 'AUDIO: ON' : 'AUDIO: OFF' }}
            </button>
          </div>
        </div>
      </div>

      <div class="doco-container footer__bottom font-mono">
        <span>(C) 2026 DOCO.TM - CULIACAN, SINALOA, MEXICO</span>
        <span>VAULT ARCHIVE // STREETWEAR // Y2K</span>
      </div>
    </footer>
  `,
  styles: [`
    .footer {
      margin-top: 5rem;
      padding: 4rem 0 2rem;
      background: var(--bg-footer);
      border-top: 1px solid var(--border-subtle);
    }
    .footer__grid {
      display: grid;
      grid-template-columns: 1.4fr repeat(3, 1fr);
      gap: 2.5rem;
    }
    .footer__logo {
      height: 42px;
      margin-bottom: 1rem;
    }
    .footer__desc {
      margin: 0 0 1.15rem;
      max-width: 38ch;
      color: var(--text-muted);
      font-size: 0.88rem;
      line-height: 1.5;
    }
    .footer__wa-pill {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.45rem 0.8rem;
      background: rgba(37, 211, 102, 0.1);
      border: 1px solid rgba(37, 211, 102, 0.4);
      border-radius: var(--radius-sharp);
      font-size: 0.72rem;
      font-weight: 700;
      color: #25d366;
    }
    .wa-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #25d366;
      box-shadow: 0 0 6px #25d366;
    }
    .footer__col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 0.65rem;
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .footer__col h4 {
      margin: 0 0 0.4rem;
      color: var(--text-bone);
      font-size: 0.74rem;
      letter-spacing: 0.14em;
    }
    .footer__col a:hover {
      color: var(--text-bone);
    }
    .wa-footer-link {
      color: #25d366 !important;
      font-weight: 700;
    }
    .footer-buttons {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.4rem;
    }
    .footer__btn {
      cursor: pointer;
      padding: 0.42rem 0.7rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      font-weight: 700;
      color: var(--text-bone);
      transition: border-color 0.18s;
    }
    .footer__btn:hover {
      border-color: var(--text-bone);
    }
    .footer__bottom {
      margin-top: 3.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-subtle);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      gap: 1rem;
      font-size: 0.7rem;
      color: var(--text-dim);
    }
    @media (max-width: 900px) {
      .footer__grid {
        grid-template-columns: 1fr 1fr;
      }
    }
    @media (max-width: 540px) {
      .footer {
        padding-bottom: 6rem;
      }
      .footer__grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class DocoFooterComponent {
  protected readonly theme = inject(ThemeService);
  protected readonly soundFx = inject(SoundFxService);
  protected readonly whatsapp = inject(WhatsAppService);

  protected toggleTheme(): void {
    this.soundFx.playClick();
    this.theme.toggle();
  }
}
