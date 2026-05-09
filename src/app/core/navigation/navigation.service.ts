import { Injectable, computed, inject } from '@angular/core';

import { AuthService } from '../auth/auth.service';
import { drawerNavigationItems } from './navigation.config';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  private readonly auth = inject(AuthService);

  readonly drawerItems = computed(() => {
    const role = this.auth.role();
    return drawerNavigationItems.filter((item) => item.roles.includes(role));
  });
}
