import type { StorageOptions } from './types';

/**
 * Storage service contract
 *
 * Implementations:
 * - AsyncStorageService (Local)
 * - SecureStorageService (Keychain/Keystore)
 *
 * @example
 * const storage = useService<IStorageService>(TOKENS.Storage.Local);
 * await storage.set('user', { name: 'John' });
 * const user = await storage.get<User>('user');
 */
export interface IStorageService {
  /**
   * Get a value by key
   * @returns The value or null if not found/expired
   */
  get<T = unknown>(key: string): Promise<T | null>;

  /**
   * Set a value with optional TTL
   */
  set<T = unknown>(key: string, value: T, options?: StorageOptions): Promise<void>;

  /**
   * Remove a value by key
   */
  remove(key: string): Promise<void>;

  /**
   * Check if a key exists
   */
  has(key: string): Promise<boolean>;

  /**
   * Get all keys
   */
  keys(): Promise<string[]>;

  /**
   * Clear all storage
   */
  clear(): Promise<void>;
}
