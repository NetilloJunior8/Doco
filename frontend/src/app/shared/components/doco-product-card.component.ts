import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductSummary } from '../../core/models/catalog.models';
import { QuickViewService } from '../../core/services/quick-view.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { formatCondition, formatEra, formatMxn } from '../../core/utils/formatters';
import { DocoBadgeComponent } from './doco-badge.component';

@Component({
  selector: 'doco-product-card',
  standalone: true,
  imports: [RouterLink, DocoBadgeComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <article
      class="card"
      [class.card--sold-out]="product().stock === 0"
      (mouseenter)="onHover()"
      (mousemove)="onCardMouseMove($event)"
      (mouseleave)="onCardMouseLeave()"
    >
      <a class="card__media-wrap" [routerLink]="['/piece', product().slug]">
        @if (product().primaryImageUrl) {
          <img
            class="card__img"
            [src]="product().primaryImageUrl"
            [alt]="product().title"
            loading="lazy"
          />
        } @else {
          <div class="card__placeholder font-mono">DOCO ARCHIVE</div>
        }

        <!-- Holographic specular reflection sheen -->
        <div
          class="card__holo-sheen"
          [style.opacity]="sheenOpacity()"
          [style.background]="sheenGradient()"
        ></div>

        <div class="card__top-badges">
          @if (product().dropTag) {
            <doco-badge tone="crimson">{{ product().dropTag }}</doco-badge>
          }
          <doco-badge tone="dark">{{ eraLabel() }}</doco-badge>
        </div>

        <span class="card__size font-mono">TALLA {{ product().sizeLabel }}</span>

        @if (product().stock > 0) {
          <div class="card__overlay-actions">
            <button
              type="button"
              class="card__quick-btn font-mono"
              (click)="handleQuickView($event)"
              aria-label="Inspección rápida de la prenda"
            >
              [+] VISTA RÁPIDA
            </button>
            <span class="card__zoom-hint font-mono">VER FICHA COMPLETA ↗</span>
          </div>
        } @else {
          <div class="card__sold-overlay font-mono">SOLD OUT</div>
        }
      </a>

      <div class="card__body">
        <div class="card__meta font-mono">
          <span class="card__brand">{{ product().brandName }}</span>
          <span class="card__cond">{{ conditionLabel() }}</span>
        </div>

        <h3 class="card__title">
          <a [routerLink]="['/piece', product().slug]">{{ product().title }}</a>
        </h3>

        <div class="card__footer">
          <div class="card__prices">
            <span class="card__price font-mono">{{ priceFormatted() }}</span>
            @if (compareFormatted()) {
              <span class="card__compare font-mono">{{ compareFormatted() }}</span>
            }
          </div>

          <button
            type="button"
            class="card__add font-mono"
            [class.card__add--added]="addedRecently()"
            [disabled]="product().stock === 0"
            (click)="handleAddToBag($event)"
          >
            {{ addedRecently() ? '¡AGREGADA!' : (product().stock === 0 ? 'AGOTADO' : '+ BOLSA') }}
          </button>
        </div>
      </div>
    </article>
  `,
  styles: [`
    .card {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
      overflow: hidden;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      transition: transform 0.32s var(--ease-kinetic), border-color 0.32s var(--ease-kinetic), box-shadow 0.32s var(--ease-kinetic);
    }
    .card:hover,
    .card:focus-within {
      transform: translateY(-6px);
      border-color: var(--border-strong);
      box-shadow: var(--card-shadow-hover);
    }
    .card__media-wrap {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1 / 1;
      background: var(--bg-media);
      overflow: hidden;
      padding: 0.75rem;
    }
    .card__img {
      width: 100%;
      height: 100%;
      max-width: 100%;
      max-height: 100%;
      object-fit: contain;
      object-position: center;
      transition: transform 0.65s var(--ease-kinetic), filter 0.35s ease;
    }
    .card:hover .card__img {
      transform: scale(1.06);
    }
    .card--sold-out .card__img {
      filter: grayscale(0.85) brightness(0.55);
    }
    .card__holo-sheen {
      position: absolute;
      inset: 0;
      pointer-events: none;
      mix-blend-mode: overlay;
      transition: opacity 0.25s ease;
      z-index: 1;
    }
    .card__placeholder {
      width: 100%;
      height: 100%;
      display: grid;
      place-items: center;
      color: var(--text-dim);
      font-size: 0.78rem;
    }
    .card__top-badges {
      position: absolute;
      top: 0.65rem;
      left: 0.65rem;
      display: flex;
      flex-wrap: wrap;
      gap: 0.32rem;
      max-width: 72%;
      z-index: 2;
    }
    .card__size {
      position: absolute;
      top: 0.65rem;
      right: 0.65rem;
      z-index: 2;
      background: var(--text-bone);
      color: var(--bg-void);
      font-size: 0.66rem;
      font-weight: 700;
      padding: 0.18rem 0.48rem;
      border-radius: var(--radius-sharp);
    }
    .card__overlay-actions {
      position: absolute;
      left: 0.65rem;
      right: 0.65rem;
      bottom: 0.65rem;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      z-index: 2;
      opacity: 0;
      transform: translateY(8px);
      transition: opacity 0.28s var(--ease-kinetic), transform 0.28s var(--ease-kinetic);
    }
    .card:hover .card__overlay-actions {
      opacity: 1;
      transform: translateY(0);
    }
    .card__quick-btn {
      cursor: pointer;
      width: 100%;
      padding: 0.42rem 0.6rem;
      background: rgba(9, 9, 11, 0.88);
      color: #f5f3ee;
      border: 1px solid rgba(245, 243, 238, 0.35);
      backdrop-filter: blur(8px);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      border-radius: var(--radius-sharp);
      transition: all 0.18s ease;
    }
    .card__quick-btn:hover {
      background: var(--text-bone);
      color: var(--bg-void);
      border-color: var(--text-bone);
    }
    .card__zoom-hint {
      text-align: center;
      padding: 0.25rem 0.5rem;
      color: var(--text-dim);
      font-size: 0.62rem;
      letter-spacing: 0.08em;
    }
    .card__sold-overlay {
      position: absolute;
      inset: 0;
      display: grid;
      place-items: center;
      background: rgba(9, 9, 11, 0.65);
      color: #f5f3ee;
      font-size: 0.88rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      z-index: 2;
    }
    .card__body {
      display: flex;
      flex-direction: column;
      flex: 1;
      padding: 0.95rem;
      gap: 0.5rem;
    }
    .card__meta {
      display: flex;
      justify-content: space-between;
      gap: 0.4rem;
      font-size: 0.68rem;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: var(--text-muted);
    }
    .card__brand {
      font-weight: 700;
      color: var(--text-bone);
    }
    .card__title {
      margin: 0;
      font-size: 0.96rem;
      font-weight: 600;
      line-height: 1.3;
      flex: 1;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .card__title a:hover {
      text-decoration: underline;
      text-underline-offset: 3px;
    }
    .card__footer {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 0.6rem;
      padding-top: 0.65rem;
      border-top: 1px solid var(--border-subtle);
    }
    .card__prices {
      display: flex;
      flex-direction: column;
      min-width: 0;
    }
    .card__price {
      font-size: 0.94rem;
      font-weight: 700;
      color: var(--text-bone);
      white-space: nowrap;
    }
    .card__compare {
      font-size: 0.7rem;
      color: var(--text-dim);
      text-decoration: line-through;
    }
    .card__add {
      cursor: pointer;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      padding: 0.5rem 0.95rem;
      background: var(--bg-surface);
      color: var(--text-bone);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      white-space: nowrap;
      transition: all 0.2s var(--ease-kinetic);
    }
    .card__add:hover:not(:disabled) {
      background: var(--text-bone);
      color: var(--bg-void);
      border-color: var(--text-bone);
      transform: translateY(-1px);
    }
    .card__add--added {
      background: var(--accent-emerald) !important;
      color: #ffffff !important;
      border-color: var(--accent-emerald) !important;
      box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
    }
    .card__add:disabled {
      cursor: not-allowed;
      opacity: 0.4;
      border-color: var(--border-subtle);
    }
    @media (max-width: 768px) {
      .card:hover {
        transform: none;
      }
      .card__media-wrap {
        padding: 0.5rem;
      }
      .card__overlay-actions {
        display: none !important;
      }
      .card__top-badges {
        top: 0.4rem;
        left: 0.4rem;
        gap: 0.2rem;
        max-width: 65%;
      }
      .card__size {
        top: 0.4rem;
        right: 0.4rem;
        font-size: 0.58rem;
        padding: 0.12rem 0.38rem;
      }
      .card__body {
        padding: 0.65rem 0.75rem;
        gap: 0.35rem;
      }
      .card__cond {
        display: none;
      }
      .card__title {
        font-size: 0.84rem;
        line-height: 1.25;
      }
      .card__footer {
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        gap: 0.4rem;
        padding-top: 0.45rem;
      }
      .card__price {
        font-size: 0.88rem;
      }
      .card__add {
        min-height: 34px;
        padding: 0.42rem 0.7rem;
        font-size: 0.68rem;
        letter-spacing: 0.06em;
      }
    }
  `]
})
export class DocoProductCardComponent {
  readonly product = input.required<ProductSummary>();
  readonly addToBag = output<ProductSummary>();

  protected readonly quickView = inject(QuickViewService);
  private readonly soundFx = inject(SoundFxService);

  protected readonly priceFormatted = computed(() => formatMxn(this.product().priceMxn));
  protected readonly compareFormatted = computed(() => formatMxn(this.product().compareAtPriceMxn));
  protected readonly eraLabel = computed(() => formatEra(this.product().styleEra));
  protected readonly conditionLabel = computed(() => formatCondition(this.product().conditionGrade));

  protected readonly addedRecently = signal(false);
  protected readonly sheenOpacity = signal(0);
  protected readonly sheenGradient = signal(
    'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)'
  );

  protected onHover(): void {
    this.sheenOpacity.set(0.2);
  }

  protected onCardMouseMove(event: MouseEvent): void {
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();
    const x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
    const y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
    this.sheenGradient.set(
      `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.55) 0%, transparent 65%)`
    );
    this.sheenOpacity.set(0.35);
  }

  protected onCardMouseLeave(): void {
    this.sheenOpacity.set(0);
  }

  protected handleQuickView(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    this.quickView.open(this.product());
  }

  protected handleAddToBag(event: Event): void {
    event.stopPropagation();
    this.soundFx.playChime();
    this.addToBag.emit(this.product());
    this.addedRecently.set(true);
    setTimeout(() => {
      this.addedRecently.set(false);
    }, 1200);
  }
}

