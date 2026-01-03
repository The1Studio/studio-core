import type { Credentials, RegisterData, AuthResponse, User } from './types';

/**
 * Authentication Service Contract
 *
 * Defines the interface for all authentication implementations.
 * Each client can bind a different implementation (Firebase, Supabase, custom API).
 *
 * Implementations:
 * - CustomAuthService (default placeholder)
 * - FirebaseAuthService
 * - SupabaseAuthService
 *
 * @example
 * // Resolve in components
 * const authService = useService<IAuthService>(TOKENS.Auth.Service);
 * await authService.login({ email, password });
 *
 * // Bind in client module
 * options.bind(TOKENS.Auth.Service).to(FirebaseAuthService).inSingletonScope();
 */
export interface IAuthService {
  /**
   * Authenticate user with email/password
   * @throws Error if authentication fails
   */
  login(credentials: Credentials): Promise<AuthResponse>;

  /**
   * Register new user with email/password
   * @throws Error if registration fails
   */
  register(data: RegisterData): Promise<AuthResponse>;

  /**
   * Sign out current user and clear tokens
   */
  logout(): Promise<void>;

  /**
   * Refresh access token using refresh token
   * @param token - Current refresh token
   * @returns New access token
   */
  refreshToken(token: string): Promise<string>;

  /**
   * Get currently authenticated user
   * @returns User data or null if not authenticated
   */
  getCurrentUser(): Promise<User | null>;
}
