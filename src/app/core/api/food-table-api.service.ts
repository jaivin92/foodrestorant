import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequest, FoodTableModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class FoodTableApiService {
  private readonly api = inject(BmsApiService);

  insert(model: FoodTableModel) {
    return this.api.insert('FoodTable', model);
  }

  update(model: FoodTableModel) {
    return this.api.update('FoodTable', model);
  }

  getById(id: number) {
    return this.api.getById('FoodTable', id);
  }

  getAll(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getAll('FoodTable', request);
  }

  getSingle(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getSingle('FoodTable', request);
  }
}
