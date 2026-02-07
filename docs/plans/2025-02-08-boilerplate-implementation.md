# Vertex Stack Boilerplate - Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create a configurable multi-tenant SaaS boilerplate using TanStack Start, Convex, Better Auth, and Shadcn UI v2 with Tailwind CSS v4.

**Architecture:** Config-driven feature system allowing one codebase to adapt to B2B SaaS, internal tools, or personal projects via feature flags. Session-based organization context with reactive Convex queries.

**Tech Stack:** TanStack Start 1.15+, Convex 1.17+, Better Auth 1.4+, React 19, Tailwind CSS 4.0+, Shadcn UI v2, TypeScript 5.7+

---

## Prerequisites

- Node.js 20+ installed
- pnpm installed (`npm install -g pnpm`)
- Git initialized in project root

---

## Phase 1: Project Foundation

### Task 1: Initialize TanStack Start Project

**Files:**
- Create: Entire project structure

**Step 1: Create project with TanStack Start template**

```bash
cd /home/mors/projects/vertex-stack
pnpm create @tanstack/start@latest vertex-boilerplate --template default
```

**Expected:** Project created at `vertex-boilerplate/` with:
- `app/` directory with routes
- `package.json` with TanStack Start dependencies
- Vite configuration
- TypeScript setup

**Step 2: Move files to project root and clean up**

```bash
cd /home/mors/projects/vertex-stack
mv vertex-boilerplate/* .
mv vertex-boilerplate/.* . 2>/dev/null || true
rm -rf vertex-boilerplate
```

**Step 3: Verify project structure**

```bash
ls -la
```

**Expected:** See `app/`, `package.json`, `vite.config.ts`, `tsconfig.json`

**Step 4: Install dependencies and verify dev server works**

```bash
pnpm install
pnpm dev &
sleep 5
curl -s http://localhost:3000 | head -20
pkill -f "pnpm dev" || true
```

**Expected:** Server responds with HTML containing the TanStack Start default page

**Step 5: Commit**

```bash
git add .
git commit -m "feat: initialize TanStack Start project"
```

---

### Task 2: Configure Tailwind CSS v4

**Files:**
- Create: `app/styles.css`
- Modify: `vite.config.ts`
- Delete: `tailwind.config.ts` (if exists)

**Step 1: Install Tailwind CSS v4 and dependencies**

```bash
pnpm add -D tailwindcss @tailwindcss/vite tw-animate-css
```

**Expected:** Packages added to `package.json` dependencies

**Step 2: Update vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackStartVite } from '@tanstack/start/plugin/vite'
import tsConfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
  plugins: [
    TanStackStartVite(),
    react(),
    tailwindcss(),
    tsConfigPaths(),
  ],
})
```

**Step 3: Create app/styles.css with Tailwind v4 configuration**

```css
@import "tailwindcss";
@import "tw-animate-css";

:root {
  --background: hsl(0 0% 100%);
  --foreground: hsl(222.2 84% 4.9%);
  --card: hsl(0 0% 100%);
  --card-foreground: hsl(222.2 84% 4.9%);
  --popover: hsl(0 0% 100%);
  --popover-foreground: hsl(222.2 84% 4.9%);
  --primary: hsl(221.2 83.2% 53.3%);
  --primary-foreground: hsl(210 40% 98%);
  --secondary: hsl(210 40% 96.1%);
  --secondary-foreground: hsl(222.2 47.4% 11.2%);
  --muted: hsl(210 40% 96.1%);
  --muted-foreground: hsl(215.4 16.3% 46.9%);
  --accent: hsl(210 40% 96.1%);
  --accent-foreground: hsl(222.2 47.4% 11.2%);
  --destructive: hsl(0 84.2% 60.2%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(214.3 31.8% 91.4%);
  --input: hsl(214.3 31.8% 91.4%);
  --ring: hsl(221.2 83.2% 53.3%);
  --radius: 0.5rem;
}

.dark {
  --background: hsl(222.2 84% 4.9%);
  --foreground: hsl(210 40% 98%);
  --card: hsl(222.2 84% 4.9%);
  --card-foreground: hsl(210 40% 98%);
  --popover: hsl(222.2 84% 4.9%);
  --popover-foreground: hsl(210 40% 98%);
  --primary: hsl(217.2 91.2% 59.8%);
  --primary-foreground: hsl(222.2 47.4% 11.2%);
  --secondary: hsl(217.2 32.6% 17.5%);
  --secondary-foreground: hsl(210 40% 98%);
  --muted: hsl(217.2 32.6% 17.5%);
  --muted-foreground: hsl(215 20.2% 65.1%);
  --accent: hsl(217.2 32.6% 17.5%);
  --accent-foreground: hsl(210 40% 98%);
  --destructive: hsl(0 62.8% 30.6%);
  --destructive-foreground: hsl(210 40% 98%);
  --border: hsl(217.2 32.6% 17.5%);
  --input: hsl(217.2 32.6% 17.5%);
  --ring: hsl(224.3 76.3% 48%);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}

@layer base {
  * {
    border-color: var(--border);
  }
  body {
    background-color: var(--background);
    color: var(--foreground);
  }
}
```

**Step 4: Import styles in app/client.tsx**

```typescript
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouter } from './router'
import './styles.css'

const router = createRouter()

hydrateRoot(document, <StartClient router={router} />)
```

**Step 5: Remove old Tailwind config if exists**

```bash
rm -f tailwind.config.ts tailwind.config.js
```

**Step 6: Test Tailwind is working**

```bash
pnpm dev &
sleep 5
curl -s http://localhost:3000 | grep -q "tailwind" && echo "Tailwind loaded" || echo "Check styles"
pkill -f "pnpm dev" || true
```

**Step 7: Commit**

```bash
git add .
git commit -m "feat: configure Tailwind CSS v4"
```

---

### Task 3: Initialize Shadcn UI v2

**Files:**
- Create: `components.json`
- Create: `app/lib/utils.ts`
- Modify: `package.json` (add shadcn dependencies)

**Step 1: Install shadcn CLI and required dependencies**

```bash
pnpm add -D @shadcn/ui
pnpm add class-variance-authority clsx tailwind-merge
```

**Step 2: Create components.json configuration**

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": false,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "app/styles.css",
    "baseColor": "slate",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

**Step 3: Create app/lib/utils.ts**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Step 4: Install base UI components**

```bash
pnpm dlx shadcn@latest add button -y
pnpm dlx shadcn@latest add card -y
pnpm dlx shadcn@latest add input -y
pnpm dlx shadcn@latest add label -y
```

**Expected:** Components installed at `app/components/ui/`

**Step 5: Verify button component exists**

```bash
ls -la app/components/ui/button.tsx
```

**Expected:** File exists with proper TypeScript types

**Step 6: Test component in a route**

Modify `app/routes/index.tsx` temporarily:

```typescript
import { createFileRoute } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Vertex Stack</h1>
      <Button>Shadcn Button Works!</Button>
    </div>
  )
}
```

**Step 7: Run dev server and verify**

```bash
pnpm dev &
sleep 5
curl -s http://localhost:3000 | grep -q "Shadcn Button" && echo "Components working" || echo "Check setup"
pkill -f "pnpm dev" || true
```

**Step 8: Commit**

```bash
git add .
git commit -m "feat: initialize Shadcn UI v2"
```

---

## Phase 2: Convex & Better Auth Integration

### Task 4: Set Up Convex with Better Auth

**Files:**
- Create: `convex/convex.config.ts`
- Create: `convex/betterAuth/convex.config.ts`
- Create: `convex/betterAuth/auth.ts`
- Create: `convex/auth.config.ts`
- Create: `convex/http.ts`
- Create: `app/lib/convex.tsx`
- Create: `app/lib/auth-client.ts`
- Modify: `app/client.tsx`
- Modify: `app/ssr.tsx`
- Modify: `package.json`

**Step 1: Install Convex and Better Auth packages**

```bash
pnpm add convex @convex-dev/better-auth better-auth
pnpm add -D @better-auth/cli
```

**Step 2: Initialize Convex project**

```bash
npx convex dev --once
```

**Expected:** Creates `.env.local` with Convex deployment URL

**Step 3: Set environment variables**

```bash
npx convex env set BETTER_AUTH_SECRET=$(openssl rand -base64 32)
npx convex env set SITE_URL=http://localhost:3000
```

**Step 4: Create convex/auth.config.ts**

```typescript
import { getAuthConfigProvider } from "@convex-dev/better-auth/auth-config";
import type { AuthConfig } from "convex/server";

export default {
  providers: [getAuthConfigProvider()],
} satisfies AuthConfig;
```

**Step 5: Create convex/betterAuth/convex.config.ts**

```typescript
import { defineComponent } from "convex/server";

const component = defineComponent("betterAuth");

export default component;
```

**Step 6: Create convex/convex.config.ts**

```typescript
import { defineApp } from "convex/server";
import betterAuth from "./betterAuth/convex.config";

const app = defineApp();

app.use(betterAuth);

export default app;
```

**Step 7: Create convex/betterAuth/auth.ts**

```typescript
import { createClient } from "@convex-dev/better-auth";
import { convex } from "@convex-dev/better-auth/plugins";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { BetterAuthOptions } from "better-auth";
import { betterAuth } from "better-auth";
import { components } from "../_generated/api";
import type { DataModel } from "../_generated/dataModel";
import authConfig from "../auth.config";

// Better Auth Component
export const authComponent = createClient<DataModel>(
  components.betterAuth,
  {
    verbose: false,
  },
);

// Better Auth Options
export const createAuthOptions = (ctx: GenericCtx<DataModel>) => {
  return {
    appName: "Vertex Stack",
    baseURL: process.env.SITE_URL,
    secret: process.env.BETTER_AUTH_SECRET,
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID || "",
        clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
      },
    },
    plugins: [convex({ authConfig })],
  } satisfies BetterAuthOptions;
};

// For @better-auth/cli
export const options = createAuthOptions({} as GenericCtx<DataModel>);

// Better Auth Instance
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth(createAuthOptions(ctx));
};
```

**Step 8: Generate Better Auth schema**

```bash
npx @better-auth/cli generate --config ./convex/betterAuth/auth.ts --output ./convex/betterAuth/schema.ts
```

**Expected:** Creates `convex/betterAuth/schema.ts` with auth tables

**Step 9: Create convex/betterAuth/adapter.ts**

```typescript
import { createApi } from "@convex-dev/better-auth";
import { createAuthOptions } from "./auth";

export const {
  create,
  findOne,
  findMany,
  updateOne,
  updateMany,
  deleteOne,
  deleteMany,
} = createApi({}, createAuthOptions);
```

**Step 10: Create convex/http.ts**

```typescript
import { httpRouter } from "convex/server";
import { authComponent, createAuth } from "./betterAuth/auth";

const http = httpRouter();

authComponent.registerRoutes(http, createAuth);

export default http;
```

**Step 11: Create app/lib/auth-client.ts**

```typescript
import { convexClient } from "@convex-dev/better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  plugins: [convexClient(), organizationClient()],
});

export type AuthClient = typeof authClient;
```

**Step 12: Create app/lib/convex.tsx**

```typescript
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react";
import { ConvexReactClient } from "convex/react";
import { authClient } from "./auth-client";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);

export function ConvexProvider({
  children,
  initialToken,
}: {
  children: React.ReactNode;
  initialToken?: string | null;
}) {
  return (
    <ConvexBetterAuthProvider
      client={convex}
      authClient={authClient}
      initialToken={initialToken}
    >
      {children}
    </ConvexBetterAuthProvider>
  );
}

export { convex };
```

**Step 13: Update app/client.tsx**

```typescript
import { hydrateRoot } from 'react-dom/client'
import { StartClient } from '@tanstack/start'
import { createRouter } from './router'
import { ConvexProvider } from './lib/convex'
import './styles.css'

const router = createRouter()

hydrateRoot(
  document,
  <ConvexProvider>
    <StartClient router={router} />
  </ConvexProvider>
)
```

**Step 14: Update app/ssr.tsx**

```typescript
import {
  createStartHandler,
  defaultStreamHandler,
} from '@tanstack/start/server'
import { getRouterManifest } from '@tanstack/start/router-manifest'
import { createRouter } from './router'
import { ConvexProvider } from './lib/convex'

export default createStartHandler({
  createRouter,
  getRouterManifest,
})((ctx) => {
  return defaultStreamHandler({
    ...ctx,
    hydrate: (dehydrated) => (
      <ConvexProvider>
        {ctx.hydrate(dehydrated)}
      </ConvexProvider>
    ),
  })
})
```

**Step 15: Add VITE_CONVEX_URL to env files**

```bash
echo "VITE_CONVEX_URL=$(grep NEXT_PUBLIC_CONVEX_URL .env.local | cut -d= -f2)" >> .env.local
```

**Step 16: Run Convex dev to verify setup**

```bash
npx convex dev &
sleep 10
pkill -f "convex dev" || true
```

**Expected:** No errors, Convex functions deployed

**Step 17: Commit**

```bash
git add .
git commit -m "feat: integrate Convex with Better Auth"
```

---

### Task 5: Create Application Schema

**Files:**
- Create: `convex/schema.ts`
- Create: `convex/auth-helpers.ts`
- Modify: `convex/betterAuth/schema.ts` (reference only)

**Step 1: Create convex/auth-helpers.ts**

```typescript
import { ConvexError } from "convex/values";
import type { GenericCtx } from "@convex-dev/better-auth/utils";
import type { DataModel } from "./_generated/dataModel";

export interface AuthContext {
  userId: string;
  orgId: string;
  membership: {
    role: "owner" | "admin" | "member";
    joinedAt: number;
  };
}

export async function requireAuth(
  ctx: GenericCtx<DataModel>
): Promise<AuthContext> {
  const identity = await ctx.auth.getUserIdentity();

  if (!identity) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "You must be signed in",
    });
  }

  // Get active org from Better Auth session
  const orgId = identity.customClaims?.activeOrganizationId as string | undefined;

  if (!orgId) {
    throw new ConvexError({
      code: "NO_ORGANIZATION",
      message: "No active organization selected",
    });
  }

  // Verify membership
  const membership = await ctx.db
    .query("members")
    .withIndex("by_user_org", (q) =>
      q.eq("userId", identity.subject).eq("organizationId", orgId)
    )
    .unique();

  if (!membership) {
    throw new ConvexError({
      code: "NOT_MEMBER",
      message: "You are not a member of this organization",
    });
  }

  return {
    userId: identity.subject,
    orgId,
    membership: {
      role: membership.role as "owner" | "admin" | "member",
      joinedAt: membership.joinedAt,
    },
  };
}

export function requireRole(auth: AuthContext, allowedRoles: string[]) {
  if (!allowedRoles.includes(auth.membership.role)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: `Required role: ${allowedRoles.join(" or ")}`,
    });
  }
}
```

**Step 2: Create convex/schema.ts**

```typescript
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // ═══════════════════════════════════════════════════════════
  // ORGANIZATION EXTENSION
  // ═══════════════════════════════════════════════════════════
  
  // Organizations table (extends Better Auth's)
  organizations: defineTable({
    name: v.string(),
    slug: v.string(),
    logo: v.optional(v.string()),
    metadata: v.optional(v.object({
      plan: v.string(), // "free", "pro", "enterprise"
      stripeCustomerId: v.optional(v.string()),
      stripeSubscriptionId: v.optional(v.string()),
    })),
    ownerId: v.id("users"),
    createdAt: v.number(),
  })
    .index("by_slug", ["slug"])
    .index("by_owner", ["ownerId"]),

  // Members table (Better Auth organizations plugin)
  members: defineTable({
    organizationId: v.id("organizations"),
    userId: v.id("users"),
    role: v.string(), // "owner", "admin", "member"
    joinedAt: v.number(),
    invitedBy: v.optional(v.id("users")),
  })
    .index("by_organization", ["organizationId"])
    .index("by_user", ["userId"])
    .index("by_user_org", ["userId", "organizationId"]),

  // Invitations table (Better Auth organizations plugin)
  invitations: defineTable({
    organizationId: v.id("organizations"),
    email: v.string(),
    role: v.string(),
    token: v.string(),
    expiresAt: v.number(),
    invitedBy: v.id("users"),
    status: v.string(), // "pending", "accepted", "expired", "canceled"
  })
    .index("by_token", ["token"])
    .index("by_organization", ["organizationId"])
    .index("by_email", ["email"]),

  // ═══════════════════════════════════════════════════════════
  // APPLICATION TABLES
  // ═══════════════════════════════════════════════════════════

  // Projects - Example app entity
  projects: defineTable({
    orgId: v.id("organizations"),
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

  // Tasks - Example nested entity
  tasks: defineTable({
    orgId: v.id("organizations"),
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "todo", "in_progress", "done"
    priority: v.string(), // "low", "medium", "high"
    assigneeId: v.optional(v.id("users")),
    createdBy: v.id("users"),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_project", ["projectId"])
    .index("by_assignee", ["orgId", "assigneeId"])
    .index("by_org_status", ["orgId", "status"]),

  // Audit Log - Track important changes
  auditLog: defineTable({
    orgId: v.id("organizations"),
    userId: v.id("users"),
    action: v.string(), // "project.created", "task.updated", etc.
    entityType: v.string(),
    entityId: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_org", ["orgId"])
    .index("by_org_time", ["orgId", "createdAt"]),
});
```

**Step 3: Run Convex dev to deploy schema**

```bash
npx convex dev &
sleep 10
pkill -f "convex dev" || true
```

**Expected:** Schema deployed successfully

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create application schema with multi-tenant tables"
```

---

### Task 6: Create Convex Functions

**Files:**
- Create: `convex/projects.ts`
- Create: `convex/organizations.ts`
- Create: `convex/users.ts`

**Step 1: Create convex/projects.ts**

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth-helpers";

// ═══════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════

export const list = query({
  handler: async (ctx) => {
    const { orgId } = await requireAuth(ctx);

    return await ctx.db
      .query("projects")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .order("desc")
      .take(100);
  },
});

export const get = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const { orgId } = await requireAuth(ctx);

    const project = await ctx.db.get(projectId);

    if (!project || project.orgId !== orgId) {
      throw new Error("Project not found");
    }

    return project;
  },
});

export const getWithTasks = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const { orgId } = await requireAuth(ctx);

    const project = await ctx.db.get(projectId);
    if (!project || project.orgId !== orgId) {
      throw new Error("Project not found");
    }

    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect();

    return { project, tasks };
  },
});

// ═══════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════

export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);
    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      orgId: auth.orgId,
      name: args.name,
      description: args.description,
      status: "active",
      createdBy: auth.userId,
      updatedBy: auth.userId,
      createdAt: now,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLog", {
      orgId: auth.orgId,
      userId: auth.userId,
      action: "project.created",
      entityType: "project",
      entityId: projectId,
      metadata: { name: args.name },
      createdAt: now,
    });

    return projectId;
  },
});

export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    const existing = await ctx.db.get(args.projectId);
    if (!existing || existing.orgId !== auth.orgId) {
      throw new Error("Project not found");
    }

    // Only admins can archive projects
    if (args.status === "archived") {
      requireRole(auth, ["owner", "admin"]);
    }

    const now = Date.now();

    await ctx.db.patch(args.projectId, {
      ...(args.name && { name: args.name }),
      ...(args.description !== undefined && { description: args.description }),
      ...(args.status && { status: args.status }),
      updatedBy: auth.userId,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLog", {
      orgId: auth.orgId,
      userId: auth.userId,
      action: "project.updated",
      entityType: "project",
      entityId: args.projectId,
      metadata: { changes: { name: args.name, status: args.status } },
      createdAt: now,
    });

    return args.projectId;
  },
});

export const remove = mutation({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    const auth = await requireAuth(ctx);

    // Only owners/admins can delete
    requireRole(auth, ["owner", "admin"]);

    const existing = await ctx.db.get(projectId);
    if (!existing || existing.orgId !== auth.orgId) {
      throw new Error("Project not found");
    }

    // Soft delete - update status
    const now = Date.now();
    await ctx.db.patch(projectId, {
      status: "archived",
      updatedBy: auth.userId,
      updatedAt: now,
    });

    // Audit log
    await ctx.db.insert("auditLog", {
      orgId: auth.orgId,
      userId: auth.userId,
      action: "project.archived",
      entityType: "project",
      entityId: projectId,
      metadata: { name: existing.name },
      createdAt: now,
    });

    return projectId;
  },
});
```

**Step 2: Create convex/organizations.ts**

```typescript
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";
import { requireAuth, requireRole } from "./auth-helpers";

// ═══════════════════════════════════════════════════════════
// QUERIES
// ═══════════════════════════════════════════════════════════

export const listForUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .collect();

    const orgs = await Promise.all(
      memberships.map((m) => ctx.db.get(m.organizationId))
    );

    return orgs
      .filter(Boolean)
      .map((org, i) => ({
        ...org!,
        membershipRole: memberships[i].role,
      }));
  },
});

export const getCurrent = query({
  handler: async (ctx) => {
    const { orgId } = await requireAuth(ctx);
    return await ctx.db.get(orgId);
  },
});

export const getMembers = query({
  handler: async (ctx) => {
    const { orgId } = await requireAuth(ctx);

    const memberships = await ctx.db
      .query("members")
      .withIndex("by_organization", (q) => q.eq("organizationId", orgId))
      .collect();

    const members = await Promise.all(
      memberships.map(async (m) => {
        const user = await ctx.db.get(m.userId);
        return {
          ...m,
          user: user
            ? {
                id: user._id,
                name: user.name,
                email: user.email,
                image: user.image,
              }
            : null,
        };
      })
    );

    return members;
  },
});

// ═══════════════════════════════════════════════════════════
// MUTATIONS
// ═══════════════════════════════════════════════════════════

export const update = mutation({
  args: {
    name: v.optional(v.string()),
    logo: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);
    requireRole(auth, ["owner", "admin"]);

    await ctx.db.patch(auth.orgId, {
      ...(args.name && { name: args.name }),
      ...(args.logo !== undefined && { logo: args.logo }),
    });

    return auth.orgId;
  },
});

export const removeMember = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const auth = await requireAuth(ctx);
    requireRole(auth, ["owner", "admin"]);

    // Cannot remove owner
    if (userId === auth.userId) {
      throw new Error("Cannot remove yourself");
    }

    const membership = await ctx.db
      .query("members")
      .withIndex("by_user_org", (q) =>
        q.eq("userId", userId).eq("organizationId", auth.orgId)
      )
      .unique();

    if (membership) {
      await ctx.db.delete(membership._id);
    }

    return userId;
  },
});
```

**Step 3: Create convex/users.ts**

```typescript
import { query } from "./_generated/server";

export const getCurrent = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db.get(identity.subject as any);
    return user;
  },
});

export const getCurrentWithOrg = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db.get(identity.subject as any);
    if (!user) return null;

    // Get active org from session
    const orgId = identity.customClaims?.activeOrganizationId as string | undefined;
    
    let organization = null;
    let membership = null;

    if (orgId) {
      organization = await ctx.db.get(orgId);
      const membershipDoc = await ctx.db
        .query("members")
        .withIndex("by_user_org", (q) =>
          q.eq("userId", identity.subject).eq("organizationId", orgId)
        )
        .unique();
      
      if (membershipDoc) {
        membership = {
          role: membershipDoc.role,
          joinedAt: membershipDoc.joinedAt,
        };
      }
    }

    return {
      user,
      organization,
      membership,
    };
  },
});
```

**Step 4: Run Convex dev to deploy functions**

```bash
npx convex dev &
sleep 10
pkill -f "convex dev" || true
```

**Expected:** All functions deployed successfully

**Step 5: Commit**

```bash
git add .
git commit -m "feat: create Convex queries and mutations"
```

---

## Phase 3: Configuration System

### Task 7: Create Config-Driven Architecture

**Files:**
- Create: `app/config/app.config.ts`
- Create: `app/hooks/use-app-config.ts`
- Create: `app/lib/navigation.ts`

**Step 1: Create app/config/app.config.ts**

```typescript
export const appConfig = {
  // Identity & Branding
  name: 'Vertex',
  description: 'Multi-tenant SaaS boilerplate',
  
  // Layout Configuration
  layout: {
    mode: 'sidebar' as const,
    sidebarCollapsible: true,
    showBreadcrumbs: true,
  },
  
  // Feature Flags
  features: {
    // Marketing pages
    landing: true,
    pricing: true,
    
    // Multi-tenancy
    multiTenant: true,
    allowPersonalAccounts: false,
    
    // Business logic
    billing: false, // Enable when Polar.sh is configured
    invitations: true,
    rbac: true,
    
    // App features
    projects: true,
    tasks: true,
  },
  
  // Auth Configuration
  auth: {
    providers: ['github'] as const,
    allowEmailPassword: true,
    requireEmailVerification: true,
  },
} as const;

export type AppConfig = typeof appConfig;
export type FeatureFlags = AppConfig['features'];
```

**Step 2: Create app/hooks/use-app-config.ts**

```typescript
import { appConfig, type FeatureFlags } from '@/config/app.config';

export function useAppConfig() {
  return appConfig;
}

export function useFeatures(): FeatureFlags {
  return appConfig.features;
}

export function useFeature<K extends keyof FeatureFlags>(
  feature: K
): FeatureFlags[K] {
  return appConfig.features[feature];
}
```

**Step 3: Create app/lib/navigation.ts**

```typescript
import { appConfig } from '@/config/app.config';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
  feature?: keyof typeof appConfig.features;
  children?: NavItem[];
}

export const mainNavigation: NavItem[] = [
  { label: 'Dashboard', href: '/app', icon: 'Home' },
  { 
    label: 'Projects', 
    href: '/app/projects', 
    icon: 'Folder',
    feature: 'projects'
  },
  { 
    label: 'Tasks', 
    href: '/app/tasks', 
    icon: 'CheckSquare',
    feature: 'tasks'
  },
].filter(item => !item.feature || appConfig.features[item.feature]);

export const workspaceNavigation: NavItem[] = [
  { 
    label: 'Members', 
    href: '/settings/organization', 
    icon: 'Users',
    feature: 'multiTenant'
  },
  { 
    label: 'Billing', 
    href: '/settings/billing', 
    icon: 'CreditCard',
    feature: 'billing'
  },
  { label: 'Settings', href: '/settings', icon: 'Settings' },
].filter(item => !item.feature || appConfig.features[item.feature]);

export const userNavigation: NavItem[] = [
  { label: 'Profile', href: '/settings', icon: 'User' },
  { label: 'Sign out', href: '/logout', icon: 'LogOut' },
];
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create config-driven architecture"
```

---

## Phase 4: Core UI Components

### Task 8: Create Navigation Components

**Files:**
- Create: `app/components/navigation/sidebar.tsx`
- Create: `app/components/navigation/sidebar-header.tsx`
- Create: `app/components/navigation/sidebar-nav.tsx`
- Create: `app/components/navigation/org-switcher.tsx`
- Create: `app/components/navigation/user-menu.tsx`

**Step 1: Install additional shadcn components**

```bash
pnpm dlx shadcn@latest add avatar separator skeleton -y
pnpm dlx shadcn@latest add dropdown-menu -y
pnpm add lucide-react
```

**Step 2: Create app/components/navigation/sidebar.tsx**

```typescript
import { cn } from '@/lib/utils';
import { SidebarHeader } from './sidebar-header';
import { SidebarNav } from './sidebar-nav';
import { SidebarFooter } from './sidebar-footer';

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside
      className={cn(
        'flex flex-col h-screen w-64 border-r bg-sidebar',
        className
      )}
    >
      <SidebarHeader />
      <SidebarNav className="flex-1 overflow-auto py-4" />
      <SidebarFooter />
    </aside>
  );
}
```

**Step 3: Create app/components/navigation/sidebar-header.tsx**

```typescript
import { useQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { OrgSwitcher } from './org-switcher';
import { useFeature } from '@/hooks/use-app-config';

export function SidebarHeader() {
  const multiTenant = useFeature('multiTenant');
  const { data: org } = useQuery(api.organizations.getCurrent);

  return (
    <div className="flex h-14 items-center border-b px-4">
      {multiTenant ? (
        <OrgSwitcher />
      ) : (
        <span className="font-semibold">{org?.name || 'My App'}</span>
      )}
    </div>
  );
}
```

**Step 4: Create app/components/navigation/sidebar-nav.tsx**

```typescript
import { cn } from '@/lib/utils';
import { Link, useLocation } from '@tanstack/react-router';
import { mainNavigation, workspaceNavigation } from '@/lib/navigation';
import * as Icons from 'lucide-react';

interface SidebarNavProps {
  className?: string;
}

export function SidebarNav({ className }: SidebarNavProps) {
  const location = useLocation();

  const NavLink = ({ item }: { item: typeof mainNavigation[0] }) => {
    const Icon = (Icons as any)[item.icon || 'Circle'];
    const isActive = location.pathname === item.href ||
      location.pathname.startsWith(`${item.href}/`);

    return (
      <Link
        to={item.href}
        className={cn(
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
          isActive
            ? 'bg-accent text-accent-foreground'
            : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
        )}
      >
        {Icon && <Icon className="h-4 w-4" />}
        {item.label}
      </Link>
    );
  };

  return (
    <nav className={cn('flex flex-col gap-1 px-2', className)}>
      <div className="space-y-1">
        {mainNavigation.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>

      {workspaceNavigation.length > 0 && (
        <>
          <div className="my-4 px-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Workspace
            </div>
          </div>
          <div className="space-y-1">
            {workspaceNavigation.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </div>
        </>
      )}
    </nav>
  );
}
```

**Step 5: Create app/components/navigation/org-switcher.tsx**

```typescript
import { useQuery, useQueryClient } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { authClient } from '@/lib/auth-client';
import { navigate } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';

export function OrgSwitcher() {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const organizations = useQuery(api.organizations.listForUser);
  const { switchOrganization, isPending } = authClient.useOrganization();

  const activeOrgId = session?.activeOrganizationId;
  const activeOrg = organizations?.find((o) => o._id === activeOrgId);

  const handleSwitch = async (orgId: string) => {
    await switchOrganization(orgId);
    queryClient.clear();
    navigate({ to: '/app' });
  };

  if (!organizations?.length) {
    return (
      <Button variant="ghost" className="w-full justify-start">
        <span className="truncate">No organizations</span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="w-full justify-between"
          disabled={isPending}
        >
          <div className="flex items-center gap-2">
            <Avatar className="h-5 w-5">
              {activeOrg?.logo ? (
                <img src={activeOrg.logo} alt={activeOrg.name} />
              ) : (
                <AvatarFallback className="text-xs">
                  {activeOrg?.name?.[0] || '?'}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="truncate">{activeOrg?.name || 'Select org'}</span>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>Organizations</DropdownMenuLabel>

        {organizations.map((org) => (
          <DropdownMenuItem
            key={org._id}
            onClick={() => handleSwitch(org._id)}
            className="flex items-center gap-2"
          >
            <Avatar className="h-5 w-5">
              {org.logo ? (
                <img src={org.logo} alt={org.name} />
              ) : (
                <AvatarFallback className="text-xs">
                  {org.name[0]}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="flex-1 truncate">{org.name}</span>
            {activeOrgId === org._id && (
              <Check className="h-4 w-4" />
            )}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={() => navigate({ to: '/settings/organization/new' })}
        >
          <Plus className="mr-2 h-4 w-4" />
          Create organization
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Step 6: Create app/components/navigation/sidebar-footer.tsx**

```typescript
import { useQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { UserMenu } from './user-menu';

export function SidebarFooter() {
  const { data: userData } = useQuery(api.users.getCurrentWithOrg);

  return (
    <div className="border-t p-4">
      <UserMenu user={userData?.user || null} />
    </div>
  );
}
```

**Step 7: Create app/components/navigation/user-menu.tsx**

```typescript
import { Link, navigate } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import type { Doc } from '@convex/_generated/dataModel';

interface UserMenuProps {
  user: Doc<'users'> | null;
}

export function UserMenu({ user }: UserMenuProps) {
  const handleSignOut = async () => {
    await authClient.signOut();
    navigate({ to: '/auth/login' });
  };

  if (!user) {
    return (
      <Button variant="ghost" className="w-full" asChild>
        <Link to="/auth/login">Sign in</Link>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={user.image || undefined} />
            <AvatarFallback>{user.name?.[0] || user.email[0]}</AvatarFallback>
          </Avatar>
          <span className="truncate">{user.name || user.email}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel>{user.email}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link to="/settings">
            <User className="mr-2 h-4 w-4" />
            Profile
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link to="/settings">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

**Step 8: Commit**

```bash
git add .
git commit -m "feat: create navigation components"
```

---

### Task 9: Create Layout Components

**Files:**
- Create: `app/routes/(app)/_layout.tsx`
- Create: `app/routes/(app)/index.tsx`
- Create: `app/routes/_authed.tsx`

**Step 1: Create app/routes/_authed.tsx**

```typescript
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { authClient } from '@/lib/auth-client';
import { useConvexAuth } from '@convex-dev/better-auth/react';

export const Route = createFileRoute('/_authed')({
  component: AuthedLayout,
});

function AuthedLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" />;
  }

  return <Outlet />;
}
```

**Step 2: Create app/routes/(app)/_layout.tsx**

```typescript
import { createFileRoute, Outlet } from '@tanstack/react-router';
import { Sidebar } from '@/components/navigation/sidebar';

export const Route = createFileRoute('/(app)/_layout')({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
```

**Step 3: Create app/routes/(app)/index.tsx**

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from '@tanstack/react-router';
import { Folder, CheckSquare } from 'lucide-react';

export const Route = createFileRoute('/(app)/_layout/')({
  component: DashboardPage,
});

function DashboardPage() {
  const { data: userData } = useQuery(api.users.getCurrentWithOrg);
  const projects = useQuery(api.projects.list);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back{userData?.user?.name ? `, ${userData.user.name}` : ''}
        </h1>
        <p className="text-muted-foreground">
          {userData?.organization?.name || 'Your workspace'}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Projects
            </CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{projects?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Tasks
            </CardTitle>
            <CheckSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">--</div>
          </CardContent>
        </Card>
      </div>

      <div className="flex gap-4">
        <Button asChild>
          <Link to="/app/projects">View Projects</Link>
        </Button>
      </div>
    </div>
  );
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create app layout and dashboard"
```

---

### Task 10: Create Auth Pages

**Files:**
- Create: `app/routes/auth/route.tsx`
- Create: `app/routes/auth/login.tsx`
- Create: `app/routes/auth/register.tsx`

**Step 1: Create app/routes/auth/route.tsx**

```typescript
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { useConvexAuth } from '@convex-dev/better-auth/react';

export const Route = createFileRoute('/auth')({
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated, isLoading } = useConvexAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/app" />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/50 p-4">
      <div className="w-full max-w-sm">
        <Outlet />
      </div>
    </div>
  );
}
```

**Step 2: Create app/routes/auth/login.tsx**

```typescript
import { createFileRoute, Link, navigate } from '@tanstack/react-router';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
});

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.signIn.email({
        email,
        password,
        callbackURL: '/app',
      });

      if (result.error) {
        setError(result.error.message || 'Failed to sign in');
      } else {
        navigate({ to: '/app' });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/app',
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Sign in</CardTitle>
        <CardDescription>
          Enter your email and password to access your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGithubSignIn}
          type="button"
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground">
          Don't have an account?{' '}
          <Link to="/auth/register" className="text-primary hover:underline">
            Sign up
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
```

**Step 3: Create app/routes/auth/register.tsx**

```typescript
import { createFileRoute, Link, navigate } from '@tanstack/react-router';
import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Github } from 'lucide-react';

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
});

function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL: '/app',
      });

      if (result.error) {
        setError(result.error.message || 'Failed to create account');
      } else {
        navigate({ to: '/app' });
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    await authClient.signIn.social({
      provider: 'github',
      callbackURL: '/app',
    });
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>
          Enter your details below to create your account
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <div className="text-sm text-destructive">{error}</div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGithubSignIn}
          type="button"
        >
          <Github className="mr-2 h-4 w-4" />
          Continue with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Creating account...' : 'Create account'}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-2">
        <div className="text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link to="/auth/login" className="text-primary hover:underline">
            Sign in
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
```

**Step 4: Commit**

```bash
git add .
git commit -m "feat: create auth pages"
```

---

### Task 11: Create Settings Page

**Files:**
- Create: `app/routes/settings/_layout.tsx`
- Create: `app/routes/settings/index.tsx`

**Step 1: Create app/routes/settings/_layout.tsx**

```typescript
import { createFileRoute, Link, Outlet, useLocation } from '@tanstack/react-router';
import { cn } from '@/lib/utils';
import { useFeatures } from '@/hooks/use-app-config';

export const Route = createFileRoute('/settings/_layout')({
  component: SettingsLayout,
});

function SettingsLayout() {
  const location = useLocation();
  const features = useFeatures();

  const tabs = [
    { label: 'Profile', href: '/settings' },
    ...(features.multiTenant
      ? [{ label: 'Organization', href: '/settings/organization' }]
      : []),
    ...(features.billing
      ? [{ label: 'Billing', href: '/settings/billing' }]
      : []),
    { label: 'Security', href: '/settings/security' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account and organization settings
        </p>
      </div>

      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="lg:w-1/5">
          <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
            {tabs.map((tab) => (
              <Link
                key={tab.href}
                to={tab.href}
                className={cn(
                  'inline-flex items-center whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  location.pathname === tab.href
                    ? 'bg-muted text-foreground'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                )}
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </aside>

        <div className="flex-1 lg:max-w-2xl">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
```

**Step 2: Create app/routes/settings/index.tsx**

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';
import { useQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export const Route = createFileRoute('/settings/_layout/')({
  component: ProfileSettings,
});

function ProfileSettings() {
  const { data: userData } = useQuery(api.users.getCurrentWithOrg);
  const user = userData?.user;

  const [name, setName] = useState(user?.name || '');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // TODO: Implement profile update
    setTimeout(() => setIsLoading(false), 500);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>
            This is how others will see you on the platform.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.image || undefined} />
              <AvatarFallback className="text-lg">
                {user?.name?.[0] || user?.email?.[0] || '?'}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              Change avatar
            </Button>
          </div>

          <Separator />

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={user?.email || ''}
                disabled
              />
              <p className="text-sm text-muted-foreground">
                Your email address is managed by your authentication provider.
              </p>
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : 'Save changes'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

**Step 3: Commit**

```bash
git add .
git commit -m "feat: create settings page"
```

---

### Task 12: Create Projects Feature

**Files:**
- Create: `app/routes/(app)/projects/index.tsx`
- Create: `app/components/projects/project-card.tsx`
- Create: `app/components/projects/create-project-dialog.tsx`

**Step 1: Install dialog component**

```bash
pnpm dlx shadcn@latest add dialog -y
```

**Step 2: Create app/components/projects/project-card.tsx**

```typescript
import { Link } from '@tanstack/react-router';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Folder } from 'lucide-react';
import type { Doc } from '@convex/_generated/dataModel';

interface ProjectCardProps {
  project: Doc<'projects'>;
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link to={`/app/projects/${project._id}`}>
      <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
        <CardHeader className="flex flex-row items-start gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
            <Folder className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base">{project.name}</CardTitle>
            {project.description && (
              <CardDescription className="line-clamp-2">
                {project.description}
              </CardDescription>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
            {project.status}
          </Badge>
        </CardContent>
      </Card>
    </Link>
  );
}
```

**Step 3: Create app/components/projects/create-project-dialog.tsx**

```typescript
import { useState } from 'react';
import { useMutation } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

export function CreateProjectDialog() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  
  const queryClient = useQueryClient();
  const createProject = useMutation(api.projects.create);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    await createProject.mutateAsync({
      name,
      description: description || undefined,
    });
    
    queryClient.invalidateQueries({ queryKey: [api.projects.list] });
    
    setName('');
    setDescription('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Project
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create Project</DialogTitle>
            <DialogDescription>
              Create a new project to organize your work.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Project name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Project description (optional)"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={createProject.isPending}>
              {createProject.isPending ? 'Creating...' : 'Create'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

**Step 4: Create app/routes/(app)/projects/index.tsx**

```typescript
import { createFileRoute } from '@tanstack/react-router';
import { useQuery } from '@convex-dev/react-query';
import { api } from '@convex/_generated/api';
import { ProjectCard } from '@/components/projects/project-card';
import { CreateProjectDialog } from '@/components/projects/create-project-dialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Folder } from 'lucide-react';

export const Route = createFileRoute('/(app)/_layout/projects/')({
  component: ProjectsPage,
});

function ProjectsPage() {
  const projects = useQuery(api.projects.list);

  if (projects === undefined) {
    return <ProjectsSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
          <p className="text-muted-foreground">
            Manage your projects and collaborate with your team.
          </p>
        </div>
        <CreateProjectDialog />
      </div>

      {projects.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProjectsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="h-4 w-64 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="opacity-50">
            <CardHeader className="flex flex-row items-start gap-4">
              <div className="h-10 w-10 animate-pulse rounded-lg bg-muted" />
              <div className="flex-1 space-y-2">
                <div className="h-5 w-32 animate-pulse rounded bg-muted" />
                <div className="h-4 w-full animate-pulse rounded bg-muted" />
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <Folder className="h-6 w-6 text-muted-foreground" />
        </div>
        <CardTitle className="mt-4">No projects yet</CardTitle>
        <CardDescription>
          Get started by creating your first project.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <CreateProjectDialog />
      </CardContent>
    </Card>
  );
}
```

**Step 5: Install badge and textarea components**

```bash
pnpm dlx shadcn@latest add badge textarea -y
```

**Step 6: Commit**

```bash
git add .
git commit -m "feat: create projects feature"
```

---

## Phase 5: Testing & Verification

### Task 13: Test Complete Application

**Step 1: Start dev servers**

```bash
# Terminal 1 - Convex
npx convex dev

# Terminal 2 - App
pnpm dev
```

**Step 2: Manual testing checklist**

Open http://localhost:3000 and verify:

- [ ] Landing page loads
- [ ] Navigation to /auth/login works
- [ ] Can create account with email/password
- [ ] Can sign in with created account
- [ ] Dashboard loads with user name
- [ ] Organization switcher shows current org
- [ ] Can create a project
- [ ] Projects list updates in real-time
- [ ] Settings page loads with tabs
- [ ] Sign out works and redirects to login

**Step 3: Run type checking**

```bash
pnpm typecheck
```

**Expected:** No TypeScript errors

**Step 4: Commit**

```bash
git add .
git commit -m "chore: complete boilerplate implementation"
```

---

## Summary

This implementation plan creates a fully functional, configurable multi-tenant SaaS boilerplate with:

1. **TanStack Start** - Type-safe routing and SSR
2. **Convex + Better Auth** - Real-time database with auth & organizations
3. **Shadcn UI v2 + Tailwind CSS v4** - Modern, customizable components
4. **Config-driven architecture** - Feature flags for flexible deployment
5. **Vercel-style navigation** - Sidebar with org switcher
6. **Complete auth flow** - Login, register, OAuth
7. **Example features** - Projects with CRUD operations

**Next Steps:**
- Configure Polar.sh for billing (when ready)
- Add more app features (tasks, analytics)
- Add comprehensive tests
- Deploy to production
