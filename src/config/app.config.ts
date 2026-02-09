/**
 * Application configuration
 * Centralized config for feature flags, layout settings, and auth providers
 */

export interface FeatureFlags {
  multiTenant: boolean;
  allowPersonalAccounts: boolean;
  billing: boolean;
  invitations: boolean;
  rbac: boolean;
  projects: boolean;
  tasks: boolean;
}

export interface AuthConfig {
  enabled: boolean;
  providers: string[];
  allowEmailPassword: boolean;
  requireEmailVerification: boolean;
}

export interface LayoutConfig {
  mode: 'sidebar' | 'topnav';
  sidebarCollapsible: boolean;
  showBreadcrumbs: boolean;
}

export interface AppIdentity {
  name: string;
  description: string;
}

export interface AppConfig {
  identity: AppIdentity;
  layout: LayoutConfig;
  features: FeatureFlags;
  auth: AuthConfig;
}

export const appConfig: AppConfig = {
  identity: {
    name: 'Vertex Stack',
    description: 'Multi-tenant project management platform',
  },
  layout: {
    mode: 'sidebar',
    sidebarCollapsible: true,
    showBreadcrumbs: true,
  },
  features: {
    multiTenant: true,
    allowPersonalAccounts: false,
    billing: false,
    invitations: true,
    rbac: true,
    projects: true,
    tasks: true,
  },
  auth: {
    enabled: true,
    providers: ['github'],
    allowEmailPassword: true,
    requireEmailVerification: false, // Set to true in production
  },
} as const;

export type FeatureFlagKey = keyof FeatureFlags;
