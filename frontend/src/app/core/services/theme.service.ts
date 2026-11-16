import { Injectable, computed, effect, signal } from '@angular/core';

export type DocoTheme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'doco_theme_v1';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly themeSignal = signal<DocoTheme>(this.loadInitialTheme());

  readonly theme = this.themeSignal.asReadonly();
  readonly isLight = computed(() => this.themeSignal() === 'light');

  constructor() {
    effect(() => {
      const current = this.themeSignal();
      document.documentElement.setAttribute('data-theme', current);
      const metaTheme = document.querySelector('meta[name="theme-color"]');
      if (metaTheme) {
        metaTheme.setAttribute('content', current === 'light' ? '#f7f5f0' : '#09090b');
      }
      try {
        localStorage.setItem(THEME_STORAGE_KEY, current);
      } catch {
        // Ignore storage restrictions
      }
    });
  }

  toggle(): void {
    this.themeSignal.update((prev) => (prev === 'dark' ? 'light' : 'dark'));
  }

  setTheme(mode: DocoTheme): void {
    this.themeSignal.set(mode);
  }

  private loadInitialTheme(): DocoTheme {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY);
      if (saved === 'light' || saved === 'dark') {
        return saved;
      }
    } catch {
      // Ignore storage errors
    }
    return 'dark';
  }
}
