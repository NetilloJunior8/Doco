import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  signal
} from '@angular/core';
import { ProductSummary } from '../../core/models/catalog.models';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { formatMxn } from '../../core/utils/formatters';

@Component({
  selector: 'doco-product-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="archive-card"
      (mouseenter)="onHover(true)"
      (mouseleave)="onHover(false)"
      (click)="handleCardClick()"
      role="button"
      tabindex="0"
      [attr.aria-label]="product().title"
    >
      <!-- FLOATING GARMENT MEDIA -->
      <div class="archive-card__media">
        @if (product().primaryImageUrl) {
          <img
            class="archive-card__img archive-card__img--primary"
            [class.is-faded]="isHovered() && product().secondaryImageUrl"
            [src]="product().primaryImageUrl"
            [alt]="product().title"
            loading="lazy"
          />
          @if (product().secondaryImageUrl) {
            <img
              class="archive-card__img archive-card__img--secondary"
              [class.is-visible]="isHovered()"
              [src]="product().secondaryImageUrl"
              [alt]="product().title + ' vista posterior'"
              loading="lazy"
            />
          }
        } @else {
          <div class="archive-card__empty font-mono">DOCO ARCHIVE</div>
        }

        <!-- SUBTLE QUICK VIEW HINT ON HOVER -->
        <div class="archive-card__hint font-mono">
          <span>[ VER DETALLES ]</span>
        </div>

        @if (product().stock === 0) {
          <div class="archive-card__soldout font-mono">SOLD OUT</div>
        }
      </div>

      <!-- MONOSPACE TELEMETRY CAPTION (HOVERSTAT / YEEZY STYLE) -->
      <div class="archive-card__caption font-mono">
        <span class="caption-sku">#{{ product().sku }}</span>
        <span class="caption-info">
          {{ shortTitle() }} [{{ product().sizeLabel }}] · {{ formatMxn(product().priceMxn) }}
        </span>
      </div>
    </article>
  `,
  styles: [`
    .archive-card {
      position: relative;
      display: flex;
      flex-direction: column;
      cursor: pointer;
      user-select: none;
      background: transparent;
      outline: none;
      transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1);
    }

    .archive-card:hover {
      transform: translateY(-2px);
    }

    .archive-card__media {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--bg-media);
      overflow: hidden;
      border: 1px solid var(--border-subtle);
      transition: border-color 0.18s ease;
    }

    .archive-card:hover .archive-card__media {
      border-color: var(--border-strong);
    }

    .archive-card__img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      padding: 0.5rem;
      box-sizing: border-box;
      transition: opacity 0.22s ease, transform 0.25s ease;
      will-change: opacity, transform;
    }

    .archive-card__img--primary {
      opacity: 1;
      z-index: 1;
    }

    .archive-card__img--primary.is-faded {
      opacity: 0;
    }

    .archive-card__img--secondary {
      opacity: 0;
      z-index: 2;
    }

    .archive-card__img--secondary.is-visible {
      opacity: 1;
    }

    .archive-card__empty {
      font-size: 0.72rem;
      color: var(--text-muted);
      letter-spacing: 0.1em;
    }

    .archive-card__hint {
      position: absolute;
      bottom: 6px;
      right: 6px;
      font-size: 0.58rem;
      letter-spacing: 0.08em;
      background: var(--bg-void);
      color: var(--text-bone);
      border: 1px solid var(--border-subtle);
      padding: 2px 5px;
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.18s ease;
      z-index: 3;
    }

    .archive-card:hover .archive-card__hint {
      opacity: 0.95;
    }

    .archive-card__soldout {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.78rem;
      letter-spacing: 0.12em;
      z-index: 4;
    }

    /* MONOSPACE CAPTION */
    .archive-card__caption {
      margin-top: 0.5rem;
      display: flex;
      flex-direction: column;
      gap: 0.15rem;
      font-size: 0.68rem;
      letter-spacing: 0.04em;
      line-height: 1.25;
      text-transform: uppercase;
    }

    .caption-sku {
      color: var(--text-dim);
      font-size: 0.62rem;
      letter-spacing: 0.06em;
    }

    .archive-card:hover .caption-sku {
      color: var(--text-muted);
    }

    .caption-info {
      color: var(--text-bone);
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  `]
})
export class DocoProductCardComponent {
  readonly product = input.required<ProductSummary>();

  private readonly quickView = inject(QuickViewService);
  private readonly soundFx = inject(SoundFxService);

  readonly isHovered = signal(false);

  readonly shortTitle = computed(() => {
    const t = this.product().title;
    // Strip redundant brand prefix if present for sleek caption
    const b = this.product().brandName;
    if (t.toLowerCase().startsWith(b.toLowerCase())) {
      return t.substring(b.length).trim().replace(/^[-/]\s*/, '');
    }
    return t;
  });

  onHover(hovering: boolean): void {
    this.isHovered.set(hovering);
  }

  handleCardClick(): void {
    this.soundFx.playClick();
    this.quickView.open(this.product());
  }

  formatMxn(val: number): string {
    return formatMxn(val);
  }
}
