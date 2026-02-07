"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/api";
import { useSession } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { ChevronsUpDown, Plus, Check } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";

interface OrganizationWithRole {
  organization: {
    _id: string;
    name: string;
  } | null;
  membershipRole: string;
  joinedAt: number;
}

export function OrgSwitcher() {
  const { isMobile } = useSidebar();
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: session } = useSession();
  const organizations = useQuery(api.organizations.listForUser) as OrganizationWithRole[] | undefined;
  const switchOrg = useMutation(api.organizations.switchOrg);

  // Get active organization ID from session - may be in different places depending on Better Auth version
  const activeOrgId = (session as unknown as { activeOrganizationId?: string })?.activeOrganizationId;
  const activeOrg = organizations?.find(
    (org) => org.organization?._id === activeOrgId
  );

  const handleSwitchOrg = async (organizationId: string) => {
    if (organizationId === activeOrgId || isSwitching) return;

    setIsSwitching(true);
    try {
      await switchOrg({ organizationId: organizationId as never });
      // Navigate to app root after switching
      navigate({ to: "/app" as unknown as "/" });
    } catch (error) {
      console.error("Failed to switch organization:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  if (organizations === undefined) {
    return (
      <div className="flex items-center gap-2 px-2">
        <Skeleton className="size-8 rounded-lg" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  // If no organizations, show fallback
  if (!organizations || organizations.length === 0) {
    return (
      <div className="flex items-center gap-2 px-2 font-semibold">
        <span>No Organization</span>
      </div>
    );
  }

  const orgName = activeOrg?.organization?.name || "Select Organization";
  const orgInitial = orgName.charAt(0).toUpperCase();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild disabled={isSwitching}>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="size-8 rounded-lg">
                <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-sm font-semibold">
                  {orgInitial}
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">{orgName}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4 text-muted-foreground" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
            align="start"
            side={isMobile ? "bottom" : "right"}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-xs text-muted-foreground">
              Organizations
            </DropdownMenuLabel>
            {organizations.map((org: OrganizationWithRole) => {
              const isActive = org.organization?._id === activeOrgId;
              const initial = org.organization?.name?.charAt(0).toUpperCase() || "?";

              return (
                <DropdownMenuItem
                  key={org.organization?._id}
                  onClick={() => org.organization && handleSwitchOrg(org.organization._id)}
                  className="gap-2 p-2"
                  disabled={isSwitching || !org.organization}
                >
                  <Avatar className="size-6 rounded-md">
                    <AvatarFallback className="rounded-md bg-secondary text-secondary-foreground text-xs">
                      {initial}
                    </AvatarFallback>
                  </Avatar>
                  <span className="flex-1">{org.organization?.name}</span>
                  {isActive && <Check className="size-4 text-primary" />}
                </DropdownMenuItem>
              );
            })}
            <DropdownMenuSeparator />
            <DropdownMenuItem className="gap-2 p-2">
              <div className="flex size-6 items-center justify-center rounded-md border bg-background">
                <Plus className="size-4" />
              </div>
              <span>Create organization</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
