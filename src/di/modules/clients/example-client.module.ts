import { ContainerModule } from 'inversify';
import { TOKENS } from '../../tokens';
import { CustomAuthService } from '../../../services/auth/custom-auth.service';
import { MemoryStorageService } from '../../../services/storage/memory-storage.service';

/**
 * Example Client Module
 *
 * Template for creating client-specific bindings.
 * Copy and customize for each new client.
 */

/**
 * Example client module
 *
 * Demonstrates how to create client-specific bindings.
 * Copy this file and customize for each client.
 *
 * Steps:
 * 1. Create new file: clients/{client-id}.module.ts
 * 2. Import client-specific implementations
 * 3. Use unbind() + bind() to override base bindings
 * 4. Register in client-registry.ts
 *
 * @example
 * // In client-registry.ts:
 * clientRegistry.register('example-client', () =>
 *   import('./clients/example-client.module').then(m => m.ExampleClientModule)
 * );
 */
export const ExampleClientModule = new ContainerModule((options) => {
  const { isBound, unbind, bind } = options;

  // Override Auth service
  // Replace CustomAuthService with FirebaseAuthService, SupabaseAuthService, etc.
  if (isBound(TOKENS.Auth.Service)) {
    unbind(TOKENS.Auth.Service);
  }
  bind(TOKENS.Auth.Service).to(CustomAuthService).inSingletonScope();

  // Override Storage service
  if (isBound(TOKENS.Storage.Local)) {
    unbind(TOKENS.Storage.Local);
  }
  bind(TOKENS.Storage.Local).to(MemoryStorageService).inSingletonScope();

  // Add Payment service (if this client needs it)
  // bind(TOKENS.Payment.Service).to(StripePaymentService).inSingletonScope();

  // Add Analytics service (if this client needs it)
  // bind(TOKENS.Analytics.Service).to(MixpanelAnalyticsService).inSingletonScope();
});
