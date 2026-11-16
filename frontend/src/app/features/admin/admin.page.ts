import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Brand, Category, GarmentCondition, StyleEra } from '../../core/models/catalog.models';
import { CatalogService } from '../../core/services/catalog.service';
import { CheckoutService } from '../../core/services/checkout.service';
import { DocoSectionHeaderComponent } from '../../shared/components/doco-section-header.component';

@Component({
  selector: 'doco-admin-page',
  standalone: true,
  imports: [FormsModule, DocoSectionHeaderComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <section class="doco-container admin-wrap">
      <doco-section-header
        eyebrow="CONSOLA DE DROP // ROLE_ADMIN"
        title="GESTIÓN DE INVENTARIO"
      />

      <form class="admin-card" (ngSubmit)="createPiece()">
        <div class="grid-2">
          <label>
            <span>SKU único</span>
            <input type="text" [(ngModel)]="sku" name="sku" placeholder="DOCO-Y2K-009" required />
          </label>
          <label>
            <span>Título de la pieza</span>
            <input type="text" [(ngModel)]="title" name="title" placeholder="Carhartt Active Jacket..." required />
          </label>
        </div>

        <label>
          <span>Descripción curada</span>
          <textarea [(ngModel)]="description" name="description" rows="3" required></textarea>
        </label>

        <div class="grid-3">
          <label>
            <span>Precio MXN</span>
            <input type="number" [(ngModel)]="priceMxn" name="priceMxn" min="1" required />
          </label>
          <label>
            <span>Talla</span>
            <input type="text" [(ngModel)]="sizeLabel" name="sizeLabel" placeholder="L / 34x32" required />
          </label>
          <label>
            <span>Stock</span>
            <input type="number" [(ngModel)]="stock" name="stock" min="0" required />
          </label>
        </div>

        <div class="grid-3">
          <label>
            <span>Categoría</span>
            <select [(ngModel)]="categoryId" name="categoryId" required>
              @for (c of categories(); track c.id) {
                <option [ngValue]="c.id">{{ c.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Marca</span>
            <select [(ngModel)]="brandId" name="brandId" required>
              @for (b of brands(); track b.id) {
                <option [ngValue]="b.id">{{ b.name }}</option>
              }
            </select>
          </label>
          <label>
            <span>Era</span>
            <select [(ngModel)]="styleEra" name="styleEra">
              <option value="VINTAGE">VINTAGE</option>
              <option value="STREETWEAR">STREETWEAR</option>
              <option value="Y2K">Y2K</option>
              <option value="WORKWEAR">WORKWEAR</option>
              <option value="ARCHIVE">ARCHIVE</option>
            </select>
          </label>
        </div>

        <div class="grid-2">
          <label>
            <span>Condición</span>
            <select [(ngModel)]="conditionGrade" name="conditionGrade">
              <option value="DEADSTOCK">DEADSTOCK</option>
              <option value="MINT_9_10">MINT 9/10</option>
              <option value="VINTAGE_8_10">VINTAGE 8/10</option>
              <option value="DISTRESSED">DISTRESSED</option>
            </select>
          </label>
          <label>
            <span>URL de imagen principal</span>
            <input type="text" [(ngModel)]="imageUrl" name="imageUrl" required />
          </label>
        </div>

        @if (feedback()) {
          <p class="feedback font-mono">{{ feedback() }}</p>
        }

        <button type="submit" class="save-btn font-mono" [disabled]="saving()">
          {{ saving() ? 'PUBLICANDO...' : 'PUBLICAR PIEZA EN CATÁLOGO →' }}
        </button>
      </form>
    </section>
  `,
  styles: [`
    .admin-wrap { padding-top: 3rem; }
    .admin-card {
      padding: 2rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-card);
    }
    .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
    .grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    label {
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
      margin-bottom: 1rem;
      font-size: 0.82rem;
      color: var(--text-muted);
    }
    input, select, textarea {
      padding: 0.65rem 0.8rem;
      background: var(--bg-void);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sharp);
      color: var(--text-bone);
    }
    .feedback { color: var(--accent-emerald); font-size: 0.8rem; }
    .save-btn {
      cursor: pointer;
      padding: 0.9rem 1.5rem;
      background: var(--text-bone);
      color: var(--bg-void);
      border: none;
      font-weight: 700;
      font-size: 0.8rem;
      letter-spacing: 0.1em;
    }
    @media (max-width: 760px) {
      .grid-2, .grid-3 { grid-template-columns: 1fr; }
    }
  `]
})
export class AdminPageComponent implements OnInit {
  private readonly catalogService = inject(CatalogService);
  private readonly checkoutService = inject(CheckoutService);

  protected readonly categories = signal<Category[]>([]);
  protected readonly brands = signal<Brand[]>([]);
  protected readonly saving = signal(false);
  protected readonly feedback = signal('');

  protected sku = '';
  protected title = '';
  protected description = '';
  protected priceMxn = 1950;
  protected sizeLabel = 'L';
  protected stock = 1;
  protected categoryId = 1;
  protected brandId = 1;
  protected styleEra: StyleEra = 'Y2K';
  protected conditionGrade: GarmentCondition = 'MINT_9_10';
  protected imageUrl = '/assets/products/carhartt-detroit-jacket.jpg';

  ngOnInit(): void {
    this.catalogService.getCategories().subscribe((c) => {
      this.categories.set(c);
      if (c[0]) this.categoryId = c[0].id;
    });
    this.catalogService.getBrands().subscribe((b) => {
      this.brands.set(b);
      if (b[0]) this.brandId = b[0].id;
    });
  }

  protected createPiece(): void {
    this.saving.set(true);
    this.feedback.set('');
    this.checkoutService
      .createAdminProduct({
        sku: this.sku,
        title: this.title,
        description: this.description,
        priceMxn: this.priceMxn,
        compareAtPriceMxn: null,
        sizeLabel: this.sizeLabel,
        measurements: 'Verificadas por DOCO',
        styleEra: this.styleEra,
        conditionGrade: this.conditionGrade,
        stock: this.stock,
        dropTag: 'NEW DROP',
        featured: true,
        categoryId: this.categoryId,
        brandId: this.brandId,
        imageUrls: [this.imageUrl]
      })
      .subscribe({
        next: (created) => {
          this.feedback.set(`Pieza publicada: ${created.title} (${created.sku})`);
          this.saving.set(false);
        },
        error: (err) => {
          this.feedback.set(err?.message || 'Error al publicar pieza.');
          this.saving.set(false);
        }
      });
  }
}
