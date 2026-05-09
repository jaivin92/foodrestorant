import { Routes } from '@angular/router';

import { authGuard, loginRedirectGuard, roleGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    canActivate: [loginRedirectGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Login | Food Restorant',
  },
  {
    path: 'login',
    canActivate: [loginRedirectGuard],
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    title: 'Login | Food Restorant',
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, roleGuard(['customer', 'admin', 'cook', 'staff', 'cashier'])],
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    title: 'Dashboard | Food Restorant',
  },
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard(['admin'])],
    loadComponent: () => import('./pages/admin/admin.component').then((m) => m.AdminComponent),
    title: 'Admin | Food Restorant',
  },
  {
    path: 'table-status',
    canActivate: [authGuard, roleGuard(['admin', 'staff'])],
    loadComponent: () => import('./pages/table-status/table-status.component').then((m) => m.TableStatusComponent),
    title: 'Table Status | Food Restorant',
  },
  {
    path: 'order-desk',
    canActivate: [authGuard, roleGuard(['admin', 'staff', 'cook', 'cashier'])],
    loadComponent: () => import('./pages/order-desk/order-desk.component').then((m) => m.OrderDeskComponent),
    title: 'Order Desk | Food Restorant',
  },
  {
    path: 'kitchen',
    canActivate: [authGuard, roleGuard(['admin', 'cook', 'staff'])],
    loadComponent: () => import('./pages/kitchen/kitchen.component').then((m) => m.KitchenComponent),
    title: 'Kitchen Queue | Food Restorant',
  },
  {
    path: 'cashier',
    canActivate: [authGuard, roleGuard(['admin', 'cashier'])],
    loadComponent: () => import('./pages/cashier/cashier.component').then((m) => m.CashierComponent),
    title: 'Cashier | Food Restorant',
  },
  {
    path: 'settings',
    canActivate: [authGuard, roleGuard(['customer', 'admin', 'cook', 'staff', 'cashier'])],
    loadComponent: () => import('./pages/settings/settings.component').then((m) => m.SettingsComponent),
    title: 'Settings | Food Restorant',
  },
  {
    path: '**',
    redirectTo: 'login',
  },
];
