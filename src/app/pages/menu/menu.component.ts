import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize, forkJoin, of, switchMap } from 'rxjs';

import { FoodApiService, FoodCategoryApiService, OrderApiService, OrderItemApiService } from 'src/app/core/api';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DataTableRequest, FoodCategoryModel, FoodModel, OrderModel, OrderStatus } from 'src/app/models';

interface CartLine {
  food: FoodModel;
  quantity: number;
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  public changeDetectorRef = inject(ChangeDetectorRef);
  public foodService = inject(FoodApiService);
  public foodCategoryService = inject(FoodCategoryApiService);
  public orderService = inject(OrderApiService);
  public orderItemService = inject(OrderItemApiService);
  public authService = inject(AuthService);

  foods: FoodModel[] = [];
  categories: FoodCategoryModel[] = [];
  groupedFoods: Array<{ category: FoodCategoryModel | null; items: FoodModel[] }> = [];

  datatable: DataTableRequest = new DataTableRequest();
  selectedCategoryId: number | null = null;
  tableId: number | null = null;
  isSubmitting = false;
  orderMessage = '';
  orderError = '';

  private readonly cart = new Map<number, CartLine>();

  ngOnInit(): void {
    this.loadData();
  }

  get cartItems(): CartLine[] {
    return Array.from(this.cart.values());
  }

  get cartTotal(): number {
    return this.cartItems.reduce((sum, line) => sum + (line.food.Price || 0) * line.quantity, 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, line) => sum + line.quantity, 0);
  }

  loadData() {
    this.datatable.filterObj = { IsActive: true };

    forkJoin({
      foods: this.foodService.getAll(this.datatable),
      categories: this.foodCategoryService.getAll(this.datatable),
    }).subscribe(({ foods, categories }) => {
      if (foods.Status) {
        this.foods = foods.Data.Data;
      }

      if (categories.Status) {
        this.categories = categories.Data.Data;
      }

      this.buildGroups();
      this.changeDetectorRef.detectChanges();
    });
  }

  setCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.buildGroups();
  }

  addToCart(food: FoodModel): void {
    const existing = this.cart.get(food.Id);
    if (existing) {
      existing.quantity += 1;
    } else {
      this.cart.set(food.Id, { food, quantity: 1 });
    }
  }

  updateQuantity(foodId: number, nextQuantity: number): void {
    const line = this.cart.get(foodId);
    if (!line) return;

    if (nextQuantity <= 0) {
      this.cart.delete(foodId);
      return;
    }

    line.quantity = nextQuantity;
  }

  placeOrder(): void {
    this.orderMessage = '';
    this.orderError = '';

    if (!this.tableId || this.tableId <= 0) {
      this.orderError = 'Please enter a valid table id.';
      return;
    }

    if (!this.cartItems.length) {
      this.orderError = 'Please add at least one product before placing an order.';
      return;
    }

    const currentUser = this.authService.user();
    if (!currentUser) {
      this.orderError = 'User not authenticated.';
      return;
    }

    const orderPayload: OrderModel = {
      Id: 0,
      IsActive: true,
      UserId: currentUser.id,
      OrderStatus: 'Pending' as OrderStatus,
      OrderType: 'DineIn',
      OrderDate: new Date().toISOString(),
      Notes: `Table ${this.tableId}`,
    };

    this.isSubmitting = true;

    this.orderService
      .insert(orderPayload)
      .pipe(
        switchMap((response) => {
          if (!response.Status || !response.Data?.Id) {
            throw new Error(response.Message || 'Failed to create order.');
          }

          const orderId = response.Data.Id;
          const itemRequests = this.cartItems.map((line) =>
            this.orderItemService.insert({
              Id: 0,
              IsActive: true,
              OrderId: orderId,
              FoodId: line.food.Id,
              Quantity: line.quantity,
              FoodTableId: this.tableId as number,
              OrderStatus: 'Pending',
              Notes: null,
            }),
          );

          return itemRequests.length ? forkJoin(itemRequests) : of([]);
        }),
        finalize(() => (this.isSubmitting = false)),
      )
      .subscribe({
        next: () => {
          this.cart.clear();
          this.orderMessage = `Order placed successfully for table ${this.tableId}.`;
          this.tableId = null;
        },
        error: (error: Error) => {
          this.orderError = error.message || 'Failed to place order.';
        },
      });
  }

  private buildGroups(): void {
    const foods = this.selectedCategoryId
      ? this.foods.filter((food) => food.FoodCategoryId === this.selectedCategoryId)
      : this.foods;

    const byCategory = new Map<number, FoodModel[]>();

    for (const food of foods) {
      const bucket = byCategory.get(food.FoodCategoryId) ?? [];
      bucket.push(food);
      byCategory.set(food.FoodCategoryId, bucket);
    }

    this.groupedFoods = Array.from(byCategory.entries()).map(([categoryId, items]) => ({
      category: this.categories.find((category) => category.Id === categoryId) ?? null,
      items,
    }));
  }
}
