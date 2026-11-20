import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input
} from '@angular/core';
import { ProductSummary } from '../../core/models/catalog.models';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';

@Component({
  selector: 'doco-product-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="yeezy-item"
      (click)="handleClick()"
      role="button"
      tabindex="0"
      [attr.aria-label]="product().title"
    >
      <!-- FLOATING GARMENT CUTOUT CANVAS WITH ZERO-STUTTER GPU CROSSFADE -->
      <div class="yeezy-item__stage">
        @if (product().primaryImageUrl) {
          <img
            class="yeezy-item__img yeezy-item__img--front"
            [src]="product().primaryImageUrl"
            [alt]="product().title + ' - Frente'"
            (error)="onImgError($event)"
            loading="lazy"
          />

          @if (product().secondaryImageUrl) {
            <img
              class="yeezy-item__img yeezy-item__img--back"
              [src]="product().secondaryImageUrl"
              [alt]="product().title + ' - Espalda'"
              (error)="onImgError($event)"
              loading="lazy"
            />
          }
        } @else {
          <div class="yeezy-item__fallback font-mono">DOCO</div>
        }

        @if (product().stock === 0) {
          <div class="yeezy-item__soldout font-mono">SOLD OUT</div>
        }
      </div>

      <!-- CENTERED MONOSPACE SKU (YEEZY STYLE: WJ-02 / DOCO-01) -->
      <div class="yeezy-item__label font-mono">
        <span class="yeezy-sku">{{ yeezySku() }}</span>
      </div>
    </article>
  `,
  styles: [`
    .yeezy-item {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      cursor: pointer;
      user-select: none;
      background: transparent;
      outline: none;
      padding: clamp(0.5rem, 1.5vw, 1.25rem) 0.5rem;
      transition: transform 0.18s cubic-bezier(0.2, 0.8, 0.4, 1);
      box-sizing: border-box;
      -webkit-tap-highlight-color: transparent;
    }

    .yeezy-item:hover {
      transform: translateY(-2px);
    }

    .yeezy-item__stage {
      position: relative;
      width: 100%;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      background: transparent;
      overflow: hidden;
    }

    .yeezy-item__img {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: opacity 0.22s cubic-bezier(0.2, 0.8, 0.4, 1), transform 0.22s cubic-bezier(0.2, 0.8, 0.4, 1);
      will-change: opacity, transform;
      pointer-events: none;
    }

    .yeezy-item__img--front {
      opacity: 1;
      z-index: 1;
    }

    .yeezy-item__img--back {
      opacity: 0;
      z-index: 2;
    }

    /* ZERO-STUTTER INSTANT HOVER CROSSFADE (YEEZY GPU-COMPOSITED) */
    .yeezy-item:hover .yeezy-item__img {
      transform: scale(1.035);
    }

    .yeezy-item:hover .yeezy-item__img--back {
      opacity: 1;
    }

    .yeezy-item:hover .yeezy-item__img--back + .yeezy-item__img--front,
    .yeezy-item:hover:has(.yeezy-item__img--back) .yeezy-item__img--front {
      opacity: 0;
    }

    .yeezy-item__fallback {
      font-size: 0.75rem;
      color: var(--text-muted);
      letter-spacing: 0.12em;
    }

    .yeezy-item__soldout {
      position: absolute;
      inset: 0;
      background: rgba(0, 0, 0, 0.7);
      color: #ffffff;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
      letter-spacing: 0.14em;
      z-index: 5;
    }

    /* CENTERED MONOSPACE CODE (EXACT YEEZY REFERENCE: BD-10, WJ-02) */
    .yeezy-item__label {
      margin-top: 0.85rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.2rem;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
    }

    .yeezy-sku {
      font-weight: 500;
      color: var(--text-bone);
    }
  `]
})
export class DocoProductCardComponent {
  readonly product = input.required<ProductSummary>();

  private readonly quickView = inject(QuickViewService);
  private readonly soundFx = inject(SoundFxService);

  readonly yeezySku = computed(() => {
    const raw = this.product().sku;
    return raw.replace('DOCO-ARC-', 'DOCO-');
  });

  onImgError(e: Event): void {
    const el = e.target as HTMLImageElement;
    if (el && el.src.includes('_cutout.webp')) {
      el.src = el.src.replace('_cutout.webp', '.webp');
    }
  }

  handleClick(): void {
    this.soundFx.playClick();
    this.quickView.open(this.product());
  }
}
