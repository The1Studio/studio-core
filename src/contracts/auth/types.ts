/**
 * Authentication Domain Types
 *
 * Core types used across all auth implementations.
 */

/**
 * User login credentials
 */
export interface Credentials {
  email: string;
  password: string;
}

/**
 * Authenticated user data
 */
export interface User {
  /** Unique user identifier */
  id: string;
  /** User email address */
  email: string;
  /** Display name */
  name?: string;
  /** Avatar URL */
  avatar?: string;
}

/**
 * Response from successful authentication
 */
export interface AuthResponse {
  /** Authenticated user data */
  user: User;
  /** JWT access token */
  token: string;
  /** Token for refreshing access */
  refreshToken: string;
}

/**
 * Token pair for token refresh operations
 */
export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}
