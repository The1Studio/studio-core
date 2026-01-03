/**
 * Container Setup - Create and configure DI container
 *
 * Flow:
 * 1. createContainer() - Create empty container
 * 2. Bind apiClient (from @repo/core)
 * 3. Load CoreModule - All service bindings
 * 4. Load overrides - Optional custom bindings
 * 5. validateContainer() - Ensure required services exist
 *
 * @example
 * import { createApiClient } from '@repo/core';
 * const apiClient = createApiClient({ baseURL, refreshEndpoint });
 * const container = await composeContainer({ apiClient });
 */

import { Container, type ContainerModule } from 'inversify';
import type { AxiosInstance } from 'axios';
import { TOKENS } from './tokens';
import { CoreModule } from './modules/core.module';
import { FirebaseAuthService, type FirebaseAuthInstance } from '../services/auth/firebase-auth.service';

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
const REQUIRED_TOKENS = [
  { token: TOKENS.Auth.Service, name: 'Auth.Service' },
  { token: TOKENS.Http.Client, name: 'Http.Client' },
];

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
  /** Configured axios instance from @repo/core createApiClient() */
  apiClient: AxiosInstance;
  /** Firebase Auth instance - if provided, uses FirebaseAuthService */
  firebaseAuth?: FirebaseAuthInstance;
  /** Optional override module for custom bindings (use rebind to replace) */
  overrides?: ContainerModule;
  /** Skip validation (for testing) */
  skipValidation?: boolean;
}

/**
 * Create and configure container with all services
 *
 * @example
 * import { createApiClient } from '@repo/core';
 *
 * const apiClient = createApiClient({
 *   baseURL: 'https://api.example.com',
 *   refreshEndpoint: '/auth/refresh',
 *   onRefreshFailed: () => navigation.navigate('Login'),
 * });
 *
 * const container = await composeContainer({ apiClient });
 */
export async function composeContainer(
  options: ComposeOptions,
): Promise<Container> {
  const { apiClient, firebaseAuth, overrides, skipValidation = false } = options;

  // 1. Create container
  const container = createContainer();

  // 2. Bind apiClient (from @repo/core)
  container.bind(TOKENS.Http.Client).toConstantValue(apiClient);

  // 3. Load core module (all services)
  container.load(CoreModule);

  // 4. Bind Firebase Auth if provided (replaces default auth service)
  if (firebaseAuth) {
    container.bind(TOKENS.Auth.FirebaseAuth).toConstantValue(firebaseAuth);
    container.unbind(TOKENS.Auth.Service);
    container.bind(TOKENS.Auth.Service).to(FirebaseAuthService).inSingletonScope();
  }

  // 5. Load overrides (optional - use rebind to replace services)
  if (overrides) {
    container.load(overrides);
  }

  // 6. Validate
  if (!skipValidation) {
    assertContainerValid(container);
  }

  return container;
}
