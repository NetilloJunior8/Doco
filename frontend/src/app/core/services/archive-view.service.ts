import { Injectable, signal } from '@angular/core';

export type ArchiveGridDensity = 'S' | 'M' | 'L';

const INTRO_STORAGE_KEY = 'doco_intro_dismissed_v1';

@Injectable({ providedIn: 'root' })
export class ArchiveViewService {
  readonly density = signal<ArchiveGridDensity>('M');
  readonly isFilterOpen = signal<boolean>(false);
  readonly isInfoOpen = signal<boolean>(false);
  readonly isIntroOpen = signal<boolean>(this.checkIntroInitial());

  readonly selectedCategory = signal<string | null>(null);
  readonly selectedBrand = signal<string | null>(null);
  readonly searchQuery = signal<string>('');

  setDensity(d: ArchiveGridDensity): void {
    this.density.set(d);
  }

  toggleFilters(): void {
    this.isFilterOpen.update((v) => !v);
  }

  closeFilters(): void {
    this.isFilterOpen.set(false);
  }

  toggleInfo(): void {
    this.isInfoOpen.update((v) => !v);
  }

  closeInfo(): void {
    this.isInfoOpen.set(false);
  }

  openIntro(): void {
    this.isIntroOpen.set(true);
  }

  closeIntro(): void {
    this.isIntroOpen.set(false);
    try {
      sessionStorage.setItem(INTRO_STORAGE_KEY, '1');
    } catch {
      // Ignore storage restrictions
    }
  }

  selectCategory(slug: string | null): void {
    this.selectedCategory.set(slug);
  }

  selectBrand(slug: string | null): void {
    this.selectedBrand.set(slug);
  }

  setSearch(q: string): void {
    this.searchQuery.set(q);
  }

  resetFilters(): void {
    this.selectedCategory.set(null);
    this.selectedBrand.set(null);
    this.searchQuery.set('');
  }

  private checkIntroInitial(): boolean {
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(INTRO_STORAGE_KEY) !== '1';
    } catch {
      return true;
    }
  }
}
