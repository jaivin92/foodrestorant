import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { FoodApiService, FoodCategoryApiService } from 'src/app/core/api';
import { OrderCartService } from 'src/app/core/order-cart.service';
import { DataTableRequest, FoodCategoryModel, FoodModel } from 'src/app/models';

@Component({
  selector: 'app-menu',
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  public changeDetectorRef = inject(ChangeDetectorRef);
  public foodService = inject(FoodApiService);
  public foodCategoryService = inject(FoodCategoryApiService);
  public orderCart = inject(OrderCartService);

  foods: FoodModel[] = [];
  categories: FoodCategoryModel[] = [];
  groupedFoods: Array<{ category: FoodCategoryModel | null; items: FoodModel[] }> = [];

  datatable: DataTableRequest = new DataTableRequest();
  selectedCategoryId: number | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.datatable.filterObj = { IsActive: true };

    this.foodCategoryService.getAll(this.datatable).subscribe((categoryResult) => {
      if (categoryResult.Status) {
        this.categories = categoryResult.Data.Data;
      }

      this.foodService.getAll(this.datatable).subscribe((foodResult) => {
        if (foodResult.Status) {
          this.foods = foodResult.Data.Data;
        }

        this.buildGroups();
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  addToOrder(food: FoodModel): void {
    this.orderCart.add(food);
  }

  setCategory(categoryId: number | null): void {
    this.selectedCategoryId = categoryId;
    this.buildGroups();
  }

  private buildGroups(): void {
    const visibleFoods = this.selectedCategoryId
      ? this.foods.filter((food) => food.FoodCategoryId === this.selectedCategoryId)
      : this.foods;

    const byCategory = new Map<number, FoodModel[]>();

    for (const food of visibleFoods) {
      const list = byCategory.get(food.FoodCategoryId) ?? [];
      list.push(food);
      byCategory.set(food.FoodCategoryId, list);
    }

    this.groupedFoods = Array.from(byCategory.entries()).map(([categoryId, items]) => ({
      category: this.categories.find((category) => category.Id === categoryId) ?? null,
      items,
    }));
  }
}
