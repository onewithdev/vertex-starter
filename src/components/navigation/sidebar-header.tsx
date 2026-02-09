"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/api";
import { useFeature } from "@/hooks/use-app-config";
import { SidebarHeader as SidebarHeaderPrimitive } from "@/components/ui/sidebar";
import { OrgSwitcher } from "./org-switcher";
import { appConfig } from "@/config/app.config";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarHeader() {
  const multiTenant = useFeature("multiTenant");
  const organization = useQuery(api.organizations.getCurrent);

  return (
    <SidebarHeaderPrimitive>
      <div className="flex h-14 items-center border-b px-4">
        {multiTenant ? (
          <OrgSwitcher />
        ) : (
          <div className="flex items-center gap-2 font-semibold">
            {organization === undefined ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <span>{organization?.name || appConfig.identity.name}</span>
            )}
          </div>
        )}
      </div>
    </SidebarHeaderPrimitive>
  );
}
