import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../core/auth/auth.service';
import { LayoutService } from '../../core/layout/layout.service';
import { OrderCartService } from '../../core/order-cart.service';
import { ThemeService } from '../../core/theme/theme.service';
import { ButtonComponent } from '../ui/button/button.component';

@Component({
  selector: 'app-header',
  imports: [ButtonComponent, CommonModule, FormsModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  readonly auth = inject(AuthService);
  readonly layout = inject(LayoutService);
  readonly theme = inject(ThemeService);
  readonly orderCart = inject(OrderCartService);

  readonly showOrders = signal(false);
  tableId: number | null = null;
  notes = '';
  orderMessage = '';
  orderError = '';

  toggleOrders(): void {
    this.showOrders.update((open) => !open);
  }

  placeOrder(): void {
    this.orderMessage = '';
    this.orderError = '';

    if (!this.tableId || this.tableId <= 0) {
      this.orderError = 'Enter valid table id.';
      return;
    }

    if (!this.orderCart.lines().length) {
      this.orderError = 'No order items found.';
      return;
    }

    this.orderCart.placeOrder(this.tableId, this.notes).subscribe({
      next: (orderId) => {
        this.orderMessage = `Order #${orderId} placed successfully. Total ₹${this.orderCart.totalAmount()}.`;
        this.orderCart.clear();
        this.tableId = null;
        this.notes = '';
      },
      error: (err: Error) => {
        this.orderError = err.message || 'Failed to place order.';
      },
    });
  }
}
