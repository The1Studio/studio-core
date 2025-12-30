/**
 * Storage domain types
 */

export interface StorageOptions {
  /** Time-to-live in milliseconds */
  ttl?: number;
  /** Encrypt the value (for secure storage) */
  encrypt?: boolean;
}

export interface StorageItem<T = unknown> {
  key: string;
  value: T;
  expiresAt?: number;
  createdAt: number;
}
