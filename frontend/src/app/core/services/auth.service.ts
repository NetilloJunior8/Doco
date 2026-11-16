import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthResponse } from '../models/catalog.models';

const AUTH_STORAGE_KEY = 'doco_auth_v1';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiBaseUrl}/auth`;

  private readonly sessionSignal = signal<AuthResponse | null>(this.loadSession());

  readonly session = this.sessionSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.sessionSignal() !== null);
  readonly isAdmin = computed(() => this.sessionSignal()?.role === 'ROLE_ADMIN');
  readonly token = computed(() => this.sessionSignal()?.accessToken ?? null);

  login(email: string, password: string, captchaToken: string | null): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/login`, { email, password }, {
        headers: this.captchaHeaders(captchaToken)
      })
      .pipe(tap((res) => this.persistSession(res)));
  }

  register(
    fullName: string,
    email: string,
    password: string,
    captchaToken: string | null
  ): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.baseUrl}/register`, { fullName, email, password }, {
        headers: this.captchaHeaders(captchaToken)
      })
      .pipe(tap((res) => this.persistSession(res)));
  }

  logout(): void {
    this.sessionSignal.set(null);
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  }

  private captchaHeaders(captchaToken: string | null): HttpHeaders {
    let headers = new HttpHeaders();
    if (captchaToken) {
      headers = headers.set('X-Captcha-Token', captchaToken);
    }
    return headers;
  }

  private persistSession(session: AuthResponse): void {
    this.sessionSignal.set(session);
    try {
      sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // Ignore storage failures
    }
  }

  private loadSession(): AuthResponse | null {
    try {
      const raw = sessionStorage.getItem(AUTH_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as AuthResponse) : null;
    } catch {
      return null;
    }
  }
}
