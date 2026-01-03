import { injectable } from 'inversify';
import type {
  IAuthService,
  Credentials,
  RegisterData,
  AuthResponse,
  User,
} from '../../contracts';

/**
 * Default authentication service implementation
 *
 * This is a placeholder implementation. Replace with actual auth logic
 * or use a client-specific implementation (FirebaseAuthService, etc.)
 *
 * @example
 * // In a client module:
 * options.bind(TOKENS.Auth.Service).to(CustomAuthService).inSingletonScope();
 */
@injectable()
export class CustomAuthService implements IAuthService {
  private currentUser: User | null = null;

  async login(credentials: Credentials): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    console.log('[Auth] Login attempt:', credentials.email);

    // Simulate API response
    const user: User = {
      id: 'user-1',
      email: credentials.email,
      name: credentials.email.split('@')[0],
    };

    this.currentUser = user;

    return {
      user,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    // TODO: Replace with actual API call
    console.log('[Auth] Register attempt:', data.email);

    // Simulate API response
    const user: User = {
      id: 'user-new',
      email: data.email,
      name: data.name || data.email.split('@')[0],
    };

    this.currentUser = user;

    return {
      user,
      token: 'mock-jwt-token',
      refreshToken: 'mock-refresh-token',
    };
  }

  async logout(): Promise<void> {
    console.log('[Auth] Logout');
    this.currentUser = null;
  }

  async refreshToken(_token: string): Promise<string> {
    // TODO: Replace with actual token refresh logic
    console.log('[Auth] Refreshing token');
    return 'new-mock-jwt-token';
  }

  async getCurrentUser(): Promise<User | null> {
    return this.currentUser;
  }
}
