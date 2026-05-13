import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';

import { BMS_API_BASE_URL } from './api.config';
import { WeatherForecastModel } from '../../models/bms.models';

@Injectable({ providedIn: 'root' })
export class WeatherForecastApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = inject(BMS_API_BASE_URL);

  getAll() {
    return this.http.get<WeatherForecastModel[]>(this.baseUrl.replace(/\/api$/, '/WeatherForecast'));
  }
}
