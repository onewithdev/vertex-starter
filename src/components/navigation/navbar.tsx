"use client";

import { Link, useMatch } from "@tanstack/react-router";
import * as Icons from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { mainNavigation, workspaceNavigation, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
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
import { useQuery } from "convex/react";
import { api } from "@/convex/api";
import { signOut } from "@/lib/auth-client";
import { useNavigate } from "@tanstack/react-router";
import { Skeleton } from "@/components/ui/skeleton";
import { appConfig } from "@/config/app.config";

interface NavLinkProps {
  item: NavItem;
}

function NavLink({ item }: NavLinkProps) {
  const Icon = (Icons as unknown as Record<string, LucideIcon>)[item.icon] || Icons.Circle;

  // Use useMatch for type-safe, precise route matching
  // shouldThrow: false returns undefined instead of throwing when route doesn't match
  // For /app, use exact matching (params: {}) so it doesn't stay active on descendant routes
  const match = useMatch({ 
    from: item.href as "/", 
    shouldThrow: false,
    ...(item.href === "/app" ? { params: {} } : {})
  });
  const isActive = match !== undefined;

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
          {/* Logo */}
          <div className="mr-6">
            <Logo size="sm" />
          </div>

          {/* Main Navigation */}
          <nav className="flex flex-1 items-center gap-1">
            {allNavItems.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Right side - User menu */}
          <div className="flex items-center gap-2">
            {appConfig.auth.enabled ? (
              <UserMenu />
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
