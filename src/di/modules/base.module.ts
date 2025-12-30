import { ContainerModule } from 'inversify';
import { TOKENS } from '../tokens';
import { CustomAuthService } from '../../services/auth/custom-auth.service';
import { MemoryStorageService } from '../../services/storage/memory-storage.service';

/**
 * Base Module - Default service bindings
 *
 * Provides fallback implementations.
 * Client modules can override with unbind() + bind().
 */

/**
 * Base module with default service implementations
 *
 * Provides fallback bindings that work out of the box.
 * Client-specific modules can override these with rebind().
 *
 * @example
 * // Container composition
 * container.load(BaseModule);
 * container.load(ClientAModule); // Overrides base bindings
 */
export const BaseModule = new ContainerModule((options) => {
  // Auth: Default implementation
  options.bind(TOKENS.Auth.Service).to(CustomAuthService).inSingletonScope();

  // Storage: In-memory (replace with AsyncStorage in client modules)
  options.bind(TOKENS.Storage.Local).to(MemoryStorageService).inSingletonScope();
});
