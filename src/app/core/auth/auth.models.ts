export type AuthRole = 'guest' | 'customer' | 'admin';

export interface AuthUser {
  readonly name: string;
  readonly email: string;
  readonly role: AuthRole;
}

export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
  readonly role: Exclude<AuthRole, 'guest'>;
}
