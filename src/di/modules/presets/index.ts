/**
 * Preset Modules
 *
 * Pre-configured service bindings for common use cases.
 * Client apps can use these directly without manual configuration.
 *
 * Usage:
 * ```typescript
 * const container = await composeContainer({ preset: 'mock' });
 * ```
 *
 * Available presets:
 * - mock: Development/testing with in-memory services
 * - firebase: (coming soon) Firebase Auth + Firestore
 * - supabase: (coming soon) Supabase Auth + Database
 */

export { MockPresetModule } from './mock.module';

// Future presets:
// export { FirebasePresetModule } from './firebase.module';
// export { SupabasePresetModule } from './supabase.module';

import type { ContainerModule } from 'inversify';
import { MockPresetModule } from './mock.module';

/** Available preset names */
export type PresetName = 'mock' | 'firebase' | 'supabase';

/** Preset registry - maps preset names to modules */
export const PRESETS: Record<string, ContainerModule> = {
  mock: MockPresetModule,
  // firebase: FirebasePresetModule,
  // supabase: SupabasePresetModule,
};

/**
 * Get preset module by name
 * @throws Error if preset not found
 */
export function getPreset(name: PresetName): ContainerModule {
  const preset = PRESETS[name];
  if (!preset) {
    const available = Object.keys(PRESETS).join(', ');
    throw new Error(`Unknown preset: "${name}". Available: ${available}`);
  }
  return preset;
}
