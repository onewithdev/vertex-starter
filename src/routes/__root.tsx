/// <reference types="vite/client" />
import { HeadContent, Scripts, createRootRouteWithContext, useRouter } from '@tanstack/react-router'
import { TanStackRouterDevtoolsPanel } from '@tanstack/react-router-devtools'
import { TanStackDevtools } from '@tanstack/react-devtools'
import { ConvexReactClient } from "convex/react"
import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { authClient, useSession } from "@/lib/auth-client"
import { appConfig } from "@/config/app.config"
import { useState, useEffect } from "react"
import type { RouterContext } from "@/router"

import appCss from '../styles.css?url'

// Create the root route with context
export const Route = createRootRouteWithContext<RouterContext>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Vertex Stack',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
    ],
  }),

  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  // Initialize Convex client with environment variable
  const [convex] = useState(() => 
    new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string, {
      // Optional: pause queries until authenticated
      // expectAuth: true,
    })
  )

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <ConvexBetterAuthProvider client={convex} authClient={authClient}>
          <AuthWrapper>
            {children}
          </AuthWrapper>
          <TanStackDevtools
            config={{
              position: 'bottom-right',
            }}
            plugins={[
              {
                name: 'Tanstack Router',
                render: <TanStackRouterDevtoolsPanel />,
              },
            ]}
          />
        </ConvexBetterAuthProvider>
        <Scripts />
      </body>
    </html>
  )
}

// Auth wrapper to provide authentication context to the router
function AuthWrapper({ children }: { children: React.ReactNode }) {
  // If auth is disabled, use the disabled auth wrapper
  if (!appConfig.auth.enabled) {
    return <AuthDisabledWrapper>{children}</AuthDisabledWrapper>
  }

  return <AuthEnabledWrapper>{children}</AuthEnabledWrapper>
}

// Wrapper when auth is disabled - sets auth state to true without reading session
function AuthDisabledWrapper({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (hasMounted) {
      router.update({
        context: {
          auth: {
            isAuthenticated: true,
          },
        },
      })
    }
  }, [hasMounted, router])

  // Return a wrapper that matches server rendering to prevent hydration issues
  if (!hasMounted) {
    return <>{children}</>
  }

  return <>{children}</>
}

// Wrapper when auth is enabled - handles session-based auth
function AuthEnabledWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession()
  const router = useRouter()
  const [hasMounted, setHasMounted] = useState(false)

  // Prevent hydration mismatch by not updating context until after mount
  useEffect(() => {
    setHasMounted(true)
  }, [])

  useEffect(() => {
    if (!isPending && hasMounted) {
      const isAuthenticated = !!session?.user
      
      // Update router context with authentication state
      router.update({
        context: {
          auth: {
            isAuthenticated,
          },
        },
      })

      // Trigger a reload of the current route to re-evaluate beforeLoad guards
      // This handles the case where session loads after initial route resolution
      router.invalidate()
    }
  }, [session, isPending, router, hasMounted])

  // Return a wrapper that matches server rendering to prevent hydration issues
  if (!hasMounted) {
    return <>{children}</>
  }

  return <>{children}</>
}
