import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type BadgeTone = 'crimson' | 'chrome' | 'dark' | 'emerald';

@Component({
  selector: 'doco-badge',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<span class="badge" [class]="tone()"><ng-content /></span>`,
  styles: [`
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
      padding: 0.2rem 0.55rem;
      font-family: var(--font-mono);
      font-size: 0.68rem;
      font-weight: 600;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border-radius: var(--radius-sharp);
      line-height: 1.2;
      white-space: nowrap;
    }
    .dark {
      background: rgba(9, 9, 11, 0.85);
      color: var(--text-bone);
      border: 1px solid var(--border-strong);
      backdrop-filter: blur(8px);
    }
    .crimson {
      background: var(--accent-crimson);
      color: #fff;
      border: 1px solid rgba(255, 255, 255, 0.15);
    }
    .chrome {
      background: var(--chrome-gradient);
      color: #09090b;
      font-weight: 700;
    }
    .emerald {
      background: rgba(16, 185, 129, 0.16);
      color: #34d399;
      border: 1px solid rgba(52, 211, 153, 0.35);
    }
  `]
})
export class DocoBadgeComponent {
  readonly tone = input<BadgeTone>('dark');
}
