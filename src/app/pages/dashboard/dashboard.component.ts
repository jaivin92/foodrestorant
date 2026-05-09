import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { CardComponent } from '../../components/ui/card/card.component';
import { AuthRole } from '../../core/auth/auth.models';
import { AuthService } from '../../core/auth/auth.service';
import { NavigationService } from '../../core/navigation/navigation.service';

@Component({
  selector: 'app-dashboard',
  imports: [CardComponent, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  readonly auth = inject(AuthService);
  private readonly navigation = inject(NavigationService);

  readonly quickActions = computed(() => this.navigation.drawerItems().filter((item) => item.route !== '/dashboard'));

  readonly tableStatus = [
    { label: 'Booked', value: 6 },
    { label: 'Pending', value: 3 },
    { label: 'Occupied', value: 11 },
    { label: 'Available', value: 8 },
  ];

  readonly operations: readonly { label: string; value: number; roles: readonly AuthRole[] }[] = [
    { label: 'Open orders', value: 17, roles: ['super_admin', 'restaurant_admin', 'manager', 'waiter', 'kitchen', 'cashier'] },
    { label: 'Kitchen ready', value: 5, roles: ['super_admin', 'restaurant_admin', 'manager', 'kitchen'] },
    { label: 'Bills pending', value: 4, roles: ['super_admin', 'restaurant_admin', 'manager', 'cashier'] },
    { label: 'My reservations', value: 2, roles: ['customer'] },
  ];

  readonly visibleOperations = computed(() => {
    const role = this.auth.role();
    return this.operations.filter((operation) => operation.roles.includes(role));
  });
}
