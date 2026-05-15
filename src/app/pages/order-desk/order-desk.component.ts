import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';

import { FoodApiService, FoodCategoryApiService, OrderApiService } from 'src/app/core/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DataTableRequest, FoodCategoryModel, FoodModel, OrderItemModel, OrderItemStatusEnum, OrderModel, OrderStatus, OrderStatusEnum, OrderTypeEnum } from 'src/app/models';

interface CartLine {
  food: FoodModel;
  quantity: number;
  notes: string;
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
  private readonly authService = inject(AuthService);

  readonly datatable = new DataTableRequest({ filterObj: { IsActive: true } });

  foods: FoodModel[] = [];
  categories: FoodCategoryModel[] = [];
  groupedFoods: Array<{ category: FoodCategoryModel | null; items: FoodModel[] }> = [];
  selectedCategoryId: number | null = null;

  tableId: number | null = null;
  customerName = '';
  notes = '';
  diningType: 'DineIn' | 'TakeAway' | 'Delivery' = 'DineIn';
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

  get occupiedTableOrders(): OrderModel[] {
    return this.activeOrders.filter((order) => typeof order.FoodTableId === 'number' && order.FoodTableId > 0);
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
      this.cart.set(food.Id!!, { food, quantity: 1, notes: '' });
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

  openOccupiedTable(order: OrderModel): void {
    if (!order.FoodTableId || order.FoodTableId <= 0) {
      return;
    }

    this.isOrderPanelOpen = true;
    this.diningType = 'DineIn';
    this.tableId = order.FoodTableId;
    this.customerName = order.CustomerName ?? '';
    this.saveError = '';
    this.saveSuccess = '';
  }

  createOrder(): void {
    this.saveError = '';
    this.saveSuccess = '';

    if (this.isDineIn && (!this.tableId || this.tableId <= 0)) {
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
      OrderStatus: OrderStatusEnum.Accepted,
      OrderType: this.orderTypeValue,
      OrderDate: new Date().toISOString(),
      Notes: this.orderNotes || null,
      FoodTableId: this.isDineIn ? (this.tableId as number) : 0,
      CustomerId: 0,
      CustomerName: this.orderCustomerName,
      OrderItemModels: this.cartLines.map((line) => ({
        Id: 0,
        IsActive: true,
        OrderId: 0,
        FoodId: line.food.Id,
        Quantity: line.quantity,
        FoodTableId: this.isDineIn ? (this.tableId as number) : 0,
        OrderItemStatus: OrderItemStatusEnum.Preparing,
        Notes: line.notes || null,
      })),
    };

    this.isSaving = true;

    this.orderApi
      .insert(orderPayload)
      .pipe(finalize(() => {
        this.isSaving = false;
        this.cdr.detectChanges();
      }))
      .subscribe({
        next: (response) => {
          if (!response.Status || !response.Data?.Id) {
            this.saveError = response.Message || 'Unable to create order.';
            return;
          }
          const orderId = response.Data.Id;
          this.saveSuccess = `Order #${orderId} saved successfully. Total ₹${this.totalAmount}.`;
          this.cart.clear();
          this.notes = '';
          this.customerName = '';
          this.diningType = 'DineIn';
          this.tableId = null;
          this.loadActiveOrders();
        },
        error: (err: Error) => {
          this.saveError = err.message || 'Failed to save order.';
        },
      });
  }

  get isDineIn(): boolean {
    return this.diningType === 'DineIn';
  }

  get orderTypeValue(): OrderTypeEnum {
    if (this.diningType === 'TakeAway') return OrderTypeEnum.TakeAway;
    if (this.diningType === 'Delivery') return OrderTypeEnum.Delivery;
    return OrderTypeEnum.DineIn;
  }

  get orderNotes(): string {
    const values = [this.customerName?.trim(), this.notes?.trim()].filter(Boolean);
    return values.join(' | ');
  }

  get orderCustomerName(): string {
    if (this.customerName?.trim()) return this.customerName.trim();
    return this.isDineIn && this.tableId ? `Table ${this.tableId}` : '';
  }

  private loadActiveOrders(): void {
    const request = new DataTableRequest({ filterObj: { IsActive: true, OrderStatus: OrderStatusEnum.Accepted, OrderType: OrderTypeEnum.DineIn }, orderDir: 'desc' });
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
