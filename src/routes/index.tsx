import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'
import { ClientOnly } from '@/components/shared/client-only'
import { appConfig } from '@/config/app.config'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <ClientOnly fallback={null}>
      <AuthAwareRedirect />
    </ClientOnly>
  )
}

function AuthAwareRedirect() {
  // Check auth feature flag first
  if (!appConfig.auth.enabled) {
    return <Navigate to="/app" />
  }

  const { data: session, isPending } = useSession()

  // Loading state - minimal since we're client-only
  if (isPending) {
    return null
  }

  // Redirect based on authentication status
  if (session?.user) {
    return <Navigate to="/app" />
  }

  return <Navigate to="/auth/login" />
}
