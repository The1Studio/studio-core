/**
 * DI Tokens - Unique identifiers for services
 *
 * Tokens connect contracts (interfaces) to implementations.
 * Pattern: TOKENS.{Domain}.{Role}
 *
 * @example
 * // In component - resolve service
 * const auth = useService<IAuthService>(TOKENS.Auth.Service);
 *
 * // In module - bind implementation
 * bind(TOKENS.Auth.Service).to(FirebaseAuthService);
 */
export const TOKENS = {
  /** Authentication: login, logout, token refresh */
  Auth: {
    Service: Symbol.for('Auth.Service'),
    TokenManager: Symbol.for('Auth.TokenManager'),
  },

  /** Payments: processing, gateways */
  Payment: {
    Service: Symbol.for('Payment.Service'),
    Gateway: Symbol.for('Payment.Gateway'),
  },

  /** Storage: local, secure, remote */
  Storage: {
    Local: Symbol.for('Storage.Local'),
    Secure: Symbol.for('Storage.Secure'),
    Remote: Symbol.for('Storage.Remote'),
  },

  /** Analytics: event tracking */
  Analytics: {
    Service: Symbol.for('Analytics.Service'),
  },
} as const;

export type TokenKey = typeof TOKENS;
