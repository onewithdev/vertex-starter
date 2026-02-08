/**
 * Navigation configuration
 * Define all navigation items here with feature flag filtering
 */

import { appConfig } from '@/config/app.config';
import type { FeatureFlagKey } from '@/config/app.config';

export interface NavItem {
  label: string;
  href: string;
  icon: string;
  feature?: FeatureFlagKey;
  children?: NavItem[];
}

function isFeatureEnabled(feature: FeatureFlagKey): boolean {
  return appConfig.features[feature];
}

/**
 * Main navigation items shown in the sidebar
 */
const mainNavItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/app',
    icon: 'Home',
  },
  {
    label: 'Projects',
    href: '/app/projects',
    icon: 'Folder',
    feature: 'projects',
  },
  {
    label: 'Tasks',
    href: '/app/tasks',
    icon: 'CheckSquare',
    feature: 'tasks',
  },
];

export const mainNavigation: NavItem[] = mainNavItems.filter(
  (item) => !item.feature || isFeatureEnabled(item.feature)
);

/**
 * Workspace/admin navigation items
 */
const workspaceNavItems: NavItem[] = [
  {
    label: 'Members',
    href: '/app/members',
    icon: 'Users',
    feature: 'multiTenant',
  },
  {
    label: 'Billing',
    href: '/app/billing',
    icon: 'CreditCard',
    feature: 'billing',
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: 'Settings',
  },
];

export const workspaceNavigation: NavItem[] = workspaceNavItems.filter(
  (item) => !item.feature || isFeatureEnabled(item.feature)
);

/**
 * User menu navigation items
 */
export const userNavigation: NavItem[] = [
  {
    label: 'Profile',
    href: '/settings',
    icon: 'User',
  },
  {
    label: 'Sign out',
    href: '/auth/login',
    icon: 'LogOut',
  },
];
