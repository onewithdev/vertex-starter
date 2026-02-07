/**
 * Hooks for accessing app configuration
 * Provides typed access to feature flags and app settings
 */

import { useMemo } from 'react';
import { appConfig, type AppConfig, type FeatureFlags, type FeatureFlagKey } from '@/config/app.config';

/**
 * Get the full app configuration object
 */
export function useAppConfig(): AppConfig {
  return useMemo(() => appConfig, []);
}

/**
 * Get just the features object from config
 */
export function useFeatures(): FeatureFlags {
  return useMemo(() => appConfig.features, []);
}

/**
 * Get a specific feature flag value with type safety
 */
export function useFeature<K extends FeatureFlagKey>(feature: K): FeatureFlags[K] {
  return useMemo(() => appConfig.features[feature], [feature]);
}
