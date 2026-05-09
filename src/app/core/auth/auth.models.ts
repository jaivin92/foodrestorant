export type AuthRole = 'guest' | 'customer' | 'admin' | 'cook' | 'staff' | 'cashier';
export type LoginRole = Exclude<AuthRole, 'guest'>;

export interface AuthUser {
  readonly name: string;
  readonly email: string;
  readonly role: AuthRole;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly role: LoginRole;
}
