import { ContainerModule } from 'inversify';
import { TOKENS } from '../tokens';
import { CustomAuthService } from '../../services/auth/custom-auth.service';
import { SecureStorageService } from '../../services/storage/secure-storage.service';

/**
 * Core Module - Binds all core services
 *
 * Services:
 * - Auth.Service: CustomAuthService (mock implementation)
 * - Storage.Secure: SecureStorageService (expo-secure-store)
 *
 * Client can override any binding via overrides module:
 * @example
 * const container = await composeContainer({
 *   overrides: new ContainerModule((opts) => {
 *     opts.rebind(TOKENS.Auth.Service).to(FirebaseAuthService);
 *   })
 * });
 */
export const CoreModule = new ContainerModule((options) => {
  const { bind } = options;

  // Auth
  bind(TOKENS.Auth.Service).to(CustomAuthService).inSingletonScope();

  // Storage
  bind(TOKENS.Storage.Secure).to(SecureStorageService).inSingletonScope();
});
