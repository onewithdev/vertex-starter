"use client";

import { Link, useLocation } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mainNavigation, workspaceNavigation, type NavItem } from "@/lib/navigation";
import {
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

interface NavLinkProps {
  item: NavItem;
}

function NavLink({ item }: NavLinkProps) {
  const location = useLocation();
  // Get icon component from lucide-react
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[item.icon] || Icons.Circle;

  // Determine if this nav item is active
  const isActive =
    item.href === location.pathname ||
    (item.href !== "/app" && location.pathname.startsWith(item.href));

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={item.label}
      >
        <Link
          to={item.href as "/"}
          className={cn(
            "flex items-center gap-2",
            isActive
              ? "bg-accent text-accent-foreground"
              : "text-muted-foreground hover:bg-accent"
          )}
        >
          <Icon className="size-4" />
          <span>{item.label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}

export function SidebarNav() {
  const hasWorkspaceItems = workspaceNavigation.length > 0;

  return (
    <SidebarContent>
      <SidebarGroup>
        <SidebarMenu>
          {mainNavigation.map((item) => (
            <NavLink key={item.href} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {hasWorkspaceItems && (
        <>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Workspace
            </SidebarGroupLabel>
            <SidebarMenu>
              {workspaceNavigation.map((item) => (
                <NavLink key={item.href} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </>
      )}
    </SidebarContent>
  );
}
