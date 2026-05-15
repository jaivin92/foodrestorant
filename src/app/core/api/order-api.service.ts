import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequest, OrderModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly api = inject(BmsApiService);

  insert(model: OrderModel) {
    //console.log('Inserting order:', model);
    return this.api.insert('Order', model);
  }

  update(model: OrderModel) {
    return this.api.update('Order', model);
  }

  getById(id: number) {
    return this.api.getById('Order', id);
  }

  getAll(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getAll('Order', request);
  }

  getSingle(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getSingle('Order', request);
  }
}
