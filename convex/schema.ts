import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Application schema extending Better Auth's managed tables.
 * Better Auth automatically provides: user, session, organization, member, invitation
 */
export default defineSchema({
  /**
   * Projects table - organization-scoped projects
   */
  projects: defineTable({
    organizationId: v.id("organization"),
    name: v.string(),
    description: v.optional(v.string()),
    status: v.union(v.literal("active"), v.literal("archived")),
    createdBy: v.id("user"),
    updatedBy: v.id("user"),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_status", ["organizationId", "status"]),

  /**
   * Tasks table - project tasks with assignee support
   */
  tasks: defineTable({
    organizationId: v.id("organization"),
    projectId: v.id("projects"),
    title: v.string(),
    description: v.optional(v.string()),
    status: v.union(
      v.literal("todo"),
      v.literal("in_progress"),
      v.literal("done")
    ),
    priority: v.union(
      v.literal("low"),
      v.literal("medium"),
      v.literal("high")
    ),
    assigneeId: v.optional(v.id("user")),
    createdBy: v.id("user"),
    dueDate: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_project", ["projectId"])
    .index("by_assignee", ["organizationId", "assigneeId"])
    .index("by_organization_status", ["organizationId", "status"]),

  /**
   * Audit log table - tracks all data changes
   */
  auditLog: defineTable({
    organizationId: v.id("organization"),
    userId: v.id("user"),
    action: v.string(),
    entityType: v.string(),
    entityId: v.string(),
    metadata: v.optional(v.any()),
    createdAt: v.number(),
  })
    .index("by_organization", ["organizationId"])
    .index("by_organization_time", ["organizationId", "createdAt"]),
});
