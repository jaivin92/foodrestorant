import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequestModel, UserModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly api = inject(BmsApiService);

  insert(model: UserModel) {
    return this.api.insert('User', model);
  }

  update(model: UserModel) {
    return this.api.update('User', model);
  }

  getById(id: number) {
    return this.api.getById('User', id);
  }

  getAll(request: DataTableRequestModel = {}) {
    return this.api.getAll('User', request);
  }

  getSingle(request: DataTableRequestModel = {}) {
    return this.api.getSingle('User', request);
  }
}
