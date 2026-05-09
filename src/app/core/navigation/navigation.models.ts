import { AuthRole } from '../auth/auth.models';

export interface NavigationItem {
  readonly label: string;
  readonly route: string;
  readonly description: string;
  readonly roles: readonly AuthRole[];
  readonly badge?: string;
}
