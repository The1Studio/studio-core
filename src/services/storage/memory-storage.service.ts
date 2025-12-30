import { injectable } from 'inversify';
import type { IStorageService, StorageOptions, StorageItem } from '../../contracts';

/**
 * In-memory storage service implementation
 *
 * Useful for:
 * - Development/testing
 * - Fallback when AsyncStorage is unavailable
 *
 * Note: Data is lost when app restarts.
 * Use AsyncStorageService for persistence.
 *
 * @example
 * options.bind(TOKENS.Storage.Local).to(MemoryStorageService).inSingletonScope();
 */
@injectable()
export class MemoryStorageService implements IStorageService {
  private store = new Map<string, StorageItem>();

  async get<T = unknown>(key: string): Promise<T | null> {
    const item = this.store.get(key);

    if (!item) {
      return null;
    }

    // Check expiration
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }

    return item.value as T;
  }

  async set<T = unknown>(
    key: string,
    value: T,
    options?: StorageOptions,
  ): Promise<void> {
    const item: StorageItem<T> = {
      key,
      value,
      createdAt: Date.now(),
      expiresAt: options?.ttl ? Date.now() + options.ttl : undefined,
    };

    this.store.set(key, item);
  }

  async remove(key: string): Promise<void> {
    this.store.delete(key);
  }

  async has(key: string): Promise<boolean> {
    const value = await this.get(key);
    return value !== null;
  }

  async keys(): Promise<string[]> {
    return Array.from(this.store.keys());
  }

  async clear(): Promise<void> {
    this.store.clear();
  }
}
