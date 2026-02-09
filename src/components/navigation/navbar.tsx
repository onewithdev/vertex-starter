"use client";

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import { mainNavigation, workspaceNavigation, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { useNavItem } from "@/hooks/use-nav-item";
import { Logo } from "@/components/shared/logo";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/api";
import { signOut, useSession } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { appConfig } from "@/config/app.config";
import { ChevronsUpDown, Plus, Check, Building2, Menu } from "lucide-react";

interface OrganizationWithRole {
  organization: {
    _id: string;
    name: string;
  } | null;
  membershipRole: string;
  joinedAt: number;
}

interface NavLinkProps {
  item: NavItem;
}

function NavLink({ item }: NavLinkProps) {
  const { Icon, isActive } = useNavItem(item);

  return (
    <Link
      to={item.href as "/"}
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors",
        isActive
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
      )}
    >
      <Icon className="size-4" />
      <span>{item.label}</span>
    </Link>
  );
}

function MobileNavItem({ item }: NavLinkProps) {
  const { Icon, isActive } = useNavItem(item);

  return (
    <DropdownMenuItem asChild>
      <Link 
        to={item.href as "/"} 
        className={cn(
          "flex items-center gap-2 cursor-pointer",
          isActive && "bg-accent"
        )}
      >
        <Icon className={cn("size-4", isActive && "text-primary")} />
        <span className="flex-1">{item.label}</span>
        {isActive && <Icons.Check className="size-4 text-primary" />}
      </Link>
    </DropdownMenuItem>
  );
}

function NavbarOrgSwitcher() {
  const navigate = useNavigate();
  const [isSwitching, setIsSwitching] = useState(false);

  const { data: session } = useSession();
  const organizations = useQuery(api.organizations.listForUser) as OrganizationWithRole[] | undefined;
  const switchOrg = useMutation(api.organizations.switchOrg);

  // Get active organization ID from session
  const activeOrgId = (session as unknown as { activeOrganizationId?: string })?.activeOrganizationId;
  const activeOrg = organizations?.find(
    (org) => org.organization?._id === activeOrgId
  );

  const handleSwitchOrg = async (organizationId: string) => {
    if (organizationId === activeOrgId || isSwitching) return;

    setIsSwitching(true);
    try {
      await switchOrg({ organizationId: organizationId as never });
      navigate({ to: "/app" as unknown as "/" });
    } catch (error) {
      console.error("Failed to switch organization:", error);
    } finally {
      setIsSwitching(false);
    }
  };

  // Loading state
  if (organizations === undefined) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  // Empty state - no organizations
  if (organizations.length === 0) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 gap-2 rounded-full px-2">
            <div className="flex size-6 items-center justify-center rounded-md border-2 border-dashed border-muted-foreground bg-transparent">
              <Building2 className="size-4 text-muted-foreground" />
            </div>
            <span className="max-w-[120px] truncate text-sm text-muted-foreground">
              No organization
            </span>
            <ChevronsUpDown className="size-4 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Organizations</DropdownMenuLabel>
          <DropdownMenuItem asChild className="gap-2 cursor-pointer">
            <Link to="/settings/org">
              <Building2 className="size-4" />
              <span>Create your first organization</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  const orgName = activeOrg?.organization?.name || "Select Organization";
  const orgInitial = orgName.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isSwitching}>
        <Button
          variant="ghost"
          className="relative h-8 gap-2 rounded-full px-2"
        >
          <Avatar className="size-6 rounded-md">
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {orgInitial}
            </AvatarFallback>
          </Avatar>
          <span className="max-w-[120px] truncate text-sm font-medium">
            {orgName}
          </span>
          <ChevronsUpDown className="size-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>
        {organizations.map((org: OrganizationWithRole) => {
          const isActive = org.organization?._id === activeOrgId;
          const initial = org.organization?.name?.charAt(0).toUpperCase() || "?";

          return (
            <DropdownMenuItem
              key={org.organization?._id}
              onClick={() => org.organization && handleSwitchOrg(org.organization._id)}
              className="gap-2"
              disabled={isSwitching || !org.organization}
            >
              <Avatar className="size-6 rounded-md">
                <AvatarFallback className="bg-secondary text-secondary-foreground text-xs">
                  {initial}
                </AvatarFallback>
              </Avatar>
              <span className="flex-1 truncate">{org.organization?.name}</span>
              {isActive && <Check className="size-4 text-primary" />}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="gap-2" disabled>
          <div className="flex size-6 items-center justify-center rounded-md border bg-background">
            <Plus className="size-4" />
          </div>
          <span>Create organization</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function UserMenu() {
  const navigate = useNavigate();
  const userData = useQuery(api.users.getCurrentWithOrg);
  const user = userData?.user;

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/auth/login" });
  };

  // Loading state
  if (userData === undefined) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="size-8 rounded-full" />
        <Skeleton className="h-4 w-20" />
      </div>
    );
  }

  // No user - show sign in button
  if (!user) {
    return (
      <Button asChild variant="ghost" size="sm">
        <Link to="/auth/login">Sign in</Link>
      </Button>
    );
  }

  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : user.email?.charAt(0).toUpperCase() || "?";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="size-8">
            {user.image && (
              <AvatarImage src={user.image} alt={user.name || user.email} />
            )}
            <AvatarFallback className="bg-secondary text-secondary-foreground text-sm font-semibold">
              {userInitials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/settings/profile" className="cursor-pointer">
            <Icons.User className="mr-2 size-4" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings" className="cursor-pointer">
            <Icons.Settings className="mr-2 size-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="cursor-pointer text-destructive focus:text-destructive"
        >
          <Icons.LogOut className="mr-2 size-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

interface NavbarProps {
  children?: React.ReactNode;
}

export function Navbar({ children }: NavbarProps) {
  const allNavItems = [...mainNavigation, ...workspaceNavigation];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center px-4">
          {/* Mobile Hamburger Menu */}
          <div className="mr-2 lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="size-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuLabel>Navigation</DropdownMenuLabel>
                {allNavItems.map((item) => (
                  <MobileNavItem key={item.href} item={item} />
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Logo */}
          <div className="mr-6">
            <Logo size="sm" />
          </div>

          {/* Main Navigation - Desktop only */}
          <nav className="hidden lg:flex flex-1 items-center gap-1">
            {allNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Right side - Org switcher and User menu */}
          <div className="ml-auto flex items-center gap-2">
            {appConfig.auth.enabled ? (
              <>
                <NavbarOrgSwitcher />
                <UserMenu />
              </>
            ) : (
              <span className="text-sm text-muted-foreground">Demo Mode</span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}
