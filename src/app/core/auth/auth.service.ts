import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, map, tap } from 'rxjs';

import { UserApiService } from '../api/user-api.service';
import { UserModel, UserTypes } from '../../models/bms.models';
import { AuthRole, AuthUser, LoginCredentials, LoginRole } from './auth.models';

const STORAGE_KEY = 'foodrestorant.auth.user';

const roleByUserType: Record<UserTypes, LoginRole> = {
  [UserTypes.SUPER_ADMIN]: 'super_admin',
  [UserTypes.RESTAURANT_ADMIN]: 'restaurant_admin',
  [UserTypes.MANAGER]: 'manager',
  [UserTypes.WAITER]: 'waiter',
  [UserTypes.KITCHEN]: 'kitchen',
  [UserTypes.CASHIER]: 'cashier',
  [UserTypes.CUSTOMER]: 'customer',
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly userApi = inject(UserApiService);
  private readonly userSignal = signal<AuthUser | null>(this.loadStoredUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);
  readonly role = computed<AuthRole>(() => this.userSignal()?.role ?? 'guest');

  login(credentials: LoginCredentials): Observable<AuthUser> {
    return this.userApi
      .login({ Email: credentials.email, Password: credentials.password })
      .pipe(
        map((response) => {
          if (!response.Status) {
            throw new Error(response.Message || 'Login failed.');
          }

          return this.toAuthUser(response.Data);
        }),
        tap((user) => this.setUser(user)),
      );
  }

  logout(): void {
    this.userSignal.set(null);
    localStorage.removeItem(STORAGE_KEY);
    void this.router.navigate(['/login']);
  }

  hasAnyRole(roles: readonly AuthRole[]): boolean {
    return roles.includes(this.role());
  }

  private setUser(user: AuthUser): void {
    this.userSignal.set(user);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  private toAuthUser(user: UserModel): AuthUser {
    return {
      id: user.Id!!,
      name: user.Name,
      email: user.Email ?? '',
      mobile: user.Mobile,
      userType: user.UserType,
      role: roleByUserType[user.UserType],
    };
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
