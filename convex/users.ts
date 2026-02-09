import { query } from "./_generated/server";
import { authComponent } from "./auth";

/**
 * Get the currently authenticated user
 */
export const getCurrent = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return null;
    }

    return user;
  },
});

/**
 * Get the current user with their active organization and membership details
 */
export const getCurrentWithOrg = query({
  args: {},
  handler: async (ctx) => {
    const user = await authComponent.safeGetAuthUser(ctx);

    if (!user) {
      return null;
    }

    // Get active organization from user's session
    const organizationId = user.session?.activeOrganizationId;

    if (!organizationId) {
      return {
        user,
        organization: null,
        membership: null,
      };
    }

    // Fetch organization details
    const organization = await ctx.db.get(organizationId);

    // Get membership details
    const membership = await ctx.db
      .query("member")
      .withIndex("by_user_organization", (q) =>
        q.eq("userId", user._id).eq("organizationId", organizationId)
      )
      .unique();

    return {
      user,
      organization,
      membership: membership
        ? {
            role: membership.role,
            joinedAt: membership.createdAt,
          }
        : null,
    };
  },
});
