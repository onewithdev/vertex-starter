import { useMatch } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { NavItem } from "@/lib/navigation";

interface UseNavItemResult {
  Icon: LucideIcon;
  isActive: boolean;
}

/**
 * Hook to get navigation item state (icon and active status).
 * Centralizes the logic for route matching and icon resolution.
 */
export function useNavItem(item: NavItem): UseNavItemResult {
  // Use useMatch for type-safe, precise route matching
  // shouldThrow: false returns undefined instead of throwing when route doesn't match
  // For /app, use exact matching (params: {}) so it doesn't stay active on descendant routes
  const match = useMatch({
    from: item.href as "/",
    shouldThrow: false,
    ...(item.href === "/app" ? { params: {} } : {}),
  });
  const isActive = match !== undefined;

  const Icon =
    (Icons as unknown as Record<string, LucideIcon>)[item.icon] ||
    Icons.Circle;

  return { Icon, isActive };
}
