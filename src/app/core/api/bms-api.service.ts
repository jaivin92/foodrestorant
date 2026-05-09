import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { BMS_API_BASE_URL } from './api.config';
import {
  ApiResponse,
  BmsEntityMap,
  BmsEntityName,
  DataTableRequest,
  DataTableResponse,
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
    request: DataTableRequest = new DataTableRequest(),
  ): Observable<ApiResponse<DataTableResponse<BmsEntityMap[TEntity]>>> {
    return this.http.post<ApiResponse<DataTableResponse<BmsEntityMap[TEntity]>>>(this.url(entity, 'GetAll'), request);
  }

  getSingle<TEntity extends BmsEntityName>(
    entity: TEntity,
    request: DataTableRequest = new DataTableRequest(),
  ): Observable<ApiResponse<BmsEntityMap[TEntity]>> {
    return this.http.post<ApiResponse<BmsEntityMap[TEntity]>>(this.url(entity, 'GetSingle'), request);
  }

  postAction<TRequest, TResponse>(entity: BmsEntityName, action: string, request: TRequest): Observable<ApiResponse<TResponse>> {
    return this.http.post<ApiResponse<TResponse>>(this.url(entity, action), request);
  }

  private url(entity: BmsEntityName, action: string): string {
    return `${this.baseUrl}/${entity}/${action}`;
  }
}
