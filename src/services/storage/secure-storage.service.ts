import { injectable } from 'inversify';
import * as SecureStore from 'expo-secure-store';
import type { IStorageService, StorageOptions, StorageItem } from '../../contracts';

/**
 * Secure storage service using expo-secure-store
 *
 * Uses iOS Keychain and Android Keystore for secure data storage.
 * Ideal for sensitive data: tokens, credentials, API keys.
 *
 * Note: Values are stored as strings. Objects are JSON serialized.
 *
 * @example
 * options.bind(TOKENS.Storage.Secure).to(SecureStorageService).inSingletonScope();
 */
@injectable()
export class SecureStorageService implements IStorageService {
  private readonly META_PREFIX = '__meta_';

  async get<T = unknown>(key: string): Promise<T | null> {
    try {
      // Get metadata to check expiration
      const metaStr = await SecureStore.getItemAsync(this.META_PREFIX + key);
      if (metaStr) {
        const meta = JSON.parse(metaStr) as StorageItem;
        if (meta.expiresAt && Date.now() > meta.expiresAt) {
          await this.remove(key);
          return null;
        }
      }

      const value = await SecureStore.getItemAsync(key);
      if (value === null) {
        return null;
      }

      // Try to parse as JSON, fallback to raw string
      try {
        return JSON.parse(value) as T;
      } catch {
        return value as unknown as T;
      }
    } catch (error) {
      console.error(`[SecureStorage] Error getting key "${key}":`, error);
      return null;
    }
  }

  async set<T = unknown>(
    key: string,
    value: T,
    options?: StorageOptions,
  ): Promise<void> {
    try {
      // Serialize value
      const serialized = typeof value === 'string' ? value : JSON.stringify(value);

      // Save value
      await SecureStore.setItemAsync(key, serialized);

      // Save metadata if TTL is set
      if (options?.ttl) {
        const meta: StorageItem<null> = {
          key,
          value: null,
          createdAt: Date.now(),
          expiresAt: Date.now() + options.ttl,
        };
        await SecureStore.setItemAsync(this.META_PREFIX + key, JSON.stringify(meta));
      }
    } catch (error) {
      console.error(`[SecureStorage] Error setting key "${key}":`, error);
      throw error;
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
      await SecureStore.deleteItemAsync(this.META_PREFIX + key);
    } catch (error) {
      console.warn(`[SecureStorage] Error removing key "${key}":`, error);
    }
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async keys(): Promise<string[]> {
    // expo-secure-store doesn't support listing keys
    // This is a limitation of the secure storage API
    console.warn('[SecureStorage] keys() not supported - secure storage cannot enumerate keys');
    return [];
  }

  async clear(): Promise<void> {
    // expo-secure-store doesn't support clearing all keys
    // This is a security feature - you must know the key to delete it
    console.warn('[SecureStorage] clear() not supported - secure storage requires explicit key deletion');
  }
}
