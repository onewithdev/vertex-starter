import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useSession } from '@/lib/auth-client'
import { Skeleton } from '@/components/ui/skeleton'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  const { data: session, isPending } = useSession()

  // Show loading state while checking auth status
  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-4">
        <div className="flex flex-col items-center space-y-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    )
  }

  // Redirect based on authentication status
  if (session?.user) {
    return <Navigate to="/app" />
  }

  return <Navigate to="/auth/login" />
}
