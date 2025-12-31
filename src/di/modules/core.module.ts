import { ContainerModule } from 'inversify';
import { TOKENS } from '../tokens';
import { CustomAuthService } from '../../services/auth/custom-auth.service';
import { SecureStorageService } from '../../services/storage/secure-storage.service';
import { UserService } from '../../services/user/user.service';

/**
 * Core Module - Binds all core services
 *
 * Services:
 * - Auth.Service: CustomAuthService (mock implementation)
 * - Storage.Secure: SecureStorageService (expo-secure-store)
 * - User.Service: UserService (CRUD with apiClient)
 *
 * Note: Http.Client (AxiosInstance) must be provided via composeContainer options.
 *
 * @example
 * const container = await composeContainer({
 *   apiClient: createApiClient({ baseURL: 'https://api.example.com', ... }),
 * });
 */
export const CoreModule = new ContainerModule((options) => {
  const { bind } = options;

  // Auth
  bind(TOKENS.Auth.Service).to(CustomAuthService).inSingletonScope();

  // Storage
  bind(TOKENS.Storage.Secure).to(SecureStorageService).inSingletonScope();

  // User
  bind(TOKENS.User.Service).to(UserService).inSingletonScope();
});
