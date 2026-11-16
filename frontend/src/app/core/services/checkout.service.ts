import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  CheckoutRequest,
  CheckoutSessionResponse,
  CreateProductPayload,
  ProductDetail
} from '../models/catalog.models';

@Injectable({ providedIn: 'root' })
export class CheckoutService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiBaseUrl;

  createCheckout(
    payload: CheckoutRequest,
    captchaToken: string | null
  ): Observable<CheckoutSessionResponse> {
    let headers = new HttpHeaders();
    if (captchaToken) {
      headers = headers.set('X-Captcha-Token', captchaToken);
    }
    return this.http.post<CheckoutSessionResponse>(`${this.baseUrl}/checkout`, payload, { headers });
  }

  getOrderStatus(orderNumber: string): Observable<CheckoutSessionResponse> {
    return this.http.get<CheckoutSessionResponse>(
      `${this.baseUrl}/checkout/${encodeURIComponent(orderNumber)}`
    );
  }

  createAdminProduct(payload: CreateProductPayload): Observable<ProductDetail> {
    return this.http.post<ProductDetail>(`${this.baseUrl}/admin/products`, payload);
  }

  updateAdminStock(productId: number, stock: number): Observable<ProductDetail> {
    return this.http.patch<ProductDetail>(
      `${this.baseUrl}/admin/products/${productId}/stock?stock=${stock}`,
      {}
    );
  }
}
