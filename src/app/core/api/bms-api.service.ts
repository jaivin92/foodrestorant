import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BMS_API_BASE_URL } from './api.config';
import {
  ApiResponse,
  BmsEntityMap,
  BmsEntityName,
  DataTableRequestModel,
} from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class BmsApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BMS_API_BASE_URL);

  insert<TEntity extends BmsEntityName>(entity: TEntity, model: BmsEntityMap[TEntity]): Observable<ApiResponse<BmsEntityMap[TEntity]>> {
    return this.http.post<ApiResponse<BmsEntityMap[TEntity]>>(this.url(entity, 'Insert'), model);
  }

  update<TEntity extends BmsEntityName>(entity: TEntity, model: BmsEntityMap[TEntity]): Observable<ApiResponse<BmsEntityMap[TEntity]>> {
    return this.http.put<ApiResponse<BmsEntityMap[TEntity]>>(this.url(entity, 'Update'), model);
  }

  getById<TEntity extends BmsEntityName>(entity: TEntity, id: number): Observable<ApiResponse<BmsEntityMap[TEntity]>> {
    return this.http.get<ApiResponse<BmsEntityMap[TEntity]>>(this.url(entity, `GetById/${id}`));
  }

  getAll<TEntity extends BmsEntityName>(
    entity: TEntity,
    request: DataTableRequestModel = {},
  ): Observable<ApiResponse<BmsEntityMap[TEntity][]>> {
    return this.http.request<ApiResponse<BmsEntityMap[TEntity][]>>('GET', this.url(entity, 'GetAll'), {
      body: request,
    });
  }

  getSingle<TEntity extends BmsEntityName>(
    entity: TEntity,
    request: DataTableRequestModel = {},
  ): Observable<ApiResponse<BmsEntityMap[TEntity]>> {
    return this.http.post<ApiResponse<BmsEntityMap[TEntity]>>(this.url(entity, 'GetSingle'), request);
  }

  private url(entity: BmsEntityName, action: string): string {
    return `${this.baseUrl}/${entity}/${action}`;
  }
}
