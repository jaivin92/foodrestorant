import { UserTypes } from '../../models/bms.models';

export type AuthRole =
  | 'guest'
  | 'super_admin'
  | 'restaurant_admin'
  | 'manager'
  | 'waiter'
  | 'kitchen'
  | 'cashier'
  | 'customer';

export type LoginRole = Exclude<AuthRole, 'guest'>;

export interface AuthUser {
  readonly id: number;
  readonly name: string;
  readonly email: string;
  readonly mobile: string;
  readonly userType: UserTypes;
  readonly role: LoginRole;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}
