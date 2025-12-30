import { ContainerModule } from 'inversify';
import { TOKENS } from '../../tokens';
import { CustomAuthService } from '../../../services/auth/custom-auth.service';
import { MemoryStorageService } from '../../../services/storage/memory-storage.service';

/**
 * Mock Preset Module
 *
 * For development and testing. Uses in-memory implementations
 * that don't require external services.
 *
 * Services:
 * - Auth: CustomAuthService (mock, no real API calls)
 * - Storage: MemoryStorageService (in-memory, not persisted)
 */
export const MockPresetModule = new ContainerModule((options) => {
  const { bind } = options;

  // Auth service - mock implementation
  bind(TOKENS.Auth.Service).to(CustomAuthService).inSingletonScope();

  // Storage service - in-memory
  bind(TOKENS.Storage.Local).to(MemoryStorageService).inSingletonScope();
});
