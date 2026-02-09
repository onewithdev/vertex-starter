# Slice 1: Working Navigation & Layout Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix the navigation to be sticky, responsive, and show the current organization context with working org switcher.

**Architecture:** Use CSS sticky positioning for the navbar, TanStack Router's `useMatch` for active route highlighting, and Convex queries for org data. Mobile uses a sheet drawer pattern.

**Tech Stack:** React 19, TanStack Router, Convex, Tailwind CSS v4, shadcn/ui, Lucide icons

---

## Prerequisites (Verify Before Starting)

**Check these files exist:**
- `src/components/navigation/navbar.tsx` - Top navigation bar
- `src/components/navigation/sidebar.tsx` - Left sidebar
- `src/components/navigation/org-switcher.tsx` - Organization switcher dropdown
- `src/components/navigation/sidebar-nav.tsx` - Navigation links
- `src/routes/app/_layout.tsx` - App layout wrapper
- `src/config/app.config.ts` - Feature flags

**Tech references:**
- TanStack Router active links: https://tanstack.com/router/latest/docs/framework/react/guide/navigation#active-link-options
- shadcn Sheet component: `src/components/ui/sheet.tsx` (may need to add)
- Current org query: `src/convex/users.ts` → `getCurrentWithOrg`

---

## Elephant Carpaccio Approach

We use **Walking Skeleton → Meat** and **Zero-One-Many** patterns:
1. Skeleton: Static layout that looks right (no data)
2. One: Single hardcoded org in switcher
3. Many: Real org data from Convex
4. Zero: Empty states when no org

---

## Task 1: Verify Sticky Navbar CSS (Walking Skeleton)

**Files:**
- Modify: `src/components/navigation/navbar.tsx`
- Test: Visual verification in browser

**Context:** The navbar should stick to the top when scrolling. Currently it may not have `sticky` or `top-0` classes.

**Step 1: Check current navbar implementation**

Read: `src/components/navigation/navbar.tsx`

**Step 2: Add sticky positioning**

Ensure the navbar container has these Tailwind classes:

```tsx
// src/components/navigation/navbar.tsx
// The outermost element should have:
<header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
  {/* nav content */}
</header>
```

**Step 3: Verify the app layout structure**

Read: `src/routes/app/_layout.tsx`

The layout should have structure like:
```tsx
<div className="flex min-h-screen">
  <Sidebar />
  <div className="flex-1">
    <Navbar />
    <main className="p-6">{children}</main>
  </div>
</div>
```

**Step 4: Test sticky behavior**

Run: `npm run dev`
Open: http://localhost:3000/app

1. Scroll down the page
2. **Expected:** Navbar stays fixed at top
3. **Fail if:** Navbar scrolls away with content

**Step 5: Commit**

```bash
git add src/components/navigation/navbar.tsx
git commit -m "fix(navbar): make navbar sticky with backdrop blur"
```

---

## Task 2: Active Route Highlighting (Happy Path - Simple)

**Files:**
- Modify: `src/components/navigation/sidebar-nav.tsx`
- Test: Visual verification in browser

**Context:** Navigation links should show which route is active. Use TanStack Router's `useMatch` hook.

**Step 1: Read current sidebar-nav implementation**

Read: `src/components/navigation/sidebar-nav.tsx`

**Step 2: Add active state logic**

Modify navigation links to use `useMatch`:

```tsx
// src/components/navigation/sidebar-nav.tsx
import { Link, useMatch } from '@tanstack/react-router'

function NavItem({ to, icon: Icon, label }: NavItemProps) {
  // Check if this route is active (exact or child routes)
  const match = useMatch({
    from: to,
    shouldThrow: false, // Don't error if route doesn't exist yet
  })
  
  const isActive = !!match

  return (
    <Link
      to={to}
      className={cn(
        'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        isActive 
          ? 'bg-primary text-primary-foreground' 
          : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
      )}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  )
}
```

**Step 3: Define navigation items (hardcoded first)**

```tsx
// At top of sidebar-nav.tsx, define the nav structure
const navItems = [
  { to: '/app', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/settings/profile', icon: User, label: 'Profile' },
]
```

**Step 4: Test active highlighting**

Run: `npm run dev`

1. Click on each nav item
2. **Expected:** Active item has different background (bg-primary)
3. **Expected:** Browser navigates to correct route
4. **Fail if:** No visual change or navigation broken

**Step 5: Commit**

```bash
git add src/components/navigation/sidebar-nav.tsx
git commit -m "feat(nav): add active route highlighting with useMatch"
```

---

## Task 3: Hardcoded Org in Switcher (One Pattern)

**Files:**
- Modify: `src/components/navigation/org-switcher.tsx`
- Test: Visual verification in browser

**Context:** Org switcher should show current org. Start with hardcoded data to get UI right.

**Step 1: Read current org-switcher**

Read: `src/components/navigation/org-switcher.tsx`

**Step 2: Hardcode single org display**

```tsx
// src/components/navigation/org-switcher.tsx
import { Building2, ChevronDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

// Hardcoded org (Walking Skeleton pattern)
const HARDCODED_ORG = {
  id: 'org_123',
  name: 'Acme Corp',
  slug: 'acme-corp',
}

export function OrgSwitcher() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
            {HARDCODED_ORG.name.charAt(0)}
          </div>
          <span className="flex-1 truncate text-left">{HARDCODED_ORG.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem className="gap-2">
          <Building2 className="h-4 w-4" />
          <span>{HARDCODED_ORG.name}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-muted-foreground">
          + Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Step 3: Add to sidebar header**

Read: `src/components/navigation/sidebar-header.tsx`

Ensure OrgSwitcher is rendered in the sidebar header area.

**Step 4: Test org switcher UI**

Run: `npm run dev`

1. **Expected:** Org name "Acme Corp" shows in sidebar
2. **Expected:** Clicking opens dropdown with org name + "Create organization"
3. **Fail if:** Dropdown doesn't open or styling broken

**Step 5: Commit**

```bash
git add src/components/navigation/org-switcher.tsx
git commit -m "feat(nav): add hardcoded org switcher UI (skeleton)"
```

---

## Task 4: Real Org Data from Convex (Many Pattern)

**Files:**
- Modify: `src/components/navigation/org-switcher.tsx`
- Uses: `src/convex/users.ts`
- Test: Visual verification with real data

**Context:** Replace hardcoded org with actual data from Convex query.

**Step 1: Add Convex query hook**

```tsx
// src/components/navigation/org-switcher.tsx
import { useQuery } from 'convex/react'
import { api } from '@/convex/api'

export function OrgSwitcher() {
  // Fetch current user with org
  const userData = useQuery(api.users.getCurrentWithOrg)
  
  const organization = userData?.organization
  
  if (!organization) {
    return (
      <Button variant="ghost" className="w-full justify-start px-2" disabled>
        <span className="text-muted-foreground">No organization</span>
      </Button>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2">
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground text-xs font-bold">
            {organization.name?.charAt(0) || '?'}
          </div>
          <span className="flex-1 truncate text-left">{organization.name}</span>
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem className="gap-2">
          <Building2 className="h-4 w-4" />
          <span>{organization.name}</span>
        </DropdownMenuItem>
        <DropdownMenuItem className="text-muted-foreground">
          + Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Step 2: Handle loading state**

Add skeleton while loading:

```tsx
// Inside OrgSwitcher, before the return
if (userData === undefined) {
  return (
    <div className="flex items-center gap-2 px-2 py-1.5">
      <Skeleton className="h-6 w-6 rounded" />
      <Skeleton className="h-4 w-24" />
    </div>
  )
}
```

**Step 3: Test with real data**

Run: `npm run dev`

1. **Expected:** Shows your actual org name from Convex
2. **Expected:** Loading skeleton appears briefly then real data
3. **Fail if:** Shows "No organization" when you have one

**Step 4: Commit**

```bash
git add src/components/navigation/org-switcher.tsx
git commit -m "feat(nav): wire org switcher to convex data"
```

---

## Task 5: Mobile Responsive Sidebar (Walking Skeleton - Sheet)

**Files:**
- Create: `src/components/ui/sheet.tsx` (if missing)
- Modify: `src/components/navigation/sidebar.tsx`
- Modify: `src/routes/app/_layout.tsx`
- Test: Visual on mobile viewport

**Context:** Sidebar should become a slide-out drawer on mobile. Uses shadcn Sheet component.

**Step 1: Check if Sheet component exists**

Run: `ls src/components/ui/sheet.tsx`

If missing, install:
```bash
npx shadcn add sheet
```

**Step 2: Read current sidebar**

Read: `src/components/navigation/sidebar.tsx`

**Step 3: Create mobile-aware sidebar wrapper**

```tsx
// src/components/navigation/sidebar.tsx
import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { SidebarHeader } from './sidebar-header'
import { SidebarNav } from './sidebar-nav'
import { SidebarFooter } from './sidebar-footer'

// Desktop sidebar (always visible)
function DesktopSidebar() {
  return (
    <aside className="hidden lg:flex w-64 flex-col border-r bg-background">
      <SidebarHeader />
      <div className="flex-1 overflow-auto py-2">
        <SidebarNav />
      </div>
      <SidebarFooter />
    </aside>
  )
}

// Mobile sidebar (sheet drawer)
function MobileSidebar() {
  const [open, setOpen] = useState(false)
  
  return (
    <div className="lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="flex h-full flex-col">
            <SidebarHeader />
            <div className="flex-1 overflow-auto py-2">
              <SidebarNav onNavigate={() => setOpen(false)} />
            </div>
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

export function Sidebar() {
  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  )
}
```

**Step 4: Add onNavigate prop to SidebarNav**

```tsx
// src/components/navigation/sidebar-nav.tsx
interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  // ... in NavItem component:
  <Link
    to={to}
    onClick={onNavigate} // Close sheet on navigate
    // ... rest of Link
  >
```

**Step 5: Update layout to include mobile trigger in navbar**

Read: `src/routes/app/_layout.tsx`

Ensure the layout passes mobile sidebar trigger appropriately or adjust navbar:

```tsx
// src/components/navigation/navbar.tsx - add mobile trigger
export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="flex h-14 items-center px-4">
        {/* Mobile menu trigger - only visible on small screens */}
        <div className="lg:hidden">
          <MobileSidebarTrigger />
        </div>
        
        {/* Rest of navbar content */}
        <div className="flex-1" />
        <UserMenu />
      </div>
    </header>
  )
}
```

*Note: You may need to restructure how Sidebar and Navbar share the mobile trigger.*

**Step 6: Test mobile responsive**

Run: `npm run dev`

1. Open DevTools → Toggle device toolbar
2. Set to iPhone SE or similar
3. **Expected:** Sidebar hidden, hamburger menu visible
4. **Expected:** Click hamburger → Sidebar slides in from left
5. **Expected:** Click nav item → Sidebar closes, navigation happens
6. **Fail if:** Layout broken on mobile or sheet doesn't work

**Step 7: Commit**

```bash
git add src/components/navigation/sidebar.tsx
git add src/components/navigation/sidebar-nav.tsx
git add src/components/navigation/navbar.tsx
git commit -m "feat(nav): add mobile responsive sidebar with sheet drawer"
```

---

## Task 6: Empty State - No Org (Zero Pattern)

**Files:**
- Modify: `src/components/navigation/org-switcher.tsx`
- Modify: `src/routes/app/_layout.tsx` (optional - show banner)
- Test: Visual with user that has no org

**Context:** Handle case where user has no organization (especially in B2B mode).

**Step 1: Enhance no-org state in switcher**

```tsx
// src/components/navigation/org-switcher.tsx - update the no-org case
if (!organization) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2 px-2 text-muted-foreground">
          <div className="flex h-6 w-6 items-center justify-center rounded border border-dashed border-muted-foreground/50">
            <Building2 className="h-3 w-3" />
          </div>
          <span className="flex-1 truncate text-left">No organization</span>
          <ChevronDown className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuItem className="text-muted-foreground">
          + Create your first organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

**Step 2: Optional - Add no-org banner**

```tsx
// src/routes/app/_layout.tsx - add banner when no org
function NoOrgBanner() {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <p className="text-sm text-amber-800">
        You're not in an organization. 
        <Link to="/onboarding" className="ml-1 font-medium underline">
          Create one to get started →
        </Link>
      </p>
    </div>
  )
}

// In layout, conditionally show banner based on userData
```

**Step 3: Test empty state**

1. Create test user with no org (or temporarily modify query to return null)
2. **Expected:** Shows "No organization" with dashed icon
3. **Expected:** Dropdown shows "Create your first organization"
4. **Fail if:** Broken UI or misleading message

**Step 4: Commit**

```bash
git add src/components/navigation/org-switcher.tsx
git commit -m "feat(nav): add empty state for no organization"
```

---

## Task 7: Integration Test - Full Navigation Flow

**Files:**
- All navigation components
- Test: Manual end-to-end flow

**Step 1: Verify all pieces work together**

Run: `npm run dev`

**Test checklist:**
- [ ] Navbar stays sticky when scrolling
- [ ] Active route highlighted correctly
- [ ] Org switcher shows real org name
- [ ] Org switcher dropdown opens
- [ ] Mobile hamburger works
- [ ] Mobile nav closes on selection
- [ ] No console errors

**Step 2: Test on multiple routes**

Navigate to:
- `/app` - Dashboard
- `/settings` - Settings
- `/settings/profile` - Profile

Verify active highlight changes on each.

**Step 3: Commit final slice**

```bash
git add .
git commit -m "feat(slice1): complete working navigation with sticky header, active routes, org switcher, mobile responsive"
```

---

## Completion Checklist

- [ ] Navbar is sticky on scroll
- [ ] Active route has visual highlight
- [ ] Org switcher shows current org from Convex
- [ ] Loading skeleton while org data loads
- [ ] Empty state when no org
- [ ] Mobile sidebar as sheet drawer
- [ ] All navigation links work
- [ ] No TypeScript errors
- [ ] No console errors

---

## Next Slice Preview

**Slice 2: Organization Lifecycle**
- Onboarding flow (create/join org)
- Org creation modal
- Org switching (updates active org in session)
- Mode-aware flows (B2B/B2C/Hybrid)
