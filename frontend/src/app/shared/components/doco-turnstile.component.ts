import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  inject,
  output,
  signal,
  viewChild
} from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: HTMLElement,
        options: {
          sitekey: string;
          theme: 'dark' | 'light' | 'auto';
          callback: (token: string) => void;
          'expired-callback': () => void;
          'error-callback': () => void;
        }
      ) => string;
      remove: (widgetId: string) => void;
    };
  }
}

@Component({
  selector: 'doco-turnstile',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="turnstile-box">
      @if (captchaEnabled) {
        <div #widgetHost class="turnstile-host"></div>
        @if (statusText()) {
          <span class="turnstile-note font-mono">{{ statusText() }}</span>
        }
      } @else {
        <div class="turnstile-dev font-mono">
          <span>[//] SHIELD ANTI-BOT (CLOUDFLARE TURNSTILE)</span>
          <small>Modo desarrollo activo — activa <code>CAPTCHA_ENABLED=true</code> en producción</small>
        </div>
      }
    </div>
  `,
  styles: [`
    .turnstile-box {
      padding: 0.75rem;
      background: var(--bg-elevated);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
    }
    .turnstile-dev {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      font-size: 0.74rem;
      color: var(--accent-emerald);
    }
    .turnstile-dev small {
      color: var(--text-muted);
      font-size: 0.68rem;
    }
    .turnstile-note {
      display: block;
      margin-top: 0.45rem;
      font-size: 0.72rem;
      color: var(--text-muted);
    }
  `]
})
export class DocoTurnstileComponent implements AfterViewInit, OnDestroy {
  private readonly ngZone = inject(NgZone);
  private readonly widgetHost = viewChild<ElementRef<HTMLElement>>('widgetHost');

  readonly tokenChange = output<string | null>();
  protected readonly captchaEnabled = environment.captchaEnabled;
  protected readonly statusText = signal<string>('');
  private widgetId: string | null = null;

  ngAfterViewInit(): void {
    if (!this.captchaEnabled) {
      this.tokenChange.emit('dev-bypass-token');
      return;
    }
    this.ensureTurnstileScript()
      .then(() => this.renderWidget())
      .catch(() => this.statusText.set('No se pudo cargar la verificación anti-bot.'));
  }

  ngOnDestroy(): void {
    if (this.widgetId && window.turnstile) {
      window.turnstile.remove(this.widgetId);
    }
  }

  private renderWidget(): void {
    const host = this.widgetHost()?.nativeElement;
    if (!host || !window.turnstile) return;

    this.widgetId = window.turnstile.render(host, {
      sitekey: environment.turnstileSiteKey,
      theme: 'dark',
      callback: (token) => this.ngZone.run(() => this.tokenChange.emit(token)),
      'expired-callback': () => this.ngZone.run(() => this.tokenChange.emit(null)),
      'error-callback': () =>
        this.ngZone.run(() => {
          this.tokenChange.emit(null);
          this.statusText.set('Error verificando CAPTCHA. Recarga e intenta de nuevo.');
        })
    });
  }

  private ensureTurnstileScript(): Promise<void> {
    if (window.turnstile) {
      return Promise.resolve();
    }
    return new Promise((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>('script[data-doco-turnstile]');
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener('error', () => reject(), { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      script.async = true;
      script.defer = true;
      script.dataset['docoTurnstile'] = 'true';
      script.onload = () => resolve();
      script.onerror = () => reject();
      document.head.appendChild(script);
    });
  }
}
