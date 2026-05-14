import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { ButtonComponent } from '../../components/ui/button/button.component';
import { CardComponent } from '../../components/ui/card/card.component';
import { OrderApiService } from '../../core/api';
import { DataTableRequest, OrderModel } from '../../models';

@Component({
  selector: 'app-cashier',
  imports: [CommonModule, ButtonComponent, CardComponent],
  templateUrl: './cashier.component.html',
  styleUrl: './cashier.component.scss',
})
export class CashierComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly orderApi = inject(OrderApiService);

  activeOrders: OrderModel[] = [];
  saveError = '';

  ngOnInit(): void {
    this.loadActiveOrders();
  }

  settleBill(order: OrderModel): void {
    this.saveError = '';
    const payload: OrderModel = { ...order, IsActive: false };

    this.orderApi.update(payload).subscribe({
      next: (response) => {
        if (!response.Status) {
          this.saveError = response.Message || 'Unable to settle bill.';
          this.cdr.detectChanges();
          return;
        }

        this.activeOrders = this.activeOrders.filter((item) => item.Id !== order.Id);
        this.cdr.detectChanges();
      },
      error: (err: Error) => {
        this.saveError = err.message || 'Unable to settle bill.';
        this.cdr.detectChanges();
      },
    });
  }

  private loadActiveOrders(): void {
    const request = new DataTableRequest({ filterObj: { IsActive: true }, orderDir: 'desc' });
    this.orderApi.getAll(request).subscribe((response) => {
      if (response.Status) {
        this.activeOrders = response.Data.Data;
      }
      this.cdr.detectChanges();
    });
  }
}
