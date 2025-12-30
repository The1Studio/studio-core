/**
 * Service Contracts
 *
 * Contracts define WHAT services do (interfaces).
 * Implementations define HOW they do it (classes).
 *
 * Each domain has:
 * - types.ts: Domain-specific types
 * - I{Service}.ts: Service interface
 */

// Auth domain
export * from './auth/types';
export * from './auth/IAuthService';

// Payment domain
export * from './payment/types';
export * from './payment/IPaymentService';

// Storage domain
export * from './storage/types';
export * from './storage/IStorageService';

// Analytics domain
export * from './analytics/types';
export * from './analytics/IAnalyticsService';
