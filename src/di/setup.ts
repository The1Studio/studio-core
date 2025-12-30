/**
 * Container Setup - Create and configure DI container
 *
 * Flow:
 * 1. createContainer() - Create empty container
 * 2. Load CoreModule - All service bindings
 * 3. Load overrides - Optional custom bindings
 * 4. validateContainer() - Ensure required services exist
 *
 * @example
 * const container = await composeContainer();
 */

import { Container, type ContainerModule } from 'inversify';
import { TOKENS } from './tokens';
import { CoreModule } from './modules/core.module';

// ============================================
// Container Creation
// ============================================

/**
 * Create empty DI container with default settings
 */
export function createContainer(): Container {
  return new Container({ defaultScope: 'Singleton' });
}

// ============================================
// Container Validation
// ============================================

export interface ValidationResult {
  valid: boolean;
  missing: string[];
  errors: string[];
}

/** Services that MUST be bound for app to work */
const REQUIRED_TOKENS = [{ token: TOKENS.Auth.Service, name: 'Auth.Service' }];

/**
 * Check if container has all required services
 */
export function validateContainer(container: Container): ValidationResult {
  const missing: string[] = [];
  const errors: string[] = [];

  for (const { token, name } of REQUIRED_TOKENS) {
    if (!container.isBound(token)) {
      missing.push(name);
    } else {
      try {
        container.get(token);
      } catch (error) {
        errors.push(`${name}: ${(error as Error).message}`);
      }
    }
  }

  return { valid: missing.length === 0 && errors.length === 0, missing, errors };
}

/**
 * Throw if validation fails (use at app startup)
 */
export function assertContainerValid(container: Container): void {
  const result = validateContainer(container);
  if (!result.valid) {
    const messages = [
      ...result.missing.map((s) => `Missing: ${s}`),
      ...result.errors,
    ];
    throw new Error(`Container validation failed:\n${messages.join('\n')}`);
  }
}

// ============================================
// Container Composition (Main Entry Point)
// ============================================

export interface ComposeOptions {
  /** Optional override module for custom bindings (use rebind to replace) */
  overrides?: ContainerModule;
  /** Skip validation (for testing) */
  skipValidation?: boolean;
}

/**
 * Create and configure container with all services
 *
 * @example
 * // Simple - use defaults
 * const container = await composeContainer();
 *
 * // With custom overrides (e.g., Firebase auth)
 * const container = await composeContainer({
 *   overrides: new ContainerModule((opts) => {
 *     opts.rebind(TOKENS.Auth.Service).to(FirebaseAuthService);
 *   })
 * });
 */
export async function composeContainer(
  options: ComposeOptions = {},
): Promise<Container> {
  const { overrides, skipValidation = false } = options;

  // 1. Create container
  const container = createContainer();

  // 2. Load core module (all services)
  container.load(CoreModule);

  // 3. Load overrides (optional - use rebind to replace services)
  if (overrides) {
    container.load(overrides);
  }

  // 4. Validate
  if (!skipValidation) {
    assertContainerValid(container);
  }

  return container;
}
