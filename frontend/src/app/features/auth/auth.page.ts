import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { DocoTurnstileComponent } from '../../shared/components/doco-turnstile.component';

@Component({
  selector: 'doco-auth-page',
  standalone: true,
  imports: [FormsModule, DocoTurnstileComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="doco-container auth-wrap">
      <div class="auth-card">
        <div class="auth-tabs font-mono">
          <button type="button" [class.is-active]="mode() === 'login'" (click)="mode.set('login')">
            INICIAR SESIÓN
          </button>
          <button type="button" [class.is-active]="mode() === 'register'" (click)="mode.set('register')">
            CREAR CUENTA
          </button>
        </div>

        <form (ngSubmit)="submit()">
          @if (mode() === 'register') {
            <label>
              <span>Nombre completo</span>
              <input type="text" [(ngModel)]="fullName" name="fullName" required />
            </label>
          }

          <label>
            <span>Correo electrónico</span>
            <input type="email" [(ngModel)]="email" name="email" required />
          </label>

          <label>
            <span>Contraseña</span>
            <input type="password" [(ngModel)]="password" name="password" minlength="6" required />
          </label>

          <doco-turnstile (tokenChange)="captchaToken.set($event)" />

          @if (error()) {
            <p class="auth-error font-mono">{{ error() }}</p>
          }

          <button type="submit" class="auth-submit font-mono" [disabled]="loading()">
            {{ loading() ? 'VERIFICANDO...' : mode() === 'login' ? 'ENTRAR →' : 'REGISTRARME →' }}
          </button>
        </form>
      </div>
    </section>
  `,
  styles: [`
    .auth-wrap {
      padding: 4.5rem 1rem;
      display: grid;
      place-items: center;
    }
    .auth-card {
      width: min(440px, 100%);
      padding: 2rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-card);
    }
    .auth-tabs {
      display: grid;
      grid-template-columns: 1fr 1fr;
      margin-bottom: 1.5rem;
      border-bottom: 1px solid var(--border-subtle);
    }
    .auth-tabs button {
      cursor: pointer;
      padding: 0.75rem;
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 0.78rem;
      letter-spacing: 0.08em;
    }
    .auth-tabs button.is-active {
      color: var(--text-bone);
      border-bottom: 2px solid var(--accent-crimson);
    }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 1rem;
      font-size: 0.84rem;
      color: var(--text-muted);
    }
    input {
      padding: 0.7rem 0.8rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
    }
    .auth-error {
      margin-top: 0.85rem;
      color: var(--accent-crimson);
      font-size: 0.76rem;
    }
    .auth-submit {
      width: 100%;
      margin-top: 1.25rem;
      cursor: pointer;
      padding: 0.9rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: none;
      font-size: 0.8rem;
      font-weight: 700;
      letter-spacing: 0.1em;
    }
  `]
})
export class AuthPageComponent {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  protected readonly mode = signal<'login' | 'register'>('login');
  protected readonly captchaToken = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly error = signal('');

  protected fullName = '';
  protected email = '';
  protected password = '';

  protected submit(): void {
    this.loading.set(true);
    this.error.set('');
    const obs =
      this.mode() === 'login'
        ? this.auth.login(this.email, this.password, this.captchaToken())
        : this.auth.register(this.fullName, this.email, this.password, this.captchaToken());

    obs.subscribe({
      next: (res) => {
        this.loading.set(false);
        const redirect = this.route.snapshot.queryParamMap.get('redirect');
        this.router.navigateByUrl(redirect || (res.role === 'ROLE_ADMIN' ? '/admin' : '/catalog'));
      },
      error: (err) => {
        this.error.set(err?.message || 'Credenciales inválidas.');
        this.loading.set(false);
      }
    });
  }
}
