/**
 * React Hooks for DI
 *
 * Use these hooks in components to resolve services.
 *
 * @example
 * function LoginScreen() {
 *   const auth = useService<IAuthService>(TOKENS.Auth.Service);
 *   await auth.login({ email, password });
 * }
 */

import { createContext, useContext, useMemo } from 'react';
import type { Container } from 'inversify';

// ============================================
// Context (internal)
// ============================================

interface DIContextValue {
  container: Container;
}

export const DIContext = createContext<DIContextValue | null>(null);

// ============================================
// Hooks
// ============================================

/**
 * Get raw container (advanced use only)
 * @throws Error if outside DIProvider
 */
export function useContainer(): Container {
  const context = useContext(DIContext);
  if (!context) {
    throw new Error('useContainer requires DIProvider');
  }
  return context.container;
}

/**
 * Resolve a service by token
 *
 * @example
 * const auth = useService<IAuthService>(TOKENS.Auth.Service);
 */
export function useService<T>(token: symbol): T {
  const container = useContainer();
  return useMemo(() => container.get<T>(token), [container, token]);
}

/**
 * Resolve multiple services at once
 *
 * @example
 * const { auth, storage } = useServices({
 *   auth: TOKENS.Auth.Service,
 *   storage: TOKENS.Storage.Local,
 * });
 */
export function useServices<T extends Record<string, symbol>>(
  tokens: T
): { [K in keyof T]: unknown } {
  const container = useContainer();

  return useMemo(() => {
    const services = {} as { [K in keyof T]: unknown };
    for (const [key, token] of Object.entries(tokens)) {
      services[key as keyof T] = container.get(token);
    }
    return services;
  }, [container, tokens]);
}
