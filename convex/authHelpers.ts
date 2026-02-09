import { ConvexError } from "convex/values";
import { authComponent } from "./auth";

/**
 * Auth context returned by requireAuth
 */
export interface AuthContext {
  userId: string;
  organizationId: string;
  membership: {
    role: string;
    joinedAt: number;
  };
}

/**
 * Require authentication and return auth context with organization membership
 * @throws {ConvexError} UNAUTHORIZED - if user is not authenticated
 * @throws {ConvexError} NO_ORGANIZATION - if user has no active organization
 * @throws {ConvexError} NOT_MEMBER - if user is not a member of the organization
 */
export async function requireAuth(ctx: any): Promise<AuthContext> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // Get authenticated user from Better Auth
  const user = await authComponent.getAuthUser(ctx);

  if (!user) {
    throw new ConvexError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  // Get active organization from user's session
  const activeOrganizationId = (user as any).session?.activeOrganizationId;

  if (!activeOrganizationId) {
    throw new ConvexError({
      code: "NO_ORGANIZATION",
      message: "No active organization selected",
    });
  }

  // Verify user is a member of the organization from Better Auth component
  const membership = await (ctx.db as any)
    .query("member")
    .withIndex("by_user_organization", (q: any) =>
      q.eq("userId", user._id).eq("organizationId", activeOrganizationId)
    )
    .unique();

  if (!membership) {
    throw new ConvexError({
      code: "NOT_MEMBER",
      message: "User is not a member of this organization",
    });
  }

  return {
    userId: user._id,
    organizationId: activeOrganizationId,
    membership: {
      role: membership.role,
      joinedAt: membership.createdAt,
    },
  };
}

/**
 * Require specific role(s) for the authenticated user
 * @throws {ConvexError} FORBIDDEN - if user does not have required role
 */
export function requireRole(
  auth: AuthContext,
  allowedRoles: string[]
): void {
  if (!allowedRoles.includes(auth.membership.role)) {
    throw new ConvexError({
      code: "FORBIDDEN",
      message: `Insufficient permissions. Required roles: ${allowedRoles.join(", ")}`,
      requiredRoles: allowedRoles,
      currentRole: auth.membership.role,
    });
  }
}

/**
 * Helper to create audit log entry
 */
export async function createAuditLog(
  ctx: any,
  auth: AuthContext,
  action: string,
  entityType: string,
  entityId: string,
  metadata?: any
): Promise<void> {
  await ctx.db.insert("auditLog", {
    organizationId: auth.organizationId as any,
    userId: auth.userId as any,
    action,
    entityType,
    entityId,
    metadata,
    createdAt: Date.now(),
  });
}
