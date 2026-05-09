import { Injectable, inject } from '@angular/core';

import { BmsApiService } from './bms-api.service';
import { DataTableRequest, LoginRequestModel, UserModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class UserApiService {
  private readonly api = inject(BmsApiService);

  login(model: LoginRequestModel) {
    return this.api.postAction<LoginRequestModel, UserModel>('User', 'Login', model);
  }

  insert(model: UserModel) {
    return this.api.insert('User', model);
  }

  update(model: UserModel) {
    return this.api.update('User', model);
  }

  getById(id: number) {
    return this.api.getById('User', id);
  }

  getAll(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getAll('User', request);
  }

  getSingle(request: DataTableRequest = new DataTableRequest()) {
    return this.api.getSingle('User', request);
  }
}
