import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DocoCartDrawerComponent } from './shared/components/doco-cart-drawer.component';
import { DocoFooterComponent } from './shared/components/doco-footer.component';
import { DocoMobileDockComponent } from './shared/components/doco-mobile-dock.component';
import { DocoNavbarComponent } from './shared/components/doco-navbar.component';
import { DocoQuickViewComponent } from './shared/components/doco-quick-view.component';
import { DocoWhatsappFloatComponent } from './shared/components/doco-whatsapp-float.component';

@Component({
  selector: 'doco-root',
  standalone: true,
  imports: [
    RouterOutlet,
    DocoNavbarComponent,
    DocoCartDrawerComponent,
    DocoFooterComponent,
    DocoWhatsappFloatComponent,
    DocoMobileDockComponent,
    DocoQuickViewComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <doco-navbar />
    <main class="main-stage">
      <router-outlet />
    </main>
    <doco-cart-drawer />
    <doco-footer />
    <doco-whatsapp-float />
    <doco-mobile-dock />
    <doco-quick-view />
  `,
  styles: [`
    .main-stage {
      min-height: 70vh;
    }
    @media (max-width: 768px) {
      .main-stage {
        padding-bottom: 60px;
      }
    }
  `]
})
export class AppComponent {}

