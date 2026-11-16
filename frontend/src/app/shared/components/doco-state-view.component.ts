import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';

@Component({
  selector: 'doco-state-view',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (mode() === 'loading') {
      <div class="skeleton-grid" role="status" aria-label="Cargando piezas">
        @for (item of skeletonSlots; track item) {
          <div class="skeleton-card">
            <div class="skeleton-card__media"></div>
            <div class="skeleton-card__line short"></div>
            <div class="skeleton-card__line"></div>
          </div>
        }
      </div>
    } @else if (mode() === 'error') {
      <div class="state-box" role="alert">
        <span class="state-box__tag font-mono">// CONEXIÓN INTERRUMPIDA</span>
        <p class="state-box__msg">{{ message() || 'No pudimos cargar el archivo de piezas.' }}</p>
        <button type="button" class="state-box__btn font-mono" (click)="retry.emit()">
          REINTENTAR
        </button>
      </div>
    } @else if (mode() === 'empty') {
      <div class="state-box">
        <span class="state-box__tag font-mono">// VAULT VACÍO</span>
        <p class="state-box__msg">{{ message() || 'No encontramos piezas con esos filtros.' }}</p>
        @if (actionLabel()) {
          <button type="button" class="state-box__btn font-mono" (click)="retry.emit()">
            {{ actionLabel() }}
          </button>
        }
      </div>
    }
  `,
  styles: [`
    .skeleton-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 1.5rem;
      width: 100%;
      box-sizing: border-box;
    }
    .skeleton-card {
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
      padding: 0.75rem;
      box-sizing: border-box;
      overflow: hidden;
    }
    .skeleton-card__media {
      aspect-ratio: 1 / 1;
      border-radius: var(--radius-sharp);
      background: linear-gradient(
        90deg,
        var(--bg-elevated) 20%,
        var(--border-strong) 50%,
        var(--bg-elevated) 80%
      );
      background-size: 200% 100%;
      animation: doco-shimmer 1.5s infinite linear;
      margin-bottom: 0.75rem;
    }
    .skeleton-card__line {
      height: 12px;
      border-radius: var(--radius-sharp);
      background: var(--bg-elevated);
      margin-bottom: 0.45rem;
      opacity: 0.9;
    }
    .skeleton-card__line.short {
      width: 48%;
    }
    .state-box {
      padding: 3rem 1.5rem;
      text-align: center;
      background: var(--bg-surface);
      border: 1px dashed var(--border-strong);
      border-radius: var(--radius-card);
      width: 100%;
      box-sizing: border-box;
    }
    .state-box__tag {
      font-size: 0.72rem;
      color: var(--accent-crimson);
      letter-spacing: 0.14em;
    }
    .state-box__msg {
      margin: 0.75rem auto 1.5rem;
      max-width: 44ch;
      color: var(--text-muted);
      font-size: 0.86rem;
    }
    .state-box__btn {
      cursor: pointer;
      padding: 0.65rem 1.35rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: 1px solid var(--text-bone);
      font-size: 0.76rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      border-radius: var(--radius-sharp);
      transition: all 0.2s;
    }
    .state-box__btn:hover {
      background: transparent;
      color: var(--text-bone);
    }
    @media (max-width: 640px) {
      .skeleton-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
      .skeleton-card {
        padding: 0.5rem;
      }
      .skeleton-card__media {
        aspect-ratio: 1 / 1;
        margin-bottom: 0.5rem;
      }
      .skeleton-card__line {
        height: 10px;
        margin-bottom: 0.35rem;
      }
      .state-box {
        padding: 2rem 1rem;
      }
    }
  `]
})
export class DocoStateViewComponent {
  readonly mode = input.required<'loading' | 'empty' | 'error'>();
  readonly message = input<string>('');
  readonly actionLabel = input<string>('');
  readonly retry = output<void>();

  protected readonly skeletonSlots = [1, 2, 3, 4, 5, 6];
}
