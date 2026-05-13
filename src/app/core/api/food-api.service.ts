import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequestModel, FoodModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class FoodApiService {
  private readonly api = inject(BmsApiService);

  insert(model: FoodModel) {
    return this.api.insert('Food', model);
  }

  update(model: FoodModel) {
    return this.api.update('Food', model);
  }

  getById(id: number) {
    return this.api.getById('Food', id);
  }

  getAll(request: DataTableRequestModel = {}) {
    return this.api.getAll('Food', request);
  }

  getSingle(request: DataTableRequestModel = {}) {
    return this.api.getSingle('Food', request);
  }
}
