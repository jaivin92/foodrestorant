import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { AuthRole, AuthUser, LoginCredentials, LoginRole } from './auth.models';

const STORAGE_KEY = 'foodrestorant.auth.user';

const roleDisplayNames: Record<LoginRole, string> = {
  admin: 'Restaurant Admin',
  cook: 'Kitchen Cook',
  staff: 'Floor Staff',
  cashier: 'Cashier Desk',
  customer: 'Hungry Guest',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly userSignal = signal<AuthUser | null>(this.loadStoredUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly role = computed<AuthRole>(() => this.userSignal()?.role ?? 'guest');

  login(credentials: LoginCredentials): void {
    const user: AuthUser = {
      name: roleDisplayNames[credentials.role],
      email: credentials.email,
      role: credentials.role,
    };

    this.userSignal.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
    void this.router.navigate(['/login']);
  }

  hasAnyRole(roles: readonly AuthRole[]): boolean {
    return roles.includes(this.role());
  }

  private loadStoredUser(): AuthUser | null {
    const rawUser = localStorage.getItem(STORAGE_KEY);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as AuthUser;
    } catch {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
  }
}
