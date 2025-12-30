/**
 * @studio/core
 *
 * DI infrastructure for React Native applications.
 *
 * Quick Start:
 * 1. Import this package first (loads reflect-metadata)
 * 2. Compose container
 * 3. Wrap app with DIProvider
 * 4. Use useService() in components
 *
 * @example
 * import '@studio/core';
 * import { composeContainer, DIProvider, useService, TOKENS, type IAuthService } from '@studio/core';
 *
 * const container = await composeContainer();
 * <DIProvider container={container}><App /></DIProvider>
 *
 * // In components:
 * const auth = useService<IAuthService>(TOKENS.Auth.Service);
 */

// MUST be imported first - enables decorator metadata
import 'reflect-metadata';

// ============================================
// DI Infrastructure
// ============================================
export * from './di';

// ============================================
// Contracts (Interfaces)
// ============================================
export * from './contracts';

// ============================================
// Service Implementations
// ============================================
export * from './services';
