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

@Component({
  selector: 'doco-product-card',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="yeezy-item"
      (mouseenter)="onHover(true)"
      (mouseleave)="onHover(false)"
      (click)="handleClick()"
      role="button"
      tabindex="0"
      [attr.aria-label]="product().title"
    >
      <!-- FLOATING GARMENT CUTOUT CANVAS -->
      <div class="yeezy-item__stage">
        @if (displayImageUrl()) {
          <img
            class="yeezy-item__img"
            [src]="displayImageUrl()"
            [alt]="product().title"
            (error)="onImgError($event)"
            loading="lazy"
          />
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
      transition: transform 0.16s cubic-bezier(0.2, 0.8, 0.4, 1);
      box-sizing: border-box;
    }

    .yeezy-item:hover {
      transform: translateY(-3px);
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
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
      transition: transform 0.22s ease, opacity 0.2s ease;
      will-change: transform;
    }

    .yeezy-item:hover .yeezy-item__img {
      transform: scale(1.04);
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

    .yeezy-sub {
      font-size: 0.65rem;
      color: var(--text-dim);
      letter-spacing: 0.06em;
      transition: color 0.15s ease;
    }

    .yeezy-item:hover .yeezy-sub {
      color: var(--text-muted);
    }
  `]
})
export class DocoProductCardComponent {
  readonly product = input.required<ProductSummary>();

  private readonly quickView = inject(QuickViewService);
  private readonly soundFx = inject(SoundFxService);

  readonly isHovered = signal(false);

  readonly yeezySku = computed(() => {
    const raw = this.product().sku;
    // Format into clean Yeezy code e.g. DOCO-01 or ARC-01
    return raw.replace('DOCO-ARC-', 'DOCO-');
  });

  readonly displayImageUrl = computed(() => {
    const p = this.product();
    // If cutout image exists or primary
    if (this.isHovered() && p.secondaryImageUrl) {
      return p.secondaryImageUrl;
    }
    return p.primaryImageUrl;
  });

  onHover(val: boolean): void {
    this.isHovered.set(val);
  }

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
