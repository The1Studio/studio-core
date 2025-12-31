/**
 * Storage service contract
 *
 * Implementations:
 * - AsyncStorageService (Local)
 * - SecureStorageService (Keychain/Keystore)
 *
 * @example
 * const storage = useService<IStorageService>(TOKENS.Storage.Secure);
 * await storage.setString('token', 'abc123');
 * const token = await storage.getString('token');
 */
export interface IStorageService {
  // String
  getString(key: string): Promise<string | null>;
  setString(key: string, value: string): Promise<void>;

  // Object (JSON)
  getObject<T>(key: string): Promise<T | null>;
  setObject<T>(key: string, value: T): Promise<void>;

  // Delete
  remove(key: string): Promise<void>;
}
