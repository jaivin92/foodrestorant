import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin, of, switchMap } from 'rxjs';

import { FoodApiService, FoodCategoryApiService, OrderApiService, OrderItemApiService } from 'src/app/core/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DataTableRequest, FoodCategoryModel, FoodModel, OrderItemModel, OrderModel, OrderStatus, OrderStatusEnum, OrderTypeEnum } from 'src/app/models';

interface CartLine {
  food: FoodModel;
  quantity: number;
}

@Component({
  selector: 'app-order-desk',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-desk.component.html',
  styleUrl: './order-desk.component.scss',
})
export class OrderDeskComponent implements OnInit {
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly foodApi = inject(FoodApiService);
  private readonly categoryApi = inject(FoodCategoryApiService);
  private readonly orderApi = inject(OrderApiService);
  private readonly orderItemApi = inject(OrderItemApiService);
  private readonly authService = inject(AuthService);

  readonly datatable = new DataTableRequest({ filterObj: { IsActive: true } });

  foods: FoodModel[] = [];
  categories: FoodCategoryModel[] = [];
  groupedFoods: Array<{ category: FoodCategoryModel | null; items: FoodModel[] }> = [];
  selectedCategoryId: number | null = null;

  tableId: number | null = null;
  notes = '';
  diningType = 'Dine In';
  isSaving = false;
  saveError = '';
  saveSuccess = '';
  activeOrders: OrderModel[] = [];
  isOrderPanelOpen = false;

  private readonly cart = new Map<number, CartLine>();

  ngOnInit(): void {
    this.loadProducts();
    this.loadActiveOrders();
  }

  get cartLines(): CartLine[] {
    return Array.from(this.cart.values());
  }

  get totalQty(): number {
    return this.cartLines.reduce((sum, line) => sum + line.quantity, 0);
  }

  get totalAmount(): number {
    return this.cartLines.reduce((sum, line) => sum + line.food.Price * line.quantity, 0);
  }

  setCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.groupProducts();
  }

  addItem(food: FoodModel): void {
    this.isOrderPanelOpen = true;
    const line = this.cart.get(food.Id!!);
    if (line) {
      line.quantity += 1;
    } else {
      this.cart.set(food.Id!!, { food, quantity: 1 });
    }
  }

  changeQty(foodId: number, qty: number): void {
    const line = this.cart.get(foodId);
    if (!line) return;

    if (qty <= 0) {
      this.cart.delete(foodId);
      return;
    }

    line.quantity = qty;
  }

  removeItem(foodId: number): void {
    this.cart.delete(foodId);
  }

  toggleOrderPanel(forceState?: boolean): void {
    this.isOrderPanelOpen = typeof forceState === 'boolean' ? forceState : !this.isOrderPanelOpen;
  }

  createOrder(): void {
    this.saveError = '';
    this.saveSuccess = '';

    if (!this.tableId || this.tableId <= 0) {
      this.saveError = 'Table Id is required.';
      return;
    }

    if (!this.cartLines.length) {
      this.saveError = 'Please add at least one product.';
      return;
    }

    const user = this.authService.user();
    if (!user) {
      this.saveError = 'Please login first.';
      return;
    }

    const orderPayload: OrderModel = {
      Id: 0,
      IsActive: true,
      UserId: user.id,
      OrderStatus: OrderStatusEnum.Pending,
      OrderType: OrderTypeEnum.DineIn,
      OrderDate: new Date().toISOString(),
      Notes: this.notes || null,
    };

    this.isSaving = true;

    this.orderApi
      .insert(orderPayload)
      .pipe(
        switchMap((response) => {
          if (!response.Status || !response.Data?.Id) {
            throw new Error(response.Message || 'Unable to create order.');
          }

          const orderId = response.Data.Id;
          const itemRequests = this.cartLines.map((line) => {
            const item: OrderItemModel = {
              Id: 0,
              IsActive: true,
              OrderId: orderId,
              FoodId: line.food.Id,
              Quantity: line.quantity,
              FoodTableId: this.tableId as number,
              OrderStatus: 1,
              Notes: null,
            };

            return this.orderItemApi.insert(item);
          });

          return itemRequests.length ? forkJoin(itemRequests).pipe(switchMap(() => of(orderId))) : of(orderId);
        }),
        finalize(() => {
          this.isSaving = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (orderId) => {
          this.saveSuccess = `Order #${orderId} saved successfully. Total ₹${this.totalAmount}.`;
          this.cart.clear();
          this.notes = '';
          this.tableId = null;
          this.loadActiveOrders();
        },
        error: (err: Error) => {
          this.saveError = err.message || 'Failed to save order.';
        },
      });
  }

  private loadActiveOrders(): void {
    const request = new DataTableRequest({ filterObj: { IsActive: true, OrderStatus :OrderStatusEnum.Accepted, OrderType :OrderTypeEnum.DineIn }, orderDir: 'desc' });
    this.orderApi.getAll(request).subscribe((response) => {
      if (response.Status) {
        this.activeOrders = response.Data.Data;
      }
      this.cdr.detectChanges();
    });
  }

  private loadProducts(): void {
    forkJoin({
      categories: this.categoryApi.getAll(this.datatable),
      foods: this.foodApi.getAll(this.datatable),
    }).subscribe(({ categories, foods }) => {
      if (categories.Status) {
        this.categories = categories.Data.Data;
      }
      if (foods.Status) {
        this.foods = foods.Data.Data;
      }
      this.groupProducts();
      this.cdr.detectChanges();
    });
  }

  private groupProducts(): void {
    const visibleFoods = this.selectedCategoryId
      ? this.foods.filter((f) => f.FoodCategoryId === this.selectedCategoryId)
      : this.foods;

    const grouped = new Map<number, FoodModel[]>();

    for (const food of visibleFoods) {
      const list = grouped.get(food.FoodCategoryId) ?? [];
      list.push(food);
      grouped.set(food.FoodCategoryId, list);
    }

    this.groupedFoods = Array.from(grouped.entries()).map(([categoryId, items]) => ({
      category: this.categories.find((c) => c.Id === categoryId) ?? null,
      items,
    }));
  }
}
