/**
 * DI Infrastructure
 *
 * Flow:
 * 1. tokens.ts    - Service identifiers
 * 2. core.module  - All service bindings
 * 3. setup.ts     - Container creation & composition
 * 4. react/       - React hooks & components
 *
 * @example
 * // App entry
 * const container = await composeContainer();
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

// 2. Core Module - All service bindings
export { CoreModule } from './modules/core.module';

// 3. Setup - Container creation
export {
  createContainer,
  composeContainer,
  validateContainer,
  assertContainerValid,
  type ComposeOptions,
  type ValidationResult,
} from './setup';

// 4. React - Hooks & Components
export {
  DIContext,
  DIProvider,
  DIErrorBoundary,
  useContainer,
  useService,
  useServices,
} from './react';
