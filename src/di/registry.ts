/**
 * Client Registry - Register client modules for lazy loading
 *
 * Each client gets its own module with specific service bindings.
 * Only the selected client's module is loaded (tree-shaking friendly).
 *
 * @example
 * // Register a client
 * clientRegistry.register('my-client', () =>
 *   import('./modules/clients/my-client.module').then(m => m.MyClientModule)
 * );
 *
 * // Select client via env var
 * EXPO_PUBLIC_CLIENT_ID=my-client expo start
 */

import type { ContainerModule } from 'inversify';

type ClientModuleLoader = () => Promise<ContainerModule>;

class ClientModuleRegistry {
  private registry = new Map<string, ClientModuleLoader>();

  /** Register a client module (use dynamic import for lazy loading) */
  register(clientId: string, loader: ClientModuleLoader): void {
    this.registry.set(clientId, loader);
  }

  /** Load client module by ID */
  async load(clientId: string): Promise<ContainerModule | null> {
    const loader = this.registry.get(clientId);
    if (!loader) {
      console.warn(`[DI] No module for client: ${clientId}`);
      return null;
    }
    return loader();
  }

  /** Check if client exists */
  has(clientId: string): boolean {
    return this.registry.has(clientId);
  }

  /** List all client IDs */
  list(): string[] {
    return Array.from(this.registry.keys());
  }
}

export const clientRegistry = new ClientModuleRegistry();

// ============================================
// REGISTER CLIENTS HERE
// ============================================

// Example client (development/testing)
clientRegistry.register('example-client', () =>
  import('./modules/clients/example-client.module').then(
    (m) => m.ExampleClientModule,
  ),
);

// Add more clients:
// clientRegistry.register('client-a', () =>
//   import('./modules/clients/client-a.module').then(m => m.ClientAModule)
// );
