import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';

import { AuthRole } from './auth.models';
import { AuthService } from './auth.service';

export const authGuard: CanActivateFn = (): true | UrlTree => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isAuthenticated() ? true : router.createUrlTree(['/login']);
};

export const roleGuard = (roles: readonly AuthRole[]): CanActivateFn => {
  return (): true | UrlTree => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.hasAnyRole(roles) ? true : router.createUrlTree(['/dashboard']);
  };
};
