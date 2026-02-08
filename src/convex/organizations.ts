import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import { requireAuth, requireRole, createAuditLog } from "./auth-helpers";
import { authComponent } from "./auth";

/**
 * List all organizations for the current user with membership details
 */
export const listForUser = query({
  args: {},
  handler: async (ctx) => {
    // Use safeGetAuthUser to handle unauthenticated users gracefully
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return [];
    }

    // Get all memberships for this user
    const memberships = await ctx.db
      .query("member")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    // Fetch organization details for each membership
    const organizationsWithRole = await Promise.all(
      memberships.map(async (membership) => {
        const organization = await ctx.db.get(membership.organizationId);
        return {
          organization,
          membershipRole: membership.role,
          joinedAt: membership.createdAt,
        };
      })
    );

    return organizationsWithRole;
  },
});

/**
 * Get the current active organization
 */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const auth = await requireAuth(ctx);

    const organization = await ctx.db.get(auth.organizationId);

    if (!organization) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    return organization;
  },
});

/**
 * Get all members of the current organization with user details
 */
export const getMembers = query({
  args: {},
  handler: async (ctx) => {
    const auth = await requireAuth(ctx);

    // Get all memberships for this organization
    const memberships = await ctx.db
      .query("member")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", auth.organizationId)
      )
      .collect();

    // Fetch user details for each membership
    const membersWithUserDetails = await Promise.all(
      memberships.map(async (membership) => {
        const user = await ctx.db.get(membership.userId);
        return {
          ...membership,
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

    return membersWithUserDetails;
  },
});

/**
 * Update a member's role (owner or admin only)
 */
export const updateMember = mutation({
  args: {
    memberId: v.id("member"),
    role: v.string(),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    // Require owner or admin role
    requireRole(auth, ["owner", "admin"]);

    // Get the membership to update
    const membership = await ctx.db.get(args.memberId);

    if (!membership) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Member not found",
      });
    }

    // Verify membership belongs to current organization
    if (membership.organizationId !== auth.organizationId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Member does not belong to your organization",
      });
    }

    // Prevent changing owner's role
    if (membership.role === "owner") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Cannot change the owner's role",
      });
    }

    // Update the membership role
    await ctx.db.patch(args.memberId, {
      role: args.role,
    });

    return args.memberId;
  },
});

/**
 * Remove a member from the organization (owner or admin only)
 */
export const removeMember = mutation({
  args: {
    userId: v.id("user"),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    // Require owner or admin role
    requireRole(auth, ["owner", "admin"]);

    // Prevent removing self
    if (args.userId === auth.userId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Cannot remove yourself from the organization",
      });
    }

    // Find the membership
    const membership = await ctx.db
      .query("member")
      .withIndex("by_user_organization", (q) =>
        q.eq("userId", args.userId).eq("organizationId", auth.organizationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Member not found in this organization",
      });
    }

    // Prevent removing the owner
    if (membership.role === "owner") {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Cannot remove the organization owner",
      });
    }

    // Delete the membership
    await ctx.db.delete(membership._id);

    return args.userId;
  },
});

/**
 * Switch the active organization for the current user
 */
export const switchOrg = mutation({
  args: {
    organizationId: v.id("organization"),
  },
  handler: async (ctx, args) => {
    // Get authenticated user
    const user = await authComponent.getAuthUser(ctx);

    // Verify user is a member of the target organization
    const membership = await ctx.db
      .query("member")
      .withIndex("by_user_organization", (q) =>
        q.eq("userId", user._id).eq("organizationId", args.organizationId)
      )
      .unique();

    if (!membership) {
      throw new ConvexError({
        code: "NOT_MEMBER",
        message: "User is not a member of this organization",
      });
    }

    // Get the current session
    const session = await ctx.db
      .query("session")
      .withIndex("userId", (q) => q.eq("userId", user._id))
      .order("desc")
      .first();

    if (!session) {
      throw new ConvexError({
        code: "NO_SESSION",
        message: "No active session found",
      });
    }

    // Update the session's activeOrganizationId
    await ctx.db.patch(session._id, {
      activeOrganizationId: args.organizationId,
    });

    // Return the organization details
    const organization = await ctx.db.get(args.organizationId);
    return {
      organization,
      membership: {
        role: membership.role,
        joinedAt: membership.createdAt,
      },
    };
  },
});

/**
 * Update the current organization (owner or admin only)
 */
export const updateOrganization = mutation({
  args: {
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    logo: v.optional(v.string()),
    metadata: v.optional(v.record(v.any())),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    // Require owner or admin role
    requireRole(auth, ["owner", "admin"]);

    // Get the organization
    const organization = await ctx.db.get(auth.organizationId);

    if (!organization) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Organization not found",
      });
    }

    // Build update patch
    const patch: any = {};
    if (args.name !== undefined) patch.name = args.name;
    if (args.slug !== undefined) patch.slug = args.slug;
    if (args.logo !== undefined) patch.logo = args.logo;
    if (args.metadata !== undefined) patch.metadata = args.metadata;

    // Only update if there are changes
    if (Object.keys(patch).length > 0) {
      await ctx.db.patch(auth.organizationId, patch);

      // Create audit log
      await createAuditLog(
        ctx,
        auth,
        "organization.updated",
        "organization",
        auth.organizationId,
        { changes: patch }
      );
    }

    // Return the updated organization
    return await ctx.db.get(auth.organizationId);
  },
});
