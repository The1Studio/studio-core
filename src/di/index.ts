/**
 * DI Infrastructure
 *
 * Flow:
 * 1. tokens.ts         - Service identifiers
 * 2. modules/presets/  - Pre-configured service bindings
 * 3. setup.ts          - Container creation & composition
 * 4. react/            - React hooks & components
 *
 * @example
 * // App entry - just use a preset
 * const container = await composeContainer({ preset: 'mock' });
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

// 2. Presets - Pre-configured modules
export { MockPresetModule, type PresetName } from './modules/presets';

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
