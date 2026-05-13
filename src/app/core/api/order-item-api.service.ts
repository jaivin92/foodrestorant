import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequestModel, OrderItemModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class OrderItemApiService {
  private readonly api = inject(BmsApiService);

  insert(model: OrderItemModel) {
    return this.api.insert('OrderItem', model);
  }

  update(model: OrderItemModel) {
    return this.api.update('OrderItem', model);
  }

  getById(id: number) {
    return this.api.getById('OrderItem', id);
  }

  getAll(request: DataTableRequestModel = {}) {
    return this.api.getAll('OrderItem', request);
  }

  getSingle(request: DataTableRequestModel = {}) {
    return this.api.getSingle('OrderItem', request);
  }
}
