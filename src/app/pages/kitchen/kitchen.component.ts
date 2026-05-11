import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';

import { CardComponent } from '../../components/ui/card/card.component';
import { OrderApiService, OrderItemApiService } from '../../core/api';
import { DataTableRequest, OrderItemModel, OrderModel, OrderStatusEnum } from '../../models';

interface KitchenQueueItem {
  order: OrderModel;
  items: OrderItemModel[];
}

@Component({
  selector: 'app-kitchen',
  imports: [CommonModule, CardComponent],
  templateUrl: './kitchen.component.html',
  styleUrl: './kitchen.component.scss',
})
export class KitchenComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly orderApi = inject(OrderApiService);
  private readonly orderItemApi = inject(OrderItemApiService);

  queue: KitchenQueueItem[] = [];

  ngOnInit(): void {
    this.loadQueue();
  }

  private loadQueue(): void {
    const acceptedOrderRequest = new DataTableRequest({
      filterObj: { IsActive: true, OrderStatus: OrderStatusEnum.Accepted },
      orderDir: 'desc',
    });

    this.orderApi.getAll(acceptedOrderRequest).subscribe((orderResponse) => {
      if (!orderResponse.Status) {
        this.queue = [];
        this.cdr.detectChanges();
        return;
      }

      const acceptedOrders = orderResponse.Data.Data;
      if (!acceptedOrders.length) {
        this.queue = [];
        this.cdr.detectChanges();
        return;
      }

      const orderItemRequest = new DataTableRequest({ filterObj: { IsActive: true } });
      this.orderItemApi.getAll(orderItemRequest).subscribe((itemResponse) => {
        if (!itemResponse.Status) {
          this.queue = [];
          this.cdr.detectChanges();
          return;
        }

        const acceptedOrderIds = new Set(acceptedOrders.map((order) => order.Id).filter((id): id is number => typeof id === 'number'));
        const cookingItems = itemResponse.Data.Data.filter(
          (item) =>
            acceptedOrderIds.has(item.OrderId) &&
            item.OrderStatus !== OrderStatusEnum.Served &&
            item.OrderStatus !== OrderStatusEnum.Completed &&
            item.OrderStatus !== OrderStatusEnum.Cancelled,
        );

        this.queue = acceptedOrders
          .map((order) => ({
            order,
            items: cookingItems.filter((item) => item.OrderId === order.Id),
          }))
          .filter((entry) => entry.items.length > 0);

        this.cdr.detectChanges();
      });
    });
  }
}
