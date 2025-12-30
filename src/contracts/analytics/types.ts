/**
 * Analytics domain types
 */

export interface AnalyticsEvent {
  name: string;
  properties?: Record<string, unknown>;
  timestamp?: number;
}

export interface UserProperties {
  userId?: string;
  email?: string;
  name?: string;
  [key: string]: unknown;
}
