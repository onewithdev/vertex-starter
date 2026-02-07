import { createClient, type GenericCtx } from "@convex-dev/better-auth";
import { convex, crossDomain } from "@convex-dev/better-auth/plugins";
import { components } from "./_generated/api";
import { DataModel } from "./_generated/dataModel";
import { query } from "./_generated/server";
import { betterAuth } from "better-auth/minimal";
import { organization } from "better-auth/plugins";
import authConfig from "./auth.config";

const siteUrl = process.env.SITE_URL!;

// Create the component client for Convex-Better Auth integration
export const authComponent = createClient<DataModel>(components.betterAuth, {
  verbose: false,
});

// Better Auth configuration factory
export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: [siteUrl],
    database: authComponent.adapter(ctx),
    
    // Email/password authentication
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false, // Set to true in production
    },
    
    // Social providers (optional - configure as needed)
    // socialProviders: {
    //   github: {
    //     clientId: process.env.GITHUB_CLIENT_ID!,
    //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    //   },
    // },
    
    plugins: [
      // Cross-domain support for client-side frameworks
      crossDomain({ siteUrl }),
      
      // Convex integration plugin
      convex({ authConfig }),
      
      // Organizations plugin for multi-tenancy
      organization({
        allowUserToCreateOrganization: true,
        organizationLimit: 5, // Max orgs per user
        membershipLimit: 100, // Max members per org
        creatorRole: "owner", // Role assigned to org creator
      }),
    ],
  });
};

// Helper query to get current authenticated user
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx);
  },
});
