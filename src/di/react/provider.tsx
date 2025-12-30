/**
 * React Provider & Error Boundary for DI
 *
 * @example
 * <DIErrorBoundary>
 *   <DIProvider container={container}>
 *     <App />
 *   </DIProvider>
 * </DIErrorBoundary>
 */

import React, {
  Component,
  useMemo,
  type ErrorInfo,
  type ReactNode,
} from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { Container } from 'inversify';
import { DIContext } from './hooks';

// ============================================
// DIProvider
// ============================================

interface DIProviderProps {
  container: Container;
  children: ReactNode;
}

/**
 * Provides DI container to React tree
 *
 * Place at app root after composing container.
 */
export function DIProvider({ container, children }: DIProviderProps) {
  const value = useMemo(() => ({ container }), [container]);
  return <DIContext.Provider value={value}>{children}</DIContext.Provider>;
}

// ============================================
// DIErrorBoundary
// ============================================

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Catches DI-related errors (missing services, etc.)
 */
export class DIErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[DI Error]', error, errorInfo);
    this.props.onError?.(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <View style={styles.container}>
            <Text style={styles.title}>Service Error</Text>
            <Text style={styles.message}>{this.state.error?.message}</Text>
          </View>
        )
      );
    }
    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#dc2626', marginBottom: 8 },
  message: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
});
