import { injectable } from 'inversify';
import * as SecureStore from 'expo-secure-store';
import type { IStorageService } from '../../contracts';

/**
 * Secure storage service using expo-secure-store
 *
 * Uses iOS Keychain and Android Keystore for secure data storage.
 * Ideal for sensitive data: tokens, credentials, API keys.
 */
@injectable()
export class SecureStorageService implements IStorageService {
  // String
  async getString(key: string): Promise<string | null> {
    return await SecureStore.getItemAsync(key);
  }

  async setString(key: string, value: string): Promise<void> {
    await SecureStore.setItemAsync(key, value);
  }

  // Object (JSON)
  async getObject<T>(key: string): Promise<T | null> {
    const value = await SecureStore.getItemAsync(key);
    if (value) {
      try {
        return JSON.parse(value) as T;
      } catch {
        return null;
      }
    }
    return null;
  }

  async setObject<T>(key: string, value: T): Promise<void> {
    await SecureStore.setItemAsync(key, JSON.stringify(value));
  }

  // Delete
  async remove(key: string): Promise<void> {
    await SecureStore.deleteItemAsync(key);
  }
}
