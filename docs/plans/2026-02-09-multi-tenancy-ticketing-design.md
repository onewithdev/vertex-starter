# Multi-Tenancy & Ticketing System Design

## Overview

This document outlines the architecture for making the SaaS boilerplate support multiple tenancy modes (B2B, B2C, Hybrid) with a ticketing system as the first vertical slice for testing multi-tenant data isolation.

---

## 1. Multi-Tenancy Architecture

### Core Principle

All application data belongs to an `organizationId`. Every query is scoped to the current active organization:

```sql
-- Pattern for all queries
WHERE organizationId = <current_active_org_id>
```

### Tenancy Models Supported

| Mode | Description | Use Case |
|------|-------------|----------|
| `b2b` | Organizations are companies/teams | Slack, Linear, Asana |
| `b2c` | Organizations are personal workspaces | Notion (personal), Apple Notes |
| `hybrid` | Both personal + work orgs | Linear, GitHub, Vercel |

### Organization Types

- **Team Org**: Multiple members, invitation-based
- **Personal Org**: Single member (the creator), auto-created for B2C mode

---

## 2. Feature Flag Configuration

```typescript
// src/config/app.config.ts
export const appConfig = {
  multiTenancy: {
    mode: 'hybrid',                    // 'b2b' | 'b2c' | 'hybrid'
    allowMultipleOrgs: true,           // Can user belong to multiple orgs?
    autoCreatePersonalOrg: true,       // Auto-create personal org on signup
    allowOrgCreation: true,            // Can users create new orgs?
    requireOrg: true,                  // Must have active org to use app?
    allowPersonalOrgs: true,           // Allow single-member orgs?
    maxOrgsPerUser: 10,                // Limit for hybrid mode
  },
  ticketing: {
    enabled: true,
    allowPublicTickets: true,          // Can users publish to community?
  }
}
```

### Mode-Specific Behavior

| Feature | B2B | B2C | Hybrid |
|---------|-----|-----|--------|
| Org creation UI | Prominent | Hidden | Available |
| Team invites | Required | Hidden | Optional |
| Personal orgs | No | Yes | Yes |
| Multi-org UI | Yes | No | Yes |
| Onboarding flow | Create/join org | Auto-create personal | Choice |

---

## 3. Data Model (Elephant Carpaccio)

### Phase 1: Existing (Better Auth)
```typescript
// Managed by Better Auth
- user
- session
- organization
- member
- invitation
```

### Phase 2: Ticketing (Slice 5)
```typescript
// convex/schema.ts additions
tickets: defineTable({
  organizationId: v.id("organization"),  // Tenant isolation
  userId: v.id("user"),                   // Creator
  title: v.string(),
  description: v.string(),
  status: v.union(
    v.literal("open"),
    v.literal("in_progress"),
    v.literal("resolved"),
    v.literal("closed")
  ),
  priority: v.union(
    v.literal("low"),
    v.literal("medium"),
    v.literal("high")
  ),
  isPublic: v.boolean(),                  // Community visibility
  resolution: v.optional(v.string()),     // Final resolution notes
  createdAt: v.number(),
  updatedAt: v.number(),
})
.index("by_organization", ["organizationId"])
.index("by_organization_status", ["organizationId", "status"])
.index("by_user", ["userId"])
.index("by_public", ["isPublic", "createdAt"])
.index("by_public_status", ["isPublic", "status", "createdAt"])
```

### Query Patterns

| Query | Index | Purpose |
|-------|-------|---------|
| My Tickets (Settings) | `by_organization` | Org-scoped, tests isolation |
| My Tickets + filter | `by_organization_status` | Status filtering |
| Community | `by_public` | Cross-org, public only |
| Community + filter | `by_public_status` | Open public tickets |

---

## 4. User Flows by Mode

### B2B Flow
```
Signup → Create Org OR Join via Invite → Dashboard
                 ↓
        (Cannot proceed without org)
```

### B2C Flow
```
Signup → Auto-create "Personal" Org → Dashboard
              ↓
    (Hidden, user doesn't think about orgs)
```

### Hybrid Flow
```
Signup → Choice: Personal | Create Team | Join Team → Dashboard
              ↓
    (Can have multiple orgs, switch anytime)
```

---

## 5. Ticketing System Specification

### 5.1 My Tickets (Settings)

**Location**: `/settings/support` or `/settings/tickets`

**Features**:
- List tickets for current organization only
- Create new ticket (auto-sets org from context)
- View ticket detail
- Reply/comment on ticket
- Close/reopen own tickets

**Access Control**:
- Must be authenticated
- Must have active organization
- Can only see tickets where `organizationId = currentOrgId`

### 5.2 Community Page

**Location**: `/community` or `/tickets`

**Features**:
- List all public tickets (cross-organization)
- Filter by status, priority
- View ticket details
- Upvote/helpful marking (future)

**Access Control**:
- Public: Read-only for non-authenticated
- Authenticated: Can create public tickets if `allowPublicTickets: true`

### 5.3 Create Ticket Flow

```
┌─────────────────┐
│  Create Ticket  │
└────────┬────────┘
         │
    ┌────┴────┐
    ↓         ↓
 Private   Public
 (org)    (community)
    │         │
    └────┬────┘
         ↓
  organizationId = currentOrgId
  userId = currentUserId
  isPublic = selected
```

---

## 6. Implementation Sequence (Elephant Carpaccio)

### Slice 1: Working Navigation & Layout
**Goal**: Navigation that responds to org context

**Deliverables**:
- Sticky navbar implementation
- Org switcher in sidebar (functional)
- Active route highlighting
- Mobile drawer sidebar
- Show current org name/logo in header

**Files**:
- `src/components/navigation/sidebar.tsx`
- `src/components/navigation/org-switcher.tsx`
- `src/components/navigation/navbar.tsx`

---

### Slice 2: Organization Lifecycle
**Goal**: Users can create, switch, and manage orgs

**Deliverables**:
- Org creation modal
- Org switching (updates active org in session)
- "No org" state handling
- Onboarding flow based on `mode` config
  - B2B: Force org creation/join
  - B2C: Auto-create personal org
  - Hybrid: Choice screen

**Convex Functions**:
- `organizations.create`
- `organizations.setActive`
- `organizations.listMyOrgs`

**Routes**:
- `/onboarding` - Mode-aware onboarding
- `/app` - Requires org (if `requireOrg: true`)

---

### Slice 3: Landing Page
**Goal**: Marketing site at root

**Deliverables**:
- `/` becomes landing page
- Move dashboard to `/app`
- Hero section with CTAs
- Feature highlights
- Footer with links

**Routes Restructure**:
- `/` → Landing
- `/pricing` → Pricing (placeholder for Slice 4)
- `/app` → Dashboard (moved from `/`)
- `/auth/*` → Auth (unchanged)

---

### Slice 4: Pricing + Polar.sh Integration
**Goal**: Monetization ready

**Deliverables**:
- `/pricing` page with tiers
- Polar.sh checkout links
- Subscription status in org settings
- "Upgrade" CTAs in UI

**Config**:
```typescript
billing: {
  provider: 'polar.sh',
  productId: '...',
  tiers: [
    { id: 'free', name: 'Free', price: 0 },
    { id: 'pro', name: 'Pro', price: 29 },
    { id: 'team', name: 'Team', price: 99 },
  ]
}
```

---

### Slice 5: Ticketing System (Multi-Tenancy Test)
**Goal**: Verify org isolation works

**Deliverables**:
- Database: `tickets` table
- Convex functions (org-scoped)
- Settings UI: My Tickets list
- Settings UI: Create ticket form
- Community page: Public tickets list

**Convex Functions**:
```typescript
// Org-scoped (enforces tenancy)
tickets.listMyOrg      // Query - by_organization
tickets.create         // Mutation - sets org from context
tickets.get            // Query - verifies org ownership
tickets.update         // Mutation - verifies org ownership

// Cross-org (public only)
tickets.listPublic     // Query - by_public index
```

**Routes**:
- `/settings/tickets` - My tickets (org-scoped)
- `/settings/tickets/new` - Create ticket
- `/settings/tickets/$ticketId` - Ticket detail
- `/community` - Community tickets (public)

**Test Scenarios**:
1. User A in Org 1 creates ticket → Only Org 1 members see it
2. User B in Org 2 cannot see User A's private tickets
3. User A publishes ticket → Visible on community page
4. User B sees User A's public ticket on community

---

### Slice 6: Team Management
**Goal**: Invite and manage team members

**Deliverables**:
- Invite member by email
- Pending invitations list
- Member list with roles
- Remove members
- Accept invite flow

**Convex Functions**:
- `members.invite`
- `members.list`
- `members.remove`
- `invitations.accept`

**Routes**:
- `/settings/team` - Member management

---

### Slice 7: Billing Management
**Goal**: Full billing lifecycle

**Deliverables**:
- Current plan display in settings
- Usage stats (if applicable)
- Polar.sh billing portal link
- Invoice history
- Cancel/downgrade flow

**Routes**:
- `/settings/billing` - Billing management

---

## 7. Security Considerations

### Data Isolation Rules

Every query/mutation must:
1. Get current user from auth
2. Get active organization from session
3. Verify user is member of that org
4. Filter all data by `organizationId`

### Example Security Pattern

```typescript
// convex/tickets.ts
export const list = query({
  args: {},
  handler: async (ctx) => {
    const auth = await requireAuth(ctx);
    // requireAuth returns:
    // - userId
    // - organizationId (from active org)
    // - role (in that org)
    
    return ctx.db
      .query("tickets")
      .withIndex("by_organization", q => 
        q.eq("organizationId", auth.organizationId)
      )
      .collect();
  }
});
```

### Public Data Exception

Community page queries bypass org check but:
- Only return `isPublic: true` records
- No write operations allowed
- Rate limited

---

## 8. UI/UX Patterns

### Organization Context

Always visible:
- Current org name in sidebar header
- Org avatar/logo
- Quick switcher dropdown

### Empty States

| State | Message |
|-------|---------|
| No org (B2B) | "Create or join an organization to continue" |
| No tickets | "No tickets yet. Create your first one." |
| No public tickets | "No community tickets yet." |

### Permission-Based UI

```typescript
// Hide/show based on role
{auth.role === 'owner' && <DeleteOrgButton />}
{appConfig.multiTenancy.allowOrgCreation && <CreateOrgButton />}
```

---

## 9. Testing Strategy

### Unit Tests
- Convex functions with mocked auth context
- Config-based feature flag logic

### Integration Tests
- Org creation flow
- Ticket CRUD with tenancy verification
- Mode-specific UI behavior

### Manual Test Matrix

| Scenario | B2B | B2C | Hybrid |
|----------|-----|-----|--------|
| New user signup | Create org required | Auto personal org | Choice |
| Can create 2nd org | Yes | N/A | Yes |
| Can join org | Yes | N/A | Yes |
| See org switcher | Yes | No | If 2+ orgs |

---

## 10. Future Considerations

Not in scope but design should accommodate:

- **Sub-organizations**: Teams within orgs
- **Custom roles**: Beyond owner/admin/member
- **Audit logging**: Track who did what
- **Data export**: GDPR compliance
- **Webhooks**: External integrations per org

---

## Open Questions

1. Should we support org-level feature flags? (e.g., certain orgs get beta features)
2. How do we handle org deletion? (Soft delete vs hard delete)
3. Should personal orgs be convertible to team orgs?
4. Do we need org-level custom domains?
