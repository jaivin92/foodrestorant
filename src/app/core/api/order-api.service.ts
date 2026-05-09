import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequestModel, OrderModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class OrderApiService {
  private readonly api = inject(BmsApiService);

  insert(model: OrderModel) {
    return this.api.insert('Order', model);
  }

  update(model: OrderModel) {
    return this.api.update('Order', model);
  }

  getById(id: number) {
    return this.api.getById('Order', id);
  }

  getAll(request: DataTableRequestModel = {}) {
    return this.api.getAll('Order', request);
  }

  getSingle(request: DataTableRequestModel = {}) {
    return this.api.getSingle('Order', request);
  }
}
