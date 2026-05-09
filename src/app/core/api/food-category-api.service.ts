import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequestModel, FoodCategoryModel } from '../../models/bms.models';

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

  getAll(request: DataTableRequestModel = {}) {
    return this.api.getAll('FoodCategory', request);
  }

  getSingle(request: DataTableRequestModel = {}) {
    return this.api.getSingle('FoodCategory', request);
  }
}
