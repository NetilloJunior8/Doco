import { Routes } from '@angular/router';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.page').then((m) => m.HomePageComponent)
  },
  {
    path: 'catalog',
    redirectTo: ''
  },
  {
    path: 'piece/:slug',
    loadComponent: () =>
      import('./features/product-detail/product-detail.page').then((m) => m.ProductDetailPageComponent)
  },
  {
    path: 'checkout',
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPageComponent)
  },
  {
    path: 'checkout/success',
    loadComponent: () => import('./features/checkout/checkout.page').then((m) => m.CheckoutPageComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./features/auth/auth.page').then((m) => m.AuthPageComponent)
  },
  {
    path: 'admin',
    canActivate: [adminGuard],
    loadComponent: () => import('./features/admin/admin.page').then((m) => m.AdminPageComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
