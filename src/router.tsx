import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { authClient } from '@/lib/auth-client'
import { appConfig } from '@/config/app.config'

// Define the router context interface
export interface RouterContext {
  auth: {
    isAuthenticated: boolean
  }
}

// Get initial session state synchronously from authClient session atom
function getInitialSessionState(): { isAuthenticated: boolean } {
  // First check: If auth is disabled, skip all auth requirements
  // Returns authenticated=true so auth guards don't block navigation
  if (!appConfig.auth.enabled) {
    return { isAuthenticated: true }
  }

  // Second check: Ensure we're in a browser environment before accessing session atoms
  // SSR contexts don't have browser storage/cookies available
  if (typeof window === 'undefined') {
    return { isAuthenticated: false }
  }

  // Third check: Safely access the session atom with optional chaining
  // The authClient may not be fully initialized during SSR/hydration
  const sessionAtom = authClient.$store?.atoms?.session

  // Fourth check: Verify the atom has a get method before calling it
  if (!sessionAtom || typeof sessionAtom.get !== 'function') {
    return { isAuthenticated: false }
  }

  // Fifth check: Extract session data and verify user exists
  const sessionData = sessionAtom.get()
  const isAuthenticated = !!sessionData?.data?.user

  return { isAuthenticated }
}

// Create a new router instance
export const getRouter = () => {
  const router = createRouter({
    routeTree,
    context: {
      auth: getInitialSessionState(),
    },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  })

  return router
}

// Register the router context for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof getRouter>
  }
}
