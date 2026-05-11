import { computed, Injectable, inject, signal } from '@angular/core';
import { finalize, forkJoin, of, switchMap } from 'rxjs';

import { OrderApiService } from './api/order-api.service';
import { OrderItemApiService } from './api/order-item-api.service';
import { AuthService } from './auth/auth.service';
import { FoodModel, OrderItemModel, OrderModel, OrderStatus, OrderStatusEnum, OrderTypeEnum, orderTypeValues } from '../models';

interface CartLine {
  food: FoodModel;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class OrderCartService {
  private readonly auth = inject(AuthService);
  private readonly orderApi = inject(OrderApiService);
  private readonly orderItemApi = inject(OrderItemApiService);

  private readonly linesSignal = signal<CartLine[]>([]);
  readonly lines = this.linesSignal.asReadonly();
  readonly totalItems = computed(() => this.linesSignal().reduce((sum, line) => sum + line.quantity, 0));
  readonly totalAmount = computed(() => this.linesSignal().reduce((sum, line) => sum + line.food.Price * line.quantity, 0));
  readonly isSaving = signal(false);

  add(food: FoodModel): void {
    const lines = [...this.linesSignal()];
    const existing = lines.find((line) => line.food.Id === food.Id);
    if (existing) {
      existing.quantity += 1;
    } else {
      lines.push({ food, quantity: 1 });
    }
    this.linesSignal.set(lines);
  }

  changeQty(foodId: number, quantity: number): void {
    const lines = this.linesSignal()
      .map((line) => (line.food.Id === foodId ? { ...line, quantity } : line))
      .filter((line) => line.quantity > 0);
    this.linesSignal.set(lines);
  }

  placeOrder(tableId: number, notes?: string | null) {
    const user = this.auth.user();
    if (!user) {
      throw new Error('Please login first.');
    }

    const orderPayload: OrderModel = {
       Id: 0,
      IsActive: true,
      UserId: user.id,
      OrderStatus: OrderStatusEnum.Pending,
      OrderType: OrderTypeEnum.DineIn,
      OrderDate: new Date().toISOString(),
      Notes: notes || null,
    };

    this.isSaving.set(true);

    return this.orderApi.insert(orderPayload).pipe(
      switchMap((response) => {
        if (!response.Status || !response.Data?.Id) {
          throw new Error(response.Message || 'Unable to create order.');
        }

        const orderId = response.Data.Id;
        const itemRequests = this.linesSignal().map((line) => {
          const model: OrderItemModel = {
            //Id: 0,
            IsActive: true,
            OrderId: orderId,
            FoodId: line.food.Id,
            Quantity: line.quantity,
            FoodTableId: tableId,
            OrderStatus: OrderStatusEnum.Pending,
            Notes: "teststes",
          };

          return this.orderItemApi.insert(model);
        });

        return itemRequests.length ? forkJoin(itemRequests).pipe(switchMap(() => of(orderId))) : of(orderId);
      }),
      finalize(() => this.isSaving.set(false)),
    );
  }

  clear(): void {
    this.linesSignal.set([]);
  }
}
