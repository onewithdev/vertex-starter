import { query, mutation } from "./_generated/server";
import { v, ConvexError } from "convex/values";
import {
  requireAuth,
  requireRole,
  createAuditLog,
  type AuthContext,
} from "./authHelpers";

/**
 * List all projects for the current organization
 */
export const list = query({
  args: {},
  handler: async (ctx) => {
    const auth = await requireAuth(ctx);

    const projects = await ctx.db
      .query("projects")
      .withIndex("by_organization", (q) =>
        q.eq("organizationId", auth.organizationId)
      )
      .order("desc")
      .take(100);

    return projects;
  },
});

/**
 * Get a single project by ID
 */
export const get = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    if (project.organizationId !== auth.organizationId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Project does not belong to your organization",
      });
    }

    return project;
  },
});

/**
 * Get a project with its tasks
 */
export const getWithTasks = query({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    // Get and verify project ownership
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    if (project.organizationId !== auth.organizationId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Project does not belong to your organization",
      });
    }

    // Get tasks for this project
    const tasks = await ctx.db
      .query("tasks")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .order("desc")
      .collect();

    return {
      project,
      tasks,
    };
  },
});

/**
 * Create a new project
 */
export const create = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    const now = Date.now();

    const projectId = await ctx.db.insert("projects", {
      organizationId: auth.organizationId,
      name: args.name,
      description: args.description,
      status: "active",
      createdBy: auth.userId,
      updatedBy: auth.userId,
      createdAt: now,
      updatedAt: now,
    });

    // Create audit log
    await createAuditLog(
      ctx,
      auth,
      "project.created",
      "project",
      projectId,
      { name: args.name }
    );

    return projectId;
  },
});

/**
 * Update a project
 */
export const update = mutation({
  args: {
    projectId: v.id("projects"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(v.literal("active"), v.literal("archived"))),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    // Get and verify project ownership
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    if (project.organizationId !== auth.organizationId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Project does not belong to your organization",
      });
    }

    // Check role permissions for archiving
    if (args.status === "archived") {
      requireRole(auth, ["owner", "admin"]);
    }

    // Build update patch
    const patch: any = {
      updatedBy: auth.userId,
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) patch.name = args.name;
    if (args.description !== undefined) patch.description = args.description;
    if (args.status !== undefined) patch.status = args.status;

    await ctx.db.patch(args.projectId, patch);

    // Create audit log
    await createAuditLog(
      ctx,
      auth,
      "project.updated",
      "project",
      args.projectId,
      { changes: patch }
    );

    return args.projectId;
  },
});

/**
 * Archive a project (convenience method)
 */
export const archive = mutation({
  args: {
    projectId: v.id("projects"),
  },
  handler: async (ctx, args) => {
    const auth = await requireAuth(ctx);

    // Require owner or admin role
    requireRole(auth, ["owner", "admin"]);

    // Get and verify project ownership
    const project = await ctx.db.get(args.projectId);

    if (!project) {
      throw new ConvexError({
        code: "NOT_FOUND",
        message: "Project not found",
      });
    }

    if (project.organizationId !== auth.organizationId) {
      throw new ConvexError({
        code: "FORBIDDEN",
        message: "Project does not belong to your organization",
      });
    }

    await ctx.db.patch(args.projectId, {
      status: "archived",
      updatedBy: auth.userId,
      updatedAt: Date.now(),
    });

    // Create audit log
    await createAuditLog(
      ctx,
      auth,
      "project.archived",
      "project",
      args.projectId,
      { previousStatus: project.status }
    );

    return args.projectId;
  },
});


