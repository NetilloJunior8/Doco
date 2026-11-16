import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, of, throwError, timeout } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  Brand,
  Category,
  PageResponse,
  ProductDetail,
  ProductFilter,
  ProductSummary
} from '../models/catalog.models';
import {
  FALLBACK_BRANDS,
  FALLBACK_CATEGORIES,
  filterFallbackProducts,
  getFallbackProductBySlug
} from './catalog.fallback.data';

@Injectable({ providedIn: 'root' })
export class CatalogService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/catalog`;
  private readonly reqTimeoutMs = 3500;

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/categories`).pipe(
      timeout(this.reqTimeoutMs),
      catchError(() => of(FALLBACK_CATEGORIES))
    );
  }

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.baseUrl}/brands`).pipe(
      timeout(this.reqTimeoutMs),
      catchError(() => of(FALLBACK_BRANDS))
    );
  }

  searchProducts(filter: ProductFilter = {}): Observable<PageResponse<ProductSummary>> {
    let params = new HttpParams();
    const entries: [string, string | number | boolean | undefined][] = [
      ['category', filter.category],
      ['brand', filter.brand],
      ['era', filter.era],
      ['size', filter.size],
      ['inStockOnly', filter.inStockOnly],
      ['featuredOnly', filter.featuredOnly],
      ['search', filter.search],
      ['page', filter.page],
      ['pageSize', filter.pageSize],
      ['sort', filter.sort]
    ];

    for (const [key, value] of entries) {
      if (value !== undefined && value !== null && value !== '') {
        params = params.set(key, String(value));
      }
    }

    return this.http.get<PageResponse<ProductSummary>>(`${this.baseUrl}/products`, { params }).pipe(
      timeout(this.reqTimeoutMs),
      catchError(() => of(filterFallbackProducts(filter)))
    );
  }

  getProductBySlug(slug: string): Observable<ProductDetail> {
    return this.http.get<ProductDetail>(`${this.baseUrl}/products/${encodeURIComponent(slug)}`).pipe(
      timeout(this.reqTimeoutMs),
      catchError(() => {
        const fallback = getFallbackProductBySlug(slug);
        if (fallback) return of(fallback);
        return throwError(() => new Error('Pieza no encontrada'));
      })
    );
  }
}
