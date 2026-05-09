import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequest, FoodCategoryModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class FoodCategoryApiService {
  private readonly api = inject(BmsApiService);

  insert(model: FoodCategoryModel) {
    return this.api.insert('FoodCategory', model);
  }

  update(model: FoodCategoryModel) {
    return this.api.update('FoodCategory', model);
  }

  getById(id: number) {
    return this.api.getById('FoodCategory', id);
  }

  getAll(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getAll('FoodCategory', request);
  }

  getSingle(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getSingle('FoodCategory', request);
  }
}
