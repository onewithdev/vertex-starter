import { createRouter } from '@tanstack/react-router'

// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { authClient } from '@/lib/auth-client'

// Define the router context interface
export interface RouterContext {
  auth: {
    isAuthenticated: boolean
  }
}

// Get initial session state synchronously from authClient session atom
function getInitialSessionState(): { isAuthenticated: boolean } {
  // Access the session atom from $store.atoms - it's a nanostore atom
  const sessionAtom = authClient.$store?.atoms?.session
  if (sessionAtom && typeof sessionAtom.get === 'function') {
    const sessionData = sessionAtom.get()
    return {
      isAuthenticated: !!sessionData?.data?.user,
    }
  }
  return { isAuthenticated: false }
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
