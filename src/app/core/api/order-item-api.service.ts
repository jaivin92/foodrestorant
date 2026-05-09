import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequest, OrderItemModel } from '../../models/bms.models';

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

  getAll(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getAll('OrderItem', request);
  }

  getSingle(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getSingle('OrderItem', request);
  }
}
