import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'doco-section-header',
  standalone: true,
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <header class="section-head">
      <div class="section-head__titles">
        @if (eyebrow()) {
          <div class="section-head__eyebrow-wrap font-mono">
            <span class="eyebrow-dash"></span>
            <span class="section-head__eyebrow">{{ eyebrow() }}</span>
          </div>
        }
        <h2 class="section-head__title font-display">{{ title() }}</h2>
      </div>
      @if (ctaLabel() && ctaLink()) {
        <a class="section-head__cta font-mono" [routerLink]="ctaLink()" [queryParams]="ctaQueryParams()">
          <span>{{ ctaLabel() }}</span>
          <span class="cta-arrow">→</span>
        </a>
      }
    </header>
  `,
  styles: [`
    .section-head {
      display: flex;
      flex-wrap: wrap;
      align-items: flex-end;
      justify-content: space-between;
      gap: 1.25rem;
      padding-bottom: 1.25rem;
      margin-bottom: 2rem;
      border-bottom: 1px solid var(--border-subtle);
      position: relative;
    }
    .section-head::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: -1px;
      width: 48px;
      height: 2px;
      background: var(--accent-crimson);
    }
    .section-head__eyebrow-wrap {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.45rem;
    }
    .eyebrow-dash {
      width: 14px;
      height: 2px;
      background: var(--accent-crimson);
      display: inline-block;
    }
    .section-head__eyebrow {
      font-size: 0.7rem;
      color: var(--accent-crimson);
      letter-spacing: 0.16em;
      text-transform: uppercase;
      font-weight: 700;
    }
    .section-head__title {
      margin: 0;
      font-size: clamp(1.5rem, 3.2vw, 2.45rem);
      font-weight: 800;
      text-transform: uppercase;
      line-height: 1.05;
      letter-spacing: -0.015em;
    }
    .section-head__cta {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.76rem;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      font-weight: 700;
      color: var(--text-bone);
      padding: 0.55rem 1.05rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      transition: all 0.22s var(--ease-kinetic);
    }
    .section-head__cta:hover {
      background: var(--text-bone);
      color: var(--bg-void);
      border-color: var(--text-bone);
      transform: translateY(-1px);
    }
    .cta-arrow {
      transition: transform 0.2s var(--ease-kinetic);
    }
    .section-head__cta:hover .cta-arrow {
      transform: translateX(3px);
    }
  `]
})
export class DocoSectionHeaderComponent {
  readonly eyebrow = input<string>('');
  readonly title = input.required<string>();
  readonly ctaLabel = input<string>('');
  readonly ctaLink = input<string>('');
  readonly ctaQueryParams = input<Record<string, string> | null>(null);
}
