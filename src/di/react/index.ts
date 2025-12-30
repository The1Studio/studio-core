/**
 * React Integration for DI
 *
 * 1. <DIProvider> - Provide container to tree
 * 2. <DIErrorBoundary> - Catch resolution errors
 * 3. useService() - Resolve services in components
 */

// Hooks
export { DIContext, useContainer, useService, useServices } from './hooks';

// Components
export { DIProvider, DIErrorBoundary } from './provider';
