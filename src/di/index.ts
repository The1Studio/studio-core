/**
 * DI Infrastructure
 *
 * Flow:
 * 1. tokens.ts      - Define service identifiers
 * 2. modules/       - Bind implementations to tokens
 * 3. registry.ts    - Register client modules
 * 4. setup.ts       - Create & compose container
 * 5. react/         - Use in React components
 *
 * @example
 * // App entry
 * const container = await composeContainer({ clientId: 'my-client' });
 *
 * <DIProvider container={container}>
 *   <App />
 * </DIProvider>
 *
 * // In components
 * const auth = useService<IAuthService>(TOKENS.Auth.Service);
 */

// 1. Tokens - Service identifiers
export { TOKENS, type TokenKey } from './tokens';

// 2. Modules - Service bindings
export { BaseModule } from './modules/base.module';

// 3. Registry - Client management
export { clientRegistry } from './registry';

// 4. Setup - Container creation
export {
  createContainer,
  composeContainer,
  validateContainer,
  assertContainerValid,
  type ComposeOptions,
  type ValidationResult,
} from './setup';

// 5. React - Hooks & Components
export {
  DIContext,
  DIProvider,
  DIErrorBoundary,
  useContainer,
  useService,
  useServices,
} from './react';
