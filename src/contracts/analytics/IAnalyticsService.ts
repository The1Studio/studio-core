import type { AnalyticsEvent, UserProperties } from './types';

/**
 * Analytics service contract
 *
 * Implementations:
 * - MixpanelAnalyticsService
 * - FirebaseAnalyticsService
 * - AmplitudeAnalyticsService
 *
 * @example
 * const analytics = useService<IAnalyticsService>(TOKENS.Analytics.Service);
 * analytics.track({ name: 'button_clicked', properties: { button: 'submit' } });
 */
export interface IAnalyticsService {
  /**
   * Track an event
   */
  track(event: AnalyticsEvent): void;

  /**
   * Identify a user
   */
  identify(userId: string, properties?: UserProperties): void;

  /**
   * Reset user identity (on logout)
   */
  reset(): void;

  /**
   * Set user properties
   */
  setUserProperties(properties: UserProperties): void;

  /**
   * Track screen view
   */
  screen(name: string, properties?: Record<string, unknown>): void;
}
