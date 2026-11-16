import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Brand, Category, PageResponse, ProductSummary, StyleEra } from '../../core/models/catalog.models';
import { CartService } from '../../core/services/cart.service';
import { CatalogService } from '../../core/services/catalog.service';
import { SoundFxService } from '../../core/services/sound-fx.service';
import { WhatsAppService } from '../../core/services/whatsapp.service';
import { DocoProductCardComponent } from '../../shared/components/doco-product-card.component';
import { DocoSectionHeaderComponent } from '../../shared/components/doco-section-header.component';
import { DocoStateViewComponent } from '../../shared/components/doco-state-view.component';

@Component({
  selector: 'doco-catalog-page',
  standalone: true,
  imports: [FormsModule, DocoSectionHeaderComponent, DocoProductCardComponent, DocoStateViewComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="doco-container catalog-wrap">
      <div class="catalog-top-bar">
        <doco-section-header
          eyebrow="ARCHIVO COMPLETO // DROP #01 CULIACÁN"
          title="CATÁLOGO DOCO"
        />

        <!-- Layout Density Switcher (Dense 4-col vs Editorial 2-col) -->
        <div class="view-toggles font-mono desktop-only">
          <button
            type="button"
            class="view-btn"
            [class.is-active]="viewMode() === 'grid'"
            (click)="setViewMode('grid')"
            title="Vista de cuadrícula densa"
          >
            [::] GRID
          </button>
          <button
            type="button"
            class="view-btn"
            [class.is-active]="viewMode() === 'editorial'"
            (click)="setViewMode('editorial')"
            title="Vista editorial ampliada"
          >
            [ = ] EDITORIAL
          </button>
        </div>
      </div>

      <!-- Horizontal Quick Era Pills (Thumb-friendly mobile UX) -->
      <div class="era-strip font-mono" role="tablist">
        <button type="button" class="era-chip" [class.is-active]="!selectedEra" (click)="selectEra('')">
          TODAS ({{ totalCount() }})
        </button>
        <button type="button" class="era-chip" [class.is-active]="selectedEra === 'Y2K'" (click)="selectEra('Y2K')">
          Y2K
        </button>
        <button type="button" class="era-chip" [class.is-active]="selectedEra === 'WORKWEAR'" (click)="selectEra('WORKWEAR')">
          WORKWEAR
        </button>
        <button type="button" class="era-chip" [class.is-active]="selectedEra === 'STREETWEAR'" (click)="selectEra('STREETWEAR')">
          STREETWEAR
        </button>
        <button type="button" class="era-chip" [class.is-active]="selectedEra === 'ARCHIVE'" (click)="selectEra('ARCHIVE')">
          ARCHIVE
        </button>
        <button type="button" class="era-chip mobile-filter-toggle" (click)="toggleFilters()">
          {{ filtersExpanded() ? '▲ OCULTAR' : '▼ FILTROS & ORDEN' }}
        </button>
      </div>

      <!-- Filter Controls Bar -->
      <form class="filter-bar font-mono" [class.is-open]="filtersExpanded()" (ngSubmit)="applyFilters(0)">
        <input
          type="search"
          [(ngModel)]="search"
          name="search"
          placeholder="Buscar por prenda, marca o SKU..."
          class="filter-input"
        />

        <select [(ngModel)]="selectedCategory" name="category" (change)="applyFilters(0)" class="filter-select">
          <option value="">Todas las categorías</option>
          @for (cat of categories(); track cat.id) {
            <option [value]="cat.slug">{{ cat.name }}</option>
          }
        </select>

        <select [(ngModel)]="selectedBrand" name="brand" (change)="applyFilters(0)" class="filter-select">
          <option value="">Todas las marcas</option>
          @for (b of brands(); track b.id) {
            <option [value]="b.slug">{{ b.name }}</option>
          }
        </select>

        <select [(ngModel)]="sort" name="sort" (change)="applyFilters(0)" class="filter-select">
          <option value="featured">Destacados</option>
          <option value="newest">Más recientes</option>
          <option value="price_asc">Precio: menor a mayor</option>
          <option value="price_desc">Precio: mayor a menor</option>
        </select>

        <label class="filter-check">
          <input type="checkbox" [(ngModel)]="inStockOnly" name="inStock" (change)="applyFilters(0)" />
          <span>Solo en stock</span>
        </label>

        <button type="button" class="filter-reset" (click)="resetFilters()">LIMPIAR</button>
      </form>

      @if (loading()) {
        <doco-state-view mode="loading" />
      } @else if (error()) {
        <doco-state-view mode="error" [message]="error()" (retry)="loadProducts()" />
      } @else if (pageData()?.items?.length === 0) {
        <doco-state-view
          mode="empty"
          message="No encontramos piezas con estos filtros. Puedes consultar directamente si tenemos esa prenda en bodega."
          actionLabel="VER TODO EL ARCHIVO"
          (retry)="resetFilters()"
        />
        <div class="catalog-wa-help font-mono">
          <span>¿Buscas una pieza específica o talla difícil?</span>
          <button type="button" (click)="askViaWa()">Consultar pieza con bodega Culiacán ↗</button>
        </div>
      } @else if (pageData(); as data) {
        <div class="results-meta font-mono">
          <span>Mostrando {{ data.items.length }} de {{ data.totalElements }} piezas exclusivas</span>
          <span>Página {{ data.page + 1 }} de {{ Math.max(1, data.totalPages) }}</span>
        </div>

        <div
          class="product-grid"
          [class.product-grid--editorial]="viewMode() === 'editorial'"
        >
          @for (item of data.items; track item.id) {
            <doco-product-card [product]="item" (addToBag)="cart.addItem($event)" />
          }
        </div>

        @if (data.totalPages > 1) {
          <nav class="pagination font-mono" aria-label="Paginación del catálogo">
            <button
              type="button"
              [disabled]="data.page === 0"
              (click)="onPageChange(data.page - 1)"
            >
              ← ANTERIOR
            </button>
            <span class="page-indicator">{{ data.page + 1 }} / {{ data.totalPages }}</span>
            <button
              type="button"
              [disabled]="!data.hasNext"
              (click)="onPageChange(data.page + 1)"
            >
              SIGUIENTE →
            </button>
          </nav>
        }
      }
    </section>
  `,
  styles: [`
    .catalog-wrap {
      padding-top: 2.5rem;
      padding-bottom: 5rem;
    }
    .catalog-top-bar {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .view-toggles {
      display: flex;
      gap: 0.4rem;
      margin-bottom: 2rem;
    }
    .view-btn {
      cursor: pointer;
      padding: 0.45rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.68rem;
      font-weight: 700;
      letter-spacing: 0.08em;
      color: var(--text-muted);
      transition: all 0.18s;
    }
    .view-btn.is-active,
    .view-btn:hover {
      border-color: var(--text-bone);
      color: var(--text-bone);
      background: var(--bg-elevated);
    }
    .era-strip {
      display: flex;
      gap: 0.55rem;
      overflow-x: auto;
      padding-bottom: 0.75rem;
      margin-bottom: 1.25rem;
      scrollbar-width: none;
    }
    .era-strip::-webkit-scrollbar {
      display: none;
    }
    .era-chip {
      cursor: pointer;
      flex-shrink: 0;
      padding: 0.55rem 1.15rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.1em;
      color: var(--text-muted);
      transition: all 0.2s var(--ease-kinetic);
    }
    .era-chip.is-active,
    .era-chip:hover {
      background: var(--text-bone);
      color: var(--bg-void);
      border-color: var(--text-bone);
      transform: translateY(-1px);
    }
    .mobile-filter-toggle {
      display: none;
      margin-left: auto;
      border-color: var(--border-strong);
      color: var(--text-bone);
    }
    .filter-bar {
      display: grid;
      grid-template-columns: 1.5fr repeat(3, 1fr) auto auto;
      gap: 0.75rem;
      align-items: center;
      padding: 1rem 1.25rem;
      margin-bottom: 1.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
      font-size: 0.78rem;
    }
    .filter-input,
    .filter-select {
      width: 100%;
      padding: 0.58rem 0.75rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      outline: none;
      color: var(--text-bone);
      transition: border-color 0.18s;
    }
    .filter-input:focus,
    .filter-select:focus {
      border-color: var(--border-strong);
    }
    .filter-check {
      display: inline-flex;
      align-items: center;
      gap: 0.45rem;
      white-space: nowrap;
      color: var(--text-muted);
      cursor: pointer;
    }
    .filter-reset {
      cursor: pointer;
      padding: 0.58rem 0.95rem;
      background: transparent;
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      color: var(--text-bone);
      font-size: 0.72rem;
      font-weight: 700;
    }
    .results-meta {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1.2rem;
      font-size: 0.72rem;
      color: var(--text-muted);
    }
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(265px, 1fr));
      gap: 1.4rem;
    }
    .product-grid--editorial {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 2rem !important;
    }
    .pagination {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 1.2rem;
      margin-top: 3rem;
    }
    .pagination button {
      cursor: pointer;
      padding: 0.7rem 1.4rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-strong);
      border-radius: var(--radius-sharp);
      font-size: 0.76rem;
      font-weight: 700;
      color: var(--text-bone);
      transition: background 0.18s;
    }
    .pagination button:disabled {
      opacity: 0.35;
      cursor: not-allowed;
    }
    .page-indicator {
      font-size: 0.78rem;
      color: var(--text-muted);
    }
    .catalog-wa-help {
      margin-top: 2rem;
      padding: 1.25rem;
      background: var(--bg-surface);
      border: 1px solid rgba(37, 211, 102, 0.3);
      border-radius: var(--radius-card);
      text-align: center;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      font-size: 0.78rem;
    }
    .catalog-wa-help button {
      cursor: pointer;
      margin: 0 auto;
      background: transparent;
      border: none;
      color: #25d366;
      font-weight: 700;
      text-decoration: underline;
    }
    @media (max-width: 1024px) {
      .desktop-only {
        display: none;
      }
      .mobile-filter-toggle {
        display: inline-flex;
      }
      .filter-bar {
        display: none;
        grid-template-columns: 1fr 1fr;
      }
      .filter-bar.is-open {
        display: grid;
      }
      .filter-input {
        grid-column: 1 / -1;
      }
    }
    @media (max-width: 640px) {
      .catalog-wrap {
        padding-top: 1.25rem;
        padding-bottom: 5.5rem;
      }
      .filter-bar.is-open {
        grid-template-columns: 1fr;
      }
      .product-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 0.75rem;
      }
    }
  `]
})
export class CatalogPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  protected readonly cart = inject(CartService);
  protected readonly soundFx = inject(SoundFxService);
  protected readonly whatsapp = inject(WhatsAppService);
  protected readonly Math = Math;

  protected readonly categories = signal<Category[]>([]);
  protected readonly brands = signal<Brand[]>([]);
  protected readonly pageData = signal<PageResponse<ProductSummary> | null>(null);
  protected readonly totalCount = signal(8);
  protected readonly loading = signal(true);
  protected readonly error = signal('');
  protected readonly filtersExpanded = signal(false);
  protected readonly viewMode = signal<'grid' | 'editorial'>('grid');

  protected search = '';
  protected selectedCategory = '';
  protected selectedBrand = '';
  protected selectedEra: StyleEra | '' = '';
  protected sort: 'featured' | 'newest' | 'price_asc' | 'price_desc' = 'featured';
  protected inStockOnly = false;
  protected currentPage = 0;

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe((c) => this.categories.set(c));
    this.catalogService.getBrands().subscribe((b) => this.brands.set(b));

    this.route.queryParamMap.subscribe((params) => {
      this.search = params.get('search') ?? '';
      this.selectedCategory = params.get('category') ?? '';
      this.selectedBrand = params.get('brand') ?? '';
      this.selectedEra = (params.get('era') as StyleEra | '') ?? '';
      this.sort = (params.get('sort') as typeof this.sort) ?? 'featured';
      this.inStockOnly = params.get('inStockOnly') === 'true';
      this.currentPage = Number(params.get('page') ?? 0);
      this.loadProducts();
    });
  }

  protected setViewMode(mode: 'grid' | 'editorial'): void {
    this.soundFx.playClick();
    this.viewMode.set(mode);
  }

  protected toggleFilters(): void {
    this.soundFx.playClick();
    this.filtersExpanded.update((v) => !v);
  }

  protected selectEra(era: StyleEra | ''): void {
    this.soundFx.playClick();
    this.selectedEra = era;
    this.applyFilters(0);
  }

  protected onPageChange(page: number): void {
    this.soundFx.playClick();
    this.applyFilters(page);
  }

  protected applyFilters(page: number): void {
    const queryParams: Record<string, string | number | boolean> = {};
    if (this.search.trim()) queryParams['search'] = this.search.trim();
    if (this.selectedCategory) queryParams['category'] = this.selectedCategory;
    if (this.selectedBrand) queryParams['brand'] = this.selectedBrand;
    if (this.selectedEra) queryParams['era'] = this.selectedEra;
    if (this.sort !== 'featured') queryParams['sort'] = this.sort;
    if (this.inStockOnly) queryParams['inStockOnly'] = true;
    if (page > 0) queryParams['page'] = page;
    this.router.navigate(['/catalog'], { queryParams });
  }

  protected resetFilters(): void {
    this.soundFx.playClick();
    this.search = '';
    this.selectedCategory = '';
    this.selectedBrand = '';
    this.selectedEra = '';
    this.sort = 'featured';
    this.inStockOnly = false;
    this.router.navigate(['/catalog']);
  }

  protected askViaWa(): void {
    const url = this.whatsapp.generateGeneralInquiryUrl();
    this.whatsapp.openUrl(url);
  }

  protected loadProducts(): void {
    this.loading.set(true);
    this.error.set('');
    this.catalogService
      .searchProducts({
        search: this.search,
        category: this.selectedCategory,
        brand: this.selectedBrand,
        era: this.selectedEra,
        sort: this.sort,
        inStockOnly: this.inStockOnly || undefined,
        page: this.currentPage,
        pageSize: 12
      })
      .subscribe({
        next: (res) => {
          this.pageData.set(res);
          this.totalCount.set(res.totalElements);
          this.loading.set(false);
        },
        error: (err) => {
          this.error.set(err?.message || 'Error al cargar catálogo.');
          this.loading.set(false);
        }
      });
  }
}
