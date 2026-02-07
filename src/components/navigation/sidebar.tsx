"use client";

import {
  Sidebar as SidebarPrimitive,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "./sidebar-header";
import { SidebarNav } from "./sidebar-nav";
import { SidebarFooter } from "./sidebar-footer";

interface SidebarProps {
  children?: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  return (
    <SidebarProvider>
      <SidebarPrimitive
        side="left"
        variant="sidebar"
        collapsible="icon"
      >
        <SidebarHeader />
        <SidebarNav />
        <SidebarFooter />
        <SidebarRail />
      </SidebarPrimitive>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}

export { SidebarProvider, SidebarInset, SidebarRail };
