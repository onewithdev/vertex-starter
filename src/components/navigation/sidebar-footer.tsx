"use client";

import { useQuery } from "convex/react";
import { api } from "@/convex/api";
import { SidebarFooter as SidebarFooterPrimitive } from "@/components/ui/sidebar";
import { UserMenu } from "./user-menu";
import { Skeleton } from "@/components/ui/skeleton";

export function SidebarFooter() {
  const userData = useQuery(api.users.getCurrentWithOrg);

  return (
    <SidebarFooterPrimitive>
      <div className="border-t p-4">
        {userData === undefined ? (
          <div className="flex items-center gap-3">
            <Skeleton className="size-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ) : (
          <UserMenu user={userData?.user || null} />
        )}
      </div>
    </SidebarFooterPrimitive>
  );
}
