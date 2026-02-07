# Vertex Stack Boilerplate - Design Document

> A configurable, multi-tenant SaaS boilerplate using TanStack Start, Convex, and Better Auth.

---

## 1. Overview & Goals

### Purpose
Create a starter/boilerplate that works for:
- **B2B Multi-tenant SaaS** (primary target)
- **Single-entity internal tools** (disable features via config)
- **Personal projects** (minimal mode)
- **B2C SaaS** (personal accounts enabled)

### Key Design Principles
1. **Config-driven** - One codebase adapts to all use cases via feature flags
2. **Type-safe everywhere** - End-to-end TypeScript from DB to UI
3. **Real-time by default** - Convex handles reactivity, no polling needed
4. **Clear boundaries** - Each technology does what it's designed for
5. **Modular & deletable** - Delete routes you don't need, app still works

---

## 2. Stack Responsibilities

### TanStack Start - The Orchestrator
- File-based routing with 100% type safety
- Layout composition and nested layouts
- Route guards (redirect unauthed users)
- SSR for initial loads
- Server functions (webhooks, API routes)

**Does NOT:** Database queries, auth sessions, business logic

### Convex - The Brain
- Real-time reactive queries
- All database operations (CRUD)
- Authorization and multi-tenant data isolation
- Server-side business logic
- Search and indexing

**Does NOT:** UI state, auth session creation, file uploads

### Better Auth - The Identity Layer
- Session creation and validation
- OAuth flows (GitHub, Google, etc.)
- Email/password with verification
- Organization/team management
- Member roles and permissions
- Invitations system

**Does NOT:** Application data, UI rendering, complex queries

---

## 3. Route Architecture

```
routes/
├── __root.tsx              # Root layout (providers, fonts, global styles)
├── index.tsx               # Landing page (optional, can be disabled)
├── pricing.tsx             # Pricing page (optional, can be deleted)
│
├── auth/
│   ├── route.tsx           # Auth layout (clean, centered)
│   ├── login.tsx
│   ├── register.tsx
│   ├── forgot-password.tsx
│   └── callback.tsx        # OAuth callbacks
│
├── (app)/                  # App layout group (route group, no URL prefix)
│   ├── _layout.tsx         # Authed layout with sidebar
│   ├── index.tsx           # Dashboard home
│   ├── projects/
│   │   ├── index.tsx       # Projects list
│   │   └── $projectId.tsx  # Project detail
│   └── tasks/
│       ├── index.tsx
│       └── $taskId.tsx
│
└── settings/
    ├── _layout.tsx         # Settings layout
    └── index.tsx           # Settings page with tabs:
                            #   - Profile
                            #   - Organization (if multiTenant enabled)
                            #   - Billing (if billing enabled)
                            #   - Security
```

---

## 4. Navigation Design (Vercel Pattern)

### Layout Mode: Sidebar-Dominant

```
┌─────────────────────────────────────────────────────────┐
│  ▓ Org Name        ⌄  │                                 │
│  ─────────────────────┼─────────────────────────────────│
│  ░ Dashboard          │                               │
│  ░ Projects           │     [Main Content Area]       │
│  ░ Tasks              │                               │
│                       │                               │
│  ─── WORKSPACE ───────│                               │
│  ░ Members            │                               │
│  ░ Billing            │                               │
│  ░ Settings           │                               │
│                       │                               │
│  [User Avatar]  ▓     │                               │
└─────────────────────────────────────────────────────────┘
```

### Key UX Elements

**Org Switcher** (Sidebar Header):
- Shows current org logo + name
- Dropdown lists user's organizations
- "Create organization" option
- Switching updates session, triggers reactive data refresh

**Navigation Groups**:
- **Main**: Dashboard, Projects, Tasks (app features)
- **Workspace**: Members, Billing, Settings (org-level)
- Conditional rendering based on feature flags

**Settings**:
- Tabs within `/settings` page (not sidebar sub-items)
- Profile, Organization, Billing, Security tabs
- Tabs hidden if features disabled

---

## 5. Configuration System

### Central Config File

```typescript
// app/config/app.config.ts
export const appConfig = {
  // Identity
  name: 'Vertex',
  description: 'Your app description',
  
  // Layout
  layout: {
    mode: 'sidebar',           // 'sidebar' | 'header' | 'minimal'
    sidebarCollapsible: true,
    showBreadcrumbs: true,
  },
  
  // Feature Toggles (configurable per project)
  features: {
    // Marketing
    landing: true,             // false = redirect / to /login
    pricing: true,             // false = hide pricing
    
    // Multi-tenancy
    multiTenant: true,         // false = hide org switcher
    allowPersonalAccounts: false, // true = users without orgs can use app
    
    // Business
    billing: true,             // Polar.sh integration
    invitations: true,         // invite members
    rbac: true,                // role-based access
    
    // App features (examples)
    projects: true,
    tasks: true,
    analytics: true,
  },
  
  // Navigation (auto-generated)
  navigation: {
    main: [
      { label: 'Dashboard', href: '/app', icon: 'Home' },
      { label: 'Projects', href: '/app/projects', icon: 'Folder', feature: 'projects' },
      { label: 'Tasks', href: '/app/tasks', icon: 'CheckSquare', feature: 'tasks' },
    ],
    workspace: [
      { label: 'Members', href: '/settings/organization', icon: 'Users', feature: 'multiTenant' },
      { label: 'Billing', href: '/settings/billing', icon: 'CreditCard', feature: 'billing' },
      { label: 'Settings', href: '/settings', icon: 'Settings' },
    ],
  },
  
  // Auth
  auth: {
    providers: ['github', 'google'],
    allowEmailPassword: true,
    requireEmailVerification: true,
  },
};
```

### Conditional Rendering Pattern

```typescript
// Components check features before rendering
function SidebarNav() {
  const { features, navigation } = useAppConfig();
  
  return (
    <nav>
      <NavGroup items={navigation.main.filter(i => !i.feature || features[i.feature])} />
      
      {(features.multiTenant || features.billing) && (
        <>
          <NavLabel>Workspace</NavLabel>
          <NavGroup items={navigation.workspace.filter(i => !i.feature || features[i.feature])} />
        </>
      )}
    </nav>
  );
}
```

---

## 6. Component Architecture

### Shadcn Components to Install

```bash
# Navigation & Layout
npx shadcn add sidebar dropdown-menu avatar button separator

# Settings
npx shadcn add tabs card input label switch toast

# Auth
npx shadcn add form input label card

# Data Display
npx shadcn add table badge skeleton
```

### Custom Component Structure

```
app/components/
├── ui/                         # Shadcn components (auto-generated)
│
├── navigation/
│   ├── sidebar.tsx             # Main sidebar shell
│   ├── sidebar-header.tsx      # Org switcher + collapse
│   ├── sidebar-nav.tsx         # Navigation groups/items
│   ├── sidebar-footer.tsx      # User menu
│   ├── org-switcher.tsx        # Org dropdown
│   └── user-menu.tsx           # User avatar dropdown
│
├── settings/
│   ├── settings-tabs.tsx       # Tab navigation
│   ├── profile-form.tsx
│   ├── org-settings-form.tsx
│   ├── billing-section.tsx     # Polar.sh integration
│   └── security-settings.tsx
│
├── auth/
│   ├── login-form.tsx
│   ├── register-form.tsx
│   └── oauth-buttons.tsx
│
├── projects/                   # Example app components
│   ├── project-card.tsx
│   ├── project-list.tsx
│   └── create-project-dialog.tsx
│
└── shared/
    ├── logo.tsx
    ├── empty-state.tsx
    ├── loading-skeleton.tsx
    └── error-boundary.tsx
```

---

## 7. Data Flow & Organization Context

### Option A: Session-Based Org Context (Selected)

Better Auth stores `activeOrganizationId` in the session token.

**Flow:**
```
1. User clicks org dropdown
2. Better Auth's switchOrganization(orgId) updates session
3. Session change triggers Convex reconnection
4. All queries re-run with new org context
5. UI updates reactively
```

**Pros:** Simple, works immediately on page load, clean URLs
**Cons:** Two tabs share same org context (acceptable for MVP)

### Auth → Convex Integration

```typescript
// Better Auth provides session
const { data: session } = authClient.useSession();
// session.activeOrganizationId

// Convex uses it for authorization
export const getProjects = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    const orgId = identity.customClaims?.activeOrganizationId;
    
    // Verify membership
    const member = await ctx.db.query("members")
      .withIndex("by_user_org", q => q.eq("userId", identity.subject).eq("orgId", orgId))
      .unique();
    
    if (!member) throw new Error("Unauthorized");
    
    return ctx.db.query("projects").withIndex("by_org", q => q.eq("orgId", orgId)).collect();
  }
});

// React consumes with real-time updates
const projects = useQuery(api.projects.getProjects);
// Auto-updates when data changes!
```

---

## 8. Convex Schema Design

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════
  // BETTER AUTH TABLES
  // ═══════════════════════════════════════════════════════════
  
  users: defineTable({
    email: v.string(),
    emailVerified: v.boolean(),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    role: v.optional(v.string()), // "user", "admin"
    preferences: v.optional(v.object({
      theme: v.optional(v.string()),
      notifications: v.optional(v.boolean()),
    })),
  }).index("by_email", ["email"]),
  
  sessions: defineTable({
    userId: v.id("users"),
    token: v.string(),
    expiresAt: v.number(),
  }).index("by_token", ["token"]),
  
  accounts: defineTable({
    userId: v.id("users"),
    provider: v.string(),
    providerAccountId: v.string(),
  }),
  
  // ═══════════════════════════════════════════════════════════
  // ORGANIZATIONS (Better Auth Plugin)
  // ═══════════════════════════════════════════════════════════
  
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    logo: v.optional(v.string()),
    metadata: v.optional(v.object({
      plan: v.string(),
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
    })),
    ownerId: v.id("users"),
    createdAt: v.number(),
  }).index("by_slug", ["slug"]),
  
  members: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(), // "owner", "admin", "member"
    joinedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_user_org", ["userId", "organizationId"]),
  
  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    status: v.string(), // "pending", "accepted", "expired"
  }).index("by_token", ["token"]),
  
  // ═══════════════════════════════════════════════════════════
  // APPLICATION TABLES
  // ═══════════════════════════════════════════════════════════
  
  projects: defineTable({
    orgId: v.id("organizations"),     // ← Multi-tenant FK
    name: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "active", "archived"
    createdBy: v.id("users"),
    updatedBy: v.id("users"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_status", ["orgId", "status"]),
  
  tasks: defineTable({
    orgId: v.id("organizations"),
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(),
    priority: v.string(),
    assigneeId: v.optional(v.id("users")),
    createdBy: v.id("users"),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_project", ["projectId"])
    .index("by_assignee", ["orgId", "assigneeId"]),
  
  auditLog: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  }).index("by_org", ["orgId"]),
});
```

---

## 9. Authorization Patterns

### Auth Helper Module

```typescript
// convex/auth-helpers.ts
export interface AuthContext {
  userId: string;
  orgId: string;
  membership: { role: "owner" | "admin" | "member" };
}

export async function requireAuth(ctx): Promise<AuthContext> {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) throw new ConvexError({ code: "UNAUTHORIZED" });
  
  const orgId = identity.customClaims?.activeOrganizationId;
  if (!orgId) throw new ConvexError({ code: "NO_ORGANIZATION" });
  
  const membership = await ctx.db
    .query("members")
    .withIndex("by_user_org", q => 
      q.eq("userId", identity.subject).eq("organizationId", orgId)
    )
    .unique();
  
  if (!membership) throw new ConvexError({ code: "NOT_MEMBER" });
  
  return { userId: identity.subject, orgId, membership };
}

export function requireRole(auth: AuthContext, allowed: string[]) {
  if (!allowed.includes(auth.membership.role)) {
    throw new ConvexError({ code: "FORBIDDEN" });
  }
}
```

### Query Pattern

```typescript
export const list = query({
  handler: async (ctx) => {
    const { orgId } = await requireAuth(ctx);
    
    return await ctx.db
      .query("projects")
      .withIndex("by_org", q => q.eq("orgId", orgId))
      .order("desc")
      .take(100);
  },
});
```

### Mutation Pattern

```typescript
export const create = mutation({
  args: { name: v.string(), description: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);
    // All members can create
    
    const projectId = await ctx.db.insert("projects", {
      orgId: auth.orgId,
      name: args.name,
      description: args.description,
      status: "active",
      createdBy: auth.userId,
      updatedBy: auth.userId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    // Audit log
    await ctx.db.insert("auditLog", {
      orgId: auth.orgId,
      userId: auth.userId,
      action: "project.created",
      entityType: "project",
      entityId: projectId,
      createdAt: Date.now(),
    });
    
    return projectId;
  },
});

export const delete = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const auth = await requireAuth(ctx);
    requireRole(auth, ["owner", "admin"]); // Only admins
    
    const project = await ctx.db.get(projectId);
    if (!project || project.orgId !== auth.orgId) {
      throw new ConvexError({ code: "NOT_FOUND" });
    }
    
    // Soft delete
    await ctx.db.patch(projectId, { status: "archived", updatedAt: Date.now() });
    return projectId;
  },
});
```

---

## 10. Frontend Integration

### Custom Hooks

```typescript
// app/hooks/use-projects.ts
import { useQuery, useMutation } from "@convex-dev/react-query";
import { api } from "@convex/_generated/api";

export function useProjects() {
  return useQuery(api.projects.list);
}

export function useCreateProject() {
  return useMutation(api.projects.create);
}
```

### Component with Real-Time Updates

```typescript
// app/routes/app/projects/index.tsx
export function ProjectsPage() {
  const projects = useProjects();
  const createProject = useCreateProject();
  
  // projects updates automatically when:
  // - You create/update/delete
  // - Another user modifies data
  // - Org switch happens
  
  if (projects === undefined) return <ProjectsSkeleton />;
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold">Projects</h1>
        <CreateProjectDialog onSubmit={createProject.mutate} />
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map(p => <ProjectCard key={p._id} project={p} />)}
      </div>
    </div>
  );
}
```

### Org Switching Integration

```typescript
// components/navigation/org-switcher.tsx
export function OrgSwitcher() {
  const { data: session } = authClient.useSession();
  const organizations = useOrganizations();
  const queryClient = useQueryClient();
  const { switchOrganization } = authClient.useOrganization();
  
  const handleSwitch = async (orgId: string) => {
    await switchOrganization(orgId);
    queryClient.clear(); // Clear all queries, re-fetch with new org
    navigate({ to: "/app" });
  };
  
  // ... render dropdown
}
```

---

## 11. Environment Setup

### Required Environment Variables

```bash
# Convex
VITE_CONVEX_URL=https://your-deployment.convex.cloud

# Better Auth
BETTER_AUTH_SECRET=your-secret
BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=xxx
GITHUB_CLIENT_SECRET=xxx
GOOGLE_CLIENT_ID=xxx
GOOGLE_CLIENT_SECRET=xxx

# Billing (Polar.sh)
POLAR_ACCESS_TOKEN=xxx
POLAR_WEBHOOK_SECRET=xxx
```

---

## 12. Implementation Checklist

### Phase 1: Foundation
- [ ] Initialize TanStack Start project
- [ ] Configure Tailwind CSS v4
- [ ] Install and configure Shadcn UI v2
- [ ] Set up Convex with Better Auth adapter
- [ ] Configure Better Auth with organizations plugin

### Phase 2: Core Infrastructure
- [ ] Create route structure and layouts
- [ ] Implement auth pages (login, register, callbacks)
- [ ] Build sidebar navigation with org switcher
- [ ] Create settings page with tabs

### Phase 3: Multi-Tenant Features
- [ ] Implement Convex schema with auth tables
- [ ] Create authorization helpers
- [ ] Build organization management (create, switch, invite)
- [ ] Implement member roles and permissions

### Phase 4: Example Features
- [ ] Create projects module (CRUD)
- [ ] Create tasks module (CRUD)
- [ ] Add audit logging
- [ ] Implement optimistic updates

### Phase 5: Billing (Optional)
- [ ] Integrate Polar.sh
- [ ] Create checkout flows
- [ ] Handle webhooks
- [ ] Add billing page to settings

### Phase 6: Polish
- [ ] Loading states and skeletons
- [ ] Error boundaries and handling
- [ ] Empty states
- [ ] Toast notifications
- [ ] Mobile responsiveness

---

## 13. Extension Points

### Adding New App Features

1. **Add to config:**
```typescript
features: { newFeature: true }
```

2. **Add route:**
```
routes/(app)/new-feature/index.tsx
```

3. **Add Convex functions:**
```typescript
// convex/newFeature.ts
export const list = query({...});
export const create = mutation({...});
```

4. **Add navigation link:**
```typescript
navigation.main.push({
  label: 'New Feature',
  href: '/app/new-feature',
  icon: 'NewIcon',
  feature: 'newFeature'
});
```

---

## 14. Summary

This boilerplate provides:
- **Config-driven architecture** - One codebase, multiple use cases
- **End-to-end type safety** - TanStack Router + Convex
- **Real-time by default** - No polling, automatic updates
- **Clear boundaries** - Each tech does what it's best at
- **Vercel-style navigation** - Sidebar-dominant, org switcher
- **Multi-tenant ready** - Organizations, roles, data isolation
- **Easily extensible** - Add features by following patterns

**Next Step:** Create implementation plan with detailed steps for setup and configuration.
