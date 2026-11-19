import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocoCartDrawerComponent } from './shared/components/doco-cart-drawer.component';
import { DocoNavbarComponent } from './shared/components/doco-navbar.component';
import { DocoQuickViewComponent } from './shared/components/doco-quick-view.component';

@Component({
  selector: 'doco-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DocoNavbarComponent,
    DocoCartDrawerComponent,
    DocoQuickViewComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <doco-navbar />
    <main class="main-stage">
      <router-outlet />
    </main>
    <doco-cart-drawer />
    <doco-quick-view />
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      width: 100%;
      max-width: 100vw;
      overflow-x: clip;
      background: var(--bg-void);
      color: var(--text-bone);
    }

    .main-stage {
      flex: 1;
      width: 100%;
      max-width: 100vw;
      overflow-x: clip;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {}
