import { InjectionToken } from '@angular/core';

export const BMS_API_BASE_URL = new InjectionToken<string>('BMS_API_BASE_URL', {
  providedIn: 'root',
  factory: () => 'https://localhost:7247/api',
});
