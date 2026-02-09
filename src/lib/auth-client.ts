import { createAuthClient } from "better-auth/react";
import {
  convexClient,
  crossDomainClient,
} from "@convex-dev/better-auth/client/plugins";
import { organizationClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  // Point to the Convex site URL where Better Auth routes are hosted
  baseURL: import.meta.env.VITE_CONVEX_SITE_URL,
  plugins: [
    // Required for Convex integration
    convexClient(),
    // Required for client-side frameworks (React SPA) to handle cross-domain cookies
    crossDomainClient(),
    // Enable organization/team support
    organizationClient(),
  ],
});

// Export commonly used methods for convenience
export const {
  signIn,
  signUp,
  signOut,
  useSession,
  organization,
} = authClient;
